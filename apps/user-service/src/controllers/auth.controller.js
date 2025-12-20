
const { registerUser, verifyOtp, resendOtp, loginUser, getUserByIdService, updateUser, deleteUser, getAllUsers , logoutUser} = require("../services/auth.service");

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

const logout = async (req, res, next) => {
  try {
    const result = await logoutUser(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


const updateMyProfile = async (req, res, next) => {
  try {
    const user = await updateUser(req.user.id, req.body);
    res.status(200).json({user});
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

const listUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};


const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserByIdService(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};



module.exports = {
   register, verify, resend, login,logout,
   getMyProfile, updateMyProfile, deleteMyProfile, listUsers, getUserById
};
