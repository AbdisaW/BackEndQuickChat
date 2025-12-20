const User = require("../models/user.model");

const createUser = async (data) => {
  return await User.create(data);
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const updateProfilePicture = async (userId, fileUrl) => {
  return User.update(
    { profilePicture: fileUrl },
    { where: { id: userId } }
  );
};

const verifyUser = async (email) => {
  return await User.update(
    { isVerified: true, status: "ACTIVE" },
    { where: { email } }
  );
};
const getUserById = async (id) => {
  return await User.findByPk(id);
};

const findUserById = async (id) => {
  return User.findByPk(id);
};

const updateUserById = async (id, data) => {
  const [affectedRows] = await User.update(data, { where: { id }});
  return affectedRows; 
};

const deleteUserById = async (id) => {
  return await User.destroy({ where: { id } });
};

const findAllUsers = async () => {
  return await User.findAll();
};


module.exports = {
   createUser, 
   findByEmail, 
   verifyUser, 
   updateProfilePicture,
   getUserById,
   updateUserById,
   deleteUserById, findAllUsers, findUserById
};
