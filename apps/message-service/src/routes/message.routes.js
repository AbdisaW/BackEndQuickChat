const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../../../../libs/auth/jwt");

const MessageController = require('../controllers/message.controller');

// Send a new message
router.post('/messages',authMiddleware, (req, res) => MessageController.sendMessage(req, res));

// Get conversation between two users
router.get('/conversations/:user1/:user2', authMiddleware,(req, res) =>
  MessageController.getConversation(req, res)
);

router.get('/conversations', authMiddleware, (req, res) =>
  MessageController.getUserConversations(req, res)
);

// Mark conversation as read
router.put('/conversations/:user1/:user2/read', authMiddleware,(req, res) =>
  MessageController.markAsRead(req, res)
);

// Get unread messages count for a user
router.get('/messages/unread/:userId',authMiddleware, (req, res) =>
  MessageController.getUnreadCount(req, res)
);

module.exports = router;
