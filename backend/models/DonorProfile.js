// models/DonorProfile.js
// Extra details specific to a donor — linked to the User model

const mongoose = require("mongoose");

const donorProfileSchema = new mongoose.Schema(
  {
    // Links this profile to a User account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    // Weight in kg — must be above 50kg to donate
    weight: {
      type: Number,
    },

    // When did this donor last donate blood?
    lastDonationDate: {
      type: Date,
      default: null,
    },

    // Calculated: lastDonationDate + 56 days
    // After this date, donor is eligible to donate again
    eligibleAfter: {
      type: Date,
      default: null,
    },

    // Any medical conditions that affect eligibility
    medicalStatus: {
      type: String,
      default: "Healthy",
    },

    // Is the donor currently available to donate?
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DonorProfile = mongoose.model("DonorProfile", donorProfileSchema);

module.exports = DonorProfile;
