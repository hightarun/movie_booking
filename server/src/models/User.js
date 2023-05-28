const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: Number,
    default: null,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  passwordResetCode: {
    type: Number,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
