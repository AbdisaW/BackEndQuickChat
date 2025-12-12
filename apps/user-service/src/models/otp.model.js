const redisClient = require('../../../../libs/database/redis');

const OTP_PREFIX = "otp:";

const setOtp = async (email, otp, ttl = 500) => { 
  await redisClient.setEx(`${OTP_PREFIX}${email}`, ttl, otp);
};

const getOtp = async (email) => {
  return await redisClient.get(`${OTP_PREFIX}${email}`);
};

const deleteOtp = async (email) => {
  await redisClient.del(`${OTP_PREFIX}${email}`);
};

module.exports = { setOtp, getOtp, deleteOtp };
