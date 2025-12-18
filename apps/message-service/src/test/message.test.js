const { io } = require("socket.io-client");
const mongoose = require("mongoose");
const { connectMongo } = require("../../../libs/database/mongo");
const Message = require("../models/message.model");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/quick_chat";

const runTest = async () => {
  await connectMongo(MONGO_URI);

  // Clear old messages
  await Message.deleteMany({});

  // Connect two clients
  const user1 = io("http://localhost:4002");
  const user2 = io("http://localhost:4002");

  // Join users
  user1.emit("join", "user1");
  user2.emit("join", "user2");

  // Listen for incoming messages
  user1.on("receive_message", (msg) => console.log("User1 received:", msg));
  user2.on("receive_message", (msg) => console.log("User2 received:", msg));

  // User1 sends a message to User2
  user1.emit("send_message", { from: "user1", to: "user2", text: "Hi user2" });

  // User2 sends back
  user2.emit("send_message", { from: "user2", to: "user1", text: "Hello user1" });

  // Wait a few seconds then check MongoDB
  setTimeout(async () => {
    const messages = await Message.find({});
    console.log("Saved messages:", messages);

    // Close connections and exit
    user1.disconnect();
    user2.disconnect();
    mongoose.connection.close();
  }, 2000);
};

runTest();
