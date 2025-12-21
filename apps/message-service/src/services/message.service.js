const MessageRepository = require('../repositories/message.repository');

const sendMessage = async ({ from, to, text, type = 'text', url }) => {
  const conversationId = [from, to].sort().join('_');
  return await MessageRepository.createMessage({ conversationId, from, to, text, type, url });
};

const getConversation = async (user1, user2) => {
  const conversationId = [user1, user2].sort().join('_');
  return await MessageRepository.getConversation(user1, user2);
};

const getUserConversations = async (userId) => {
  return await MessageRepository.getUserConversations(userId);
};

const markConversationAsRead = async (user1, user2) => {
  const conversationId = [user1, user2].sort().join('_');
  return await MessageRepository.markAsRead(conversationId, user2);
};

const getUnreadMessagesCount = async (userId) => {
  return await MessageRepository.getUnreadCount(userId);
};

module.exports = { sendMessage, getConversation, markConversationAsRead, getUnreadMessagesCount, getUserConversations };
