const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

router.post('/messages', messageController.sendMessage);
router.get('/messages/user/:userId', messageController.getUserMessages);
router.get('/messages/conversation/:user1/:user2', messageController.getConversation);

module.exports = router;
