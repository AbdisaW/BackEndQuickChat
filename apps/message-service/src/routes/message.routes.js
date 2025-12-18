const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message.controller');

// Send a new message
router.post('/messages', (req, res) => MessageController.sendMessage(req, res));

// Get conversation between two users
router.get('/conversations/:user1/:user2', (req, res) =>
  MessageController.getConversation(req, res)
);

// Mark conversation as read
router.put('/conversations/:user1/:user2/read', (req, res) =>
  MessageController.markAsRead(req, res)
);

// Get unread messages count for a user
router.get('/messages/unread/:userId', (req, res) =>
  MessageController.getUnreadCount(req, res)
);

module.exports = router;
