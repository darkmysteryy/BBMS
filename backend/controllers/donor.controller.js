// controllers/donor.controller.js
// Handles donor profile — view and update

const DonorProfile = require("../models/DonorProfile");
const User = require("../models/User");
const { sendSuccess } = require("../utils/apiResponse");

// ─── Get Donor Profile ─────────────────────────────────────────────────────────
const getDonorProfile = async (req, res, next) => {
  try {
    // Find donor profile linked to the logged-in user
    const profile = await DonorProfile.findOne({ userId: req.user._id }).populate("userId", "name email phone");

    if (!profile) {
      const error = new Error("Donor profile not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, "Donor profile fetched.", profile);
  } catch (error) {
    next(error);
  }
};

// ─── Update Donor Profile ──────────────────────────────────────────────────────
const updateDonorProfile = async (req, res, next) => {
  try {
    const { address, weight, availability, medicalStatus, phone } = req.body;

    // Update donor profile fields
    const profile = await DonorProfile.findOneAndUpdate(
      { userId: req.user._id },
      { address, weight, availability, medicalStatus },
      { new: true } // return the updated document
    );

    if (!profile) {
      const error = new Error("Donor profile not found.");
      error.statusCode = 404;
      throw error;
    }

    // Also update phone number on User if provided
    if (phone) {
      await User.findByIdAndUpdate(req.user._id, { phone });
    }

    sendSuccess(res, 200, "Profile updated successfully.", profile);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDonorProfile, updateDonorProfile };
