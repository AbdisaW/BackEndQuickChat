const { uploadFile } = require("../services/storageServiceClient");
const { findByEmail, verifyUser } = require("../repositories/user.repository");

const uploadProfilePicture = async (req, res, next) => {
  try {
    const file = req.file; // multer middleware
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to storage-service
    const fileUrl = await uploadFile(file.originalname, file.buffer);

    // Save file URL in MySQL
    const user = await findByEmail(req.user.email);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ profilePicture: fileUrl });

    res.json({ message: "Profile picture uploaded successfully", fileUrl });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadProfilePicture };
