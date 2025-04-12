const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
// const path = require("path");
// const multer = require("multer");

dotenv.config();

// Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Not an image! Please upload an image."), false);
//     }
//   },
// });

// Create uploads directory if it doesn't exist
// const fs = require("fs");
// if (!fs.existsSync("uploads")) {
//   fs.mkdirSync("uploads");
// }

// Import routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/services"); // Import service routes
const forumRoutes = require('./routes/forumRoutes'); // Import forum routes

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// Serve static files from uploads directory
// app.use("/uploads", express.static("uploads"));

// Use routes with /api prefix
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes); // Use service routes
app.use('/api/forums', forumRoutes); // Use forum routes

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas 🚀");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
