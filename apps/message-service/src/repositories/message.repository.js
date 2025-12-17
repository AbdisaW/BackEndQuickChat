const Message = require('../models/message.model');

const createMessage = async (data) => {
  const message = new Message(data);
  return await message.save();
};

const getMessagesByUser = async (userId) => {
  return await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  }).sort({ timestamp: -1 });
};

const getConversation = async (user1, user2) => {
  return await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 }
    ]
  }).sort({ timestamp: 1 });
};

module.exports = { createMessage, getMessagesByUser, getConversation };
