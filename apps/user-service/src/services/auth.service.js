const bcrypt = require("bcrypt");
const { createUser, findByEmail, verifyUser } = require("../repositories/user.repository");
const { setOtp, getOtp, deleteOtp } = require("../models/otp.model");
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

const verifyOtp = async ({ email, otp }) => {
  const savedOtp = await getOtp(email);
  if (!savedOtp) throw new Error("OTP expired or not found");
  if (savedOtp !== otp) throw new Error("Invalid OTP");

  await verifyUser(email);
  await deleteOtp(email);

  return { message: "User verified successfully." };
};

const reSendOtp = async ({ email }) => {
  const user = await findByEmail(email);

  if (!user) throw new Error("User not found");
  if (user.status !== "PENDING") throw new Error("User already verified");

  const otp = crypto.randomInt(100000, 999999).toString();
  await setOtp(email, otp);

  console.log(`OTP for ${email}: ${otp}`);
  return { message: "OTP re-sent successfully" };
};

const loginUser = async ({ email, password }) => {
  const user = await findByEmail(email);
  if (!user) throw new Error("Invalid credentials!");

  if (user.status === "PENDING") {
    return { status: 403, message: "Your account is not verified. Please verify your email to continue.." };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials!");

  return {
    status: 200,
    message: "Login successful",
    user
  };
};


module.exports = { registerUser, verifyOtp, reSendOtp, loginUser };
