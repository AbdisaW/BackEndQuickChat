
const { registerUser, verifyOtp, resendOtp, loginUser, getUser, updateUser, deleteUser } = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.validatedBody); 
    return res.status(201).json(result);
   
  } catch (err) {
    next(err);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtp(email, otp);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const resend = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await resendOtp(email);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    console.log("req.user.id:", req.user.id);
    const user = await getUser(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


const updateMyProfile = async (req, res, next) => {
  try {
    const user = await updateUser(req.user.id, req.body);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const deleteMyProfile = async (req, res, next) => {
  try {
    const result = await deleteUser(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};




module.exports = {
   register, verify, resend, login,
   getMyProfile, updateMyProfile, deleteMyProfile
};
