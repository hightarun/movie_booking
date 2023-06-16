const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    min: [3, "Minimum 3 characters are required"],
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    min: [3, "Minimum 3 characters are required"],
    required: [true, "Username is required"],
  },
  role: {
    type: String,
    enum: {
      values: ["ADMIN", "USER"],
      message: "ADMIN and USER are the only valid options",
    },
    default: "USER",
  },
  email: {
    type: String,
    trim: true,
    unique: [true, "Email id must be unique"],
    required: [true, "Email ID is required"],
  },
  password: {
    type: String,
    trim: true,
    min: [6, "Minimum 6 characters are required"],
    required: [true, "Password is required"],
  },
  phone: {
    type: Number,
    default: null,
    validate: {
      validator: function (v) {
        return /\d{9,10}/.test(v);
      },
      message: `Please enter a valid phone number`,
    },
    required: [true, "Contact Number is required"],
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
