const express = require("express");
const { register, verify, reSend } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verify);
router.post('/re-send',reSend)

module.exports = router;
