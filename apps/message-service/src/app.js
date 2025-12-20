// src/app.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

const { connectMongo } = require('../../../libs/database/mongo');
const { connectRedis, redisClient } = require('../../../libs/database/redis');
const MessageService = require('./services/message.service');
const { verify } = require('../../../libs/auth/jwt'); // JWT verify
const messageRoutes = require('./routes/message.routes');

dotenv.config();

const app = express();
app.options('*', cors());

// --- CORS for REST API ---
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

const server = http.createServer(app);

// --- Socket.IO setup with CORS ---
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // allow your frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// --- Connect DBs ---
(async () => {
  await connectMongo(process.env.MONGO_URI);
  await connectRedis();

  server.listen(process.env.PORT || 4002, () => {
    console.log(`Message service running on port ${process.env.PORT || 4002}`);
  });
})();

// --- REST API routes ---
app.use('/api', messageRoutes);

// --- Socket.IO authentication middleware ---
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Unauthorized'));

  const user = verify(token);
  if (!user) return next(new Error('Invalid token'));

  socket.userId = user.id;
  next();
});

// --- Socket.IO events ---
io.on('connection', (socket) => {
  console.log(`Authenticated user connected: ${socket.userId}`);

  socket.on('join', async () => {
    socket.join(socket.userId);
    await redisClient.sAdd('online_users', socket.userId);
    console.log(`User ${socket.userId} joined`);
  });

  socket.on('send_message', async (data) => {
    const { to, text, conversationId } = data;
    const from = socket.userId;

    // Save message in DB / Mongo
    const message = await MessageService.sendMessage({ from, to, text, conversationId });

    // Emit message to receiver if online
    const isOnline = await redisClient.sIsMember('online_users', to);
    if (isOnline) io.to(to).emit('receive_message', message);

    // Optionally emit to sender to confirm sent message
    socket.emit('receive_message', message);
  });

  socket.on('disconnect', async () => {
    await redisClient.sRem('online_users', socket.userId);
    console.log(`User ${socket.userId} disconnected`);
  });
});

module.exports = { app, server, io };
