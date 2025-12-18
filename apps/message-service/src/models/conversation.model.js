const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String }], // [userId1, userId2]
  lastMessage: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversationSchema);
