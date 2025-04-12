const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  refreshToken: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
