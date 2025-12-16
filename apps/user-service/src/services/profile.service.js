const { uploadFile } = require("./storage/storageServiceClient");
const { findByEmail, updateProfilePicture } = require("../repositories/user.repository");

const uploadProfilePictureService = async (email, file) => {
  // 1. Upload to storage-service
  const fileUrl = await uploadFile(file.originalname, file.buffer);
  // 2. Replace hostname with public frontend host

  const publicHost = process.env.MINIO_PUBLIC_HOST || 'localhost';
  const port = process.env.MINIO_PORT || '9000';
  const publicFileUrl = fileUrl.replace(/http:\/\/[^/]+/, `http://${publicHost}:${port}`);
  // 2. Find user
  const user = await findByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  // 3. Save URL in DB
  await updateProfilePicture(user.id, publicFileUrl);

  // 4. Return result
  return {
    message: "Profile picture uploaded successfully",
    publicFileUrl,
  };
};

module.exports = { uploadProfilePictureService };
