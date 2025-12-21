const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

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
  transports: ['websocket', 'polling'], // force websocket first, fallback to polling
});

// --- Connect DBs ---
(async () => {
  await connectMongo(process.env.MONGO_URI);
  await connectRedis();
  server.listen(process.env.PORT || 4002, () => {
    console.log(`Message service running on port ${process.env.PORT || 4002}`);
  });
})();

// REST API
app.use('/api', messageRoutes);

// Socket.IO auth
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Unauthorized'));

  const user = verify(token);
  if (!user) return next(new Error('Invalid token'));

  socket.userId = user.id;
  next();
});

// --- Socket.IO events ---
io.on('connection', (socket) => {
  const userId = socket.userId;
  socket.hasJoined = false;

  console.log(`User connected: ${userId} (${socket.id})`);

  // JOIN (multi-tab safe)
  socket.on('join', async () => {
    if (socket.hasJoined) return;
    socket.hasJoined = true;

    socket.join(userId);
    await redisClient.sAdd(`user_sockets:${userId}`, socket.id);

    const count = await redisClient.sCard(`user_sockets:${userId}`);
    if (count === 1) io.emit('user_online', userId);

    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // SEND MESSAGE
  socket.on('send_message', async ({ to, text }) => {
    const from = userId;
    const conversationId = [from, to].sort().join('_');

    const message = await MessageService.sendMessage({ from, to, text, conversationId });

    // Emit to all sockets of sender and receiver
    const fromSockets = await redisClient.sMembers(`user_sockets:${from}`);
    const toSockets = await redisClient.sMembers(`user_sockets:${to}`);
    [...fromSockets, ...toSockets].forEach(sid => io.to(sid).emit('receive_message', message));
  });

  // TYPING
  socket.on('typing', ({ to }) => {
    if (to) socket.to(to).emit('typing', { from: userId });
  });
  socket.on('stop_typing', ({ to }) => {
    if (to) socket.to(to).emit('stop_typing', { from: userId });
  });

  // DISCONNECT
  socket.on('disconnect', async () => {
    await redisClient.sRem(`user_sockets:${userId}`, socket.id);
    const count = await redisClient.sCard(`user_sockets:${userId}`);
    if (count === 0) io.emit('user_offline', userId);
    console.log(`Socket ${socket.id} disconnected for user ${userId}`);
  });
});

module.exports = { app, server, io };
