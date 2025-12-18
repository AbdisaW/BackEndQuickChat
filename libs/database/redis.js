const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "chat-redis",
    port: 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected successfully!");
};

module.exports = { redisClient, connectRedis };
