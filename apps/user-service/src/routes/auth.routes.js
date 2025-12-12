const express = require("express");
const { registerSchema } = require("../validators/auth.validator");

const { register, verify, resend, login } = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/register", validate(registerSchema),register);
router.post("/verify-otp", verify);
router.post('/re-send',resend)
router.post('/login', login)


module.exports = router;
