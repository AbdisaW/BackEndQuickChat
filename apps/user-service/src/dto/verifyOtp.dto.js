class VerifyOtpDTO {
  constructor({ email, otp }) {
    this.email = email;
    this.otp = otp;
  }

  validate() {
    if (!this.email) throw new Error("Email is required");
    if (!this.otp) throw new Error("OTP is required");
    return true;
  }
}

module.exports = VerifyOtpDTO;
