const redisClient = require("../../../../libs/database/redis");

exports.generateOtp = async (userId) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  await redisClient.setEx(`otp:${userId}`, 600, otp); // 10 min expiry
  return otp;
};

exports.verifyOtp = async (userId, otp) => {
  const key = `otp:${userId}`;
  const storedOtp = await redisClient.get(key);
  if (!storedOtp) throw new Error("OTP expired or not found");
  if (storedOtp !== otp) throw new Error("Invalid OTP");
  await redisClient.del(key); // remove OTP after verification
  return true;
};
