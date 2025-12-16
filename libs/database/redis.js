const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
  },
});


redisClient.on("error", (err) => console.error("Redis Client Error", err));



module.exports = redisClient;
