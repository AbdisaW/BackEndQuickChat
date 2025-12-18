const { io } = require("socket.io-client");

const SOCKET_URL = "http://localhost:4002"; // message-service URL

// Simulate two users
const users = ["user1", "user2"];
const sockets = [];

users.forEach((userId) => {
  const socket = io(SOCKET_URL);

  socket.on("connect", () => {
    console.log(`${userId} connected`);
    socket.emit("join", userId);
  });

  socket.on("disconnect", () => {
    console.log(`${userId} disconnected`);
  });

  sockets.push(socket);
});

// Disconnect after 30 seconds
setTimeout(() => {
  sockets.forEach((socket) => socket.disconnect());
  console.log("All users disconnected");
  process.exit(0);
}, 30000);
