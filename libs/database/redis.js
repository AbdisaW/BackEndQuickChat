const { createClient } = require("redis");


const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "localhost"}:6379`,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected successfully!");
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
