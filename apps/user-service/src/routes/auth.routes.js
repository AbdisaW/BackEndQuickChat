const express = require("express");
const { registerSchema } = require("../validators/auth.validator");
const { authMiddleware } = require("../../../../libs/auth/jwt");
const { register, verify, resend, login, getMyProfile, updateMyProfile, deleteMyProfile } = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/register", validate(registerSchema),register);
router.post("/verify-otp", verify);
router.post('/re-send',resend)
router.post('/login', login)


router.get("/user", authMiddleware, getMyProfile);
router.put("/user", authMiddleware, updateMyProfile);
router.delete("/user", authMiddleware, deleteMyProfile);


module.exports = router;
