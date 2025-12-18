const bcrypt = require("bcrypt");
const { createUser, findByEmail, verifyUser, getUserById, updateUserById, deleteUserById } = require("../repositories/user.repository");
const { setOtp, getOtp, deleteOtp } = require("../models/otp.model");
const {sign} = require('../../../../libs/auth/jwt')
const crypto = require("crypto");

const registerUser = async ({ firstName, lastName, email, password }) => {
  const existing = await findByEmail(email);
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ firstName, lastName, email, password: hashed });

  const otp = crypto.randomInt(100000, 999999).toString();
  await setOtp(email, otp);

  console.log(`OTP for ${email}: ${otp}`);
  return { message: "User registered. OTP sent." };
};

const verifyOtp = async (email, otp) => {
  const savedOtp = await getOtp(email);
  if (!savedOtp) throw new Error("OTP expired or not found");
  if (savedOtp !== otp) throw new Error("Invalid OTP");

  await verifyUser(email)
  await deleteOtp(email);

  return { message: "User verified successfully" };
};

const resendOtp = async (email) => {
  const user = await findByEmail(email);
  if (!user) throw new Error("User not found");

  if(user.status !== "PENDING") throw new Error ("user is active ")
  const otp = crypto.randomInt(100000, 999999).toString();
  await setOtp(email, otp);

  console.log(`Resent OTP for ${email}: ${otp}`);
  return { message: "OTP resent successfully" };
};
const loginUser = async (email, password) => {
  const user = await  findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  if (!user.isVerified) throw new Error("User not verified");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = sign({ id: user.id, email: user.email });
  const { password: _, ...userWithoutPassword } = user.toJSON();
  return { user: userWithoutPassword, token };
};

const getUser = async (id) => {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");
  const { password, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};




const updateUser = async (id, data) => {
  // 1️⃣ Get the user first via repository
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");

  // 2️⃣ Check if email is being updated and unique
  if (data.email && data.email !== user.email) {
    const existing = await findByEmail(data.email);
    if (existing) throw new Error("Email already in use by another user");
  }

  // 3️⃣ Hash password if provided
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // 4️⃣ Merge existing values with new data (partial update)
  const updatedData = {
    firstName: data.firstName || user.firstName,
    lastName: data.lastName || user.lastName,
    email: data.email || user.email,
    password: data.password || user.password,
    profilePicture: data.profilePicture ?? user.profilePicture
  };

  // 5️⃣ Update in DB via repository
  const affectedRows = await updateUserById(id, updatedData);
  if (!affectedRows) throw new Error("User not updated");

  // 6️⃣ Fetch updated user
  const updatedUser = await getUserById(id);
  if (!updatedUser) throw new Error("User not found after update");

  // 7️⃣ Return user without password
  const { password: _, ...userWithoutPassword } = updatedUser.toJSON();
  return userWithoutPassword;
};



const deleteUser = async (id) => {
  const deleted = await deleteUserById(id);
  if (!deleted) throw new Error("User not found");
  return { message: "User deleted successfully" };
};



module.exports = { 
  registerUser, verifyOtp, 
  resendOtp, loginUser,
  getUser, updateUser,
  deleteUser

};
