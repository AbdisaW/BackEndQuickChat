const Message = require('../models/message.model');

// Create a new message
const createMessage = async ({ conversationId, from, to, text }) => {
  return await Message.create({ conversationId, from, to, text });
};

// Get conversation messages between two users
const getConversation = async (user1, user2) => {
  const conversationId = [user1, user2].sort().join('_');
  return await Message.find({ conversationId }).sort({ createdAt: 1 });
};

// Mark all messages as read for a specific user
const markAsRead = async (conversationId, userId) => {
  return await Message.updateMany(
    { conversationId, to: userId, read: false },
    { $set: { read: true } }
  );
};

// Count unread messages for a user
const getUnreadCount = async (userId) => {
  return await Message.countDocuments({ to: userId, read: false });
};

module.exports = {
  createMessage,
  getConversation,
  markAsRead,
  getUnreadCount,
};
