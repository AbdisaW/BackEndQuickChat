const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const Message = require('./models/message.model');
const { connectMongo } = require('../../../libs/database/mongo');
const { connectRedis, redisClient } = require('../../../libs/database/redis');
const MessageService = require('./services/message.service');
const { verify } = require('../../../libs/auth/jwt');
const messageRoutes = require('./routes/message.routes');

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true },
  transports: ['websocket', 'polling'],
});

// ---------------- DB CONNECT ----------------
(async () => {
  await connectMongo(process.env.MONGO_URI);
  await connectRedis();
  server.listen(process.env.PORT || 4002, () => {
    console.log(`Message service running on port ${process.env.PORT || 4002}`);
  });
})();

// REST
app.use('/api', messageRoutes);

// ---------------- SOCKET AUTH ----------------
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Unauthorized'));

  const user = verify(token);
  if (!user) return next(new Error('Invalid token'));

  socket.userId = user.id;
  next();
});

// ---------------- SOCKET ----------------
io.on('connection', async (socket) => {
  const userId = socket.userId;
  console.log(`User connected: ${userId}`);

  socket.join(userId);
  await redisClient.sAdd(`user_sockets:${userId}`, socket.id);

  // ---------- ONLINE ----------
  const socketCount = await redisClient.sCard(`user_sockets:${userId}`);
  if (socketCount === 1) {
    await redisClient.sAdd('online_users', userId);
    socket.broadcast.emit('user_online', userId);
  }

  socket.emit('online_users', await redisClient.sMembers('online_users'));

  // ---------- OFFLINE → DELIVER ----------
  const offlineMessages = await Message.find({
    to: userId,
    status: 'sent',
  });

  for (const msg of offlineMessages) {
    socket.emit('receive_message', msg);

    msg.status = 'delivered';
    await msg.save();

    // notify sender ✔✔
    io.to(msg.from).emit('message_status', {
      chatId: msg.conversationId,
      messageId: msg._id,
      status: 'delivered',
    });
  }

  // ---------- SEND MESSAGE ----------
  socket.on('send_message', async ({ to, text }) => {
    const conversationId = [userId, to].sort().join('_');

    const message = await MessageService.sendMessage({
      from: userId,
      to,
      text,
      conversationId,
    });

    const fromSockets = await redisClient.sMembers(`user_sockets:${userId}`);
    const toSockets = await redisClient.sMembers(`user_sockets:${to}`);

    if (toSockets.length > 0) {
      message.status = 'delivered';
      await message.save();
    }

    [...fromSockets, ...toSockets].forEach((sid) =>
      io.to(sid).emit('receive_message', message)
    );
  });

  // ---------- READ (🟢) ----------
  socket.on('message_seen', async ({ messageId }) => {
    const msg = await Message.findById(messageId);
    if (!msg || msg.status === 'read') return;

    msg.status = 'read';
    await msg.save();

    // notify sender 🟢
    io.to(msg.from).emit('message_status', {
      chatId: msg.conversationId,
      messageId: msg._id,
      status: 'read',
    });
  });

  // ---------- TYPING ----------
  socket.on('typing', ({ to }) => {
    socket.to(to).emit('typing', { from: userId });
  });

  socket.on('stop_typing', ({ to }) => {
    socket.to(to).emit('stop_typing', { from: userId });
  });

  // ---------- DISCONNECT ----------
  socket.on('disconnect', async () => {
    await redisClient.sRem(`user_sockets:${userId}`, socket.id);

    const count = await redisClient.sCard(`user_sockets:${userId}`);
    if (count === 0) {
      await redisClient.sRem('online_users', userId);
      socket.broadcast.emit('user_offline', userId);
    }
  });
});

module.exports = { app, server, io };
