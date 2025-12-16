const express = require("express");
const multer = require("multer");
const { uploadProfilePicture } = require("../controllers/profile.controller");
const {authMiddleware} = require("../../../../libs/auth/jwt"); // your auth middleware

const router = express.Router();
const upload = multer(); // memory storage

router.post(
  "/profile-picture",
  authMiddleware,
  upload.single("file"),
  uploadProfilePicture
);

module.exports = router;
