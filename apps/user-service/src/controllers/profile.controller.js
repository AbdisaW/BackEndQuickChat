const { uploadProfilePictureService } = require("../services/profile.service");

const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadProfilePictureService(
      req.user.email,
      req.file
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadProfilePicture };
