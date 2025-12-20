const express = require("express");
const { registerSchema } = require("../validators/auth.validator");
const { authMiddleware } = require("../../../../libs/auth/jwt");
const { register, verify, resend, login, getMyProfile, updateMyProfile, deleteMyProfile ,getUserById, listUsers, logout} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/register", validate(registerSchema),register);
router.post("/verify-otp", verify);
router.post('/re-send',resend)
router.post('/login', login)

router.post("/logout", authMiddleware, logout);
router.get("/user", authMiddleware, getMyProfile);
router.put("/user", authMiddleware, updateMyProfile);
router.delete("/user", authMiddleware, deleteMyProfile);

router.get("/users", authMiddleware, listUsers);

router.get("/users/:id", authMiddleware, getUserById);


module.exports = router;
