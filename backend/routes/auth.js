const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateProfile,
  refreshToken,
} = require("../controllers/authController");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
});

// Register route with file upload
router.post("/register", upload.single("profilePhoto"), register);

// Login route
router.post("/login", login);

// Refresh token route
router.post("/refresh", refreshToken);

// Update profile route (protected)
router.put("/profile", auth, upload.single("profilePhoto"), updateProfile);

module.exports = router;
