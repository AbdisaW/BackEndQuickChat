
const { registerUser, verifyOtp, resendOtp, loginUser } = require("../services/auth.service");

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

module.exports = { register, verify, resend, login };
