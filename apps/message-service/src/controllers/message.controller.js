const MessageService = require('../services/message.service');

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { from, to, text } = req.body;
    const message = await MessageService.sendMessage({ from, to, text });
    return res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const conversation = await MessageService.getConversation(user1, user2);
    return res.status(200).json({ conversation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    const conversations = await MessageService.getUserConversations(userId);
    res.status(200).json({ conversations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Mark conversation as read
const markAsRead = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const result = await MessageService.markConversationAsRead(user1, user2);
    return res.status(200).json({ updated: result.modifiedCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

// Get unread messages count for a user
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await MessageService.getUnreadMessagesCount(userId);
    return res.status(200).json({ unreadCount: count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get unread count' });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  markAsRead,
  getUnreadCount,
  getUserConversations
};
