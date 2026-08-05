// models/User.js
// The main user account — shared by Admin, Donor, and Hospital

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // The role decides what this user can do in the system
    role: {
      type: String,
      enum: ["admin", "donor", "hospital"],
      required: true,
    },

    // Full name (for donors) or hospital name (for hospitals)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    // Is the user active? Admin can deactivate users
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
