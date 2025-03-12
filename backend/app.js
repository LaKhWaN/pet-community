const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

// Import routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cors());

// Use routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);

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
