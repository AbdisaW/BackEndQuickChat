const User = require("../models/user.model");

const createUser = async (data) => {
  return await User.create(data);
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const verifyUser = async (email) => {
  return await User.update(
    { isVerified: true, status: "ACTIVE" },
    { where: { email } }
  );
};


module.exports = { createUser, findByEmail, verifyUser };
