const { io } = require('socket.io-client');

const SOCKET_URL = 'http://localhost:4002';

const user1 = io(SOCKET_URL);
const user2 = io(SOCKET_URL);

user1.on('connect', () => {
  console.log('User1 connected');
  user1.emit('join', 'user1');

  // Send message after both join
  setTimeout(() => {
    user1.emit('send_message', {
      from: 'user1',
      to: 'user2',
      text: 'Hello via Socket.IO',
    });
  }, 1000);
});

user2.on('connect', () => {
  console.log('User2 connected');
  user2.emit('join', 'user2');
});

user2.on('receive_message', (message) => {
  console.log('User2 received:', message.text);
  process.exit(0);
});
