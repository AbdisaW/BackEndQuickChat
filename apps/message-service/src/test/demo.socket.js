const { io } = require("socket.io-client");
const redis = require("redis");

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = 6379;

// Connect to Redis to read online users
const redisClient = redis.createClient({
  socket: { host: REDIS_HOST, port: REDIS_PORT },
});

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis for demo.");

  const user1 = io("http://localhost:4002");
  const user2 = io("http://localhost:4002");

  user1.on("connect", () => {
    console.log("User1 connected");
    user1.emit("join", "user1");
  });

  user2.on("connect", () => {
    console.log("User2 connected");
    user2.emit("join", "user2");
  });

  user1.on("receive_message", (msg) => console.log("User1 received:", msg.text));
  user2.on("receive_message", (msg) => console.log("User2 received:", msg.text));

  setTimeout(() => {
    user1.emit("send_message", { from: "user1", to: "user2", text: "Hello from User1" });
    user2.emit("send_message", { from: "user2", to: "user1", text: "Hello from User2" });
  }, 2000);

  // Show online users every 3 seconds
  const interval = setInterval(async () => {
    const onlineUsers = await redisClient.sMembers("online_users");
    console.log("Online Users:", onlineUsers);
  }, 3000);

  // Disconnect users after 10 seconds
  setTimeout(async () => {
    user1.disconnect();
    user2.disconnect();
    console.log("Users disconnected");

    clearInterval(interval); // ✅ stop reading from Redis
    await redisClient.quit(); // close Redis properly
  }, 10000);
})();
