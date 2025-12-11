const RegisterDTO = require("../dto/register.dto");
const VerifyOtpDTO = require("../dto/verifyOtp.dto");
const ResendOtpDTO = require("../dto/resendOtp.dto")
const LoginDTO = require('../dto/login.dto')
const { registerUser, verifyOtp, reSendOtp ,loginUser} = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const dto = new RegisterDTO(req.body);
    dto.validate();
    const result = await registerUser(dto);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const verify = async (req, res, next) => {
  try {
    const dto = new VerifyOtpDTO(req.body);
    dto.validate();
    const result = await verifyOtp(dto);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const reSend = async (req, res, next) => {
  try {
    const dto = new ResendOtpDTO(req.body)
    dto.validate();
    const result = await reSendOtp(dto)
    res.json(result)


  } catch (err) {
      next(err);

  }

}

const login = async (req, res, next) =>{
  try {
    const dto = new LoginDTO(req.body);
    dto.validate();

    const result = await loginUser(dto);

    return res.status(result.status).json(result);

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}


module.exports = { register, verify, reSend, login };
