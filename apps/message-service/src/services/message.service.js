const messageRepository = require('../repositories/message.repository');

const sendMessage = async ({ senderId, receiverId, content }) => {
  if (!senderId || !receiverId || !content) {
    throw new Error('senderId, receiverId and content are required');
  }
  return await messageRepository.createMessage({ senderId, receiverId, content });
};

const getUserMessages = async (userId) => {
  if (!userId) throw new Error('userId is required');
  return await messageRepository.getMessagesByUser(userId);
};

const getConversationBetweenUsers = async (user1, user2) => {
  if (!user1 || !user2) throw new Error('Both user IDs are required');
  return await messageRepository.getConversation(user1, user2);
};

module.exports = { sendMessage, getUserMessages, getConversationBetweenUsers };
