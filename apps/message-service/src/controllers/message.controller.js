const messageService = require('../services/message.service');

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = await messageService.sendMessage({ senderId, receiverId, content });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await messageService.getUserMessages(userId);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await messageService.getConversationBetweenUsers(user1, user2);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getUserMessages, getConversation };
