const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});


redisClient.on("error", (err) => console.error("Redis Client Error", err));



module.exports = redisClient;
