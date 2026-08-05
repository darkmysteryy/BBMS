// controllers/hospital.controller.js
// Handles hospital profile — view and update

const Hospital = require("../models/Hospital");
const User = require("../models/User");
const { sendSuccess } = require("../utils/apiResponse");

// ─── Get Hospital Profile ──────────────────────────────────────────────────────
const getHospitalProfile = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id }).populate("userId", "name email phone");

    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, "Hospital profile fetched.", hospital);
  } catch (error) {
    next(error);
  }
};

// ─── Update Hospital Profile ───────────────────────────────────────────────────
const updateHospitalProfile = async (req, res, next) => {
  try {
    const { address, contactPerson, phone } = req.body;

    const hospital = await Hospital.findOneAndUpdate(
      { userId: req.user._id },
      { address, contactPerson },
      { new: true }
    );

    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    if (phone) {
      await User.findByIdAndUpdate(req.user._id, { phone });
    }

    sendSuccess(res, 200, "Hospital profile updated.", hospital);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHospitalProfile, updateHospitalProfile };
