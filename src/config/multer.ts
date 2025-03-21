import multer from "multer";

const storage = multer.memoryStorage();
const multerAvatarUpload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

export { multerAvatarUpload };
