const express = require('express');
const dotenv = require('dotenv');
const { connectMongo } = require('../../../libs/database/mongo');
const messageRoutes = require('./routes/message.routes');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectMongo(process.env.MONGO_URI);

// Routes
app.use('/api', messageRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Message service running on port ${PORT}`);
});
