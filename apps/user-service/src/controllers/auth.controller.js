const RegisterDTO = require("../dto/register.dto");
const VerifyOtpDTO = require("../dto/verifyOtp.dto");
const ResendOtpDTO = require("../dto/resendOtp.dto")
const { registerUser, verifyOtp, reSendOtp } = require("../services/auth.service");

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

module.exports = { register, verify, reSend };
