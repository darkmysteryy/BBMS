// controllers/admin.controller.js
// Admin-only actions: approve hospital accounts and manage users

const User = require("../models/User");
const DonorProfile = require("../models/DonorProfile");
const Hospital = require("../models/Hospital");
const bcrypt = require("bcrypt");
const generateRegId = require("../utils/generateRegId");
const { sendSuccess } = require("../utils/apiResponse");

const ROLES = {
  ADMIN: "admin",
  DONOR: "donor",
  HOSPITAL: "hospital",
};

// ─── Seed Admin (one-time setup) ──────────────────────────────────────────────
const seedAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, seedKey } = req.body;

    if (seedKey !== process.env.ADMIN_SEED_KEY) {
      const error = new Error("Invalid seed key.");
      error.statusCode = 403;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique Registration ID for admin
    let uniqueIdFound = false;
    let registrationId;
    while (!uniqueIdFound) {
      registrationId = generateRegId();
      const existing = await User.findOne({ registrationId });
      if (!existing) uniqueIdFound = true;
    }

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: ROLES.ADMIN,
      registrationId,
    });

    sendSuccess(res, 201, "Admin created successfully.", { name: admin.name, email: admin.email, registrationId });
  } catch (error) {
    next(error);
  }
};

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
// Simple stats — admin only cares about account management
const getDashboardStats = async (req, res, next) => {
  try {
    const totalDonors = await User.countDocuments({ role: ROLES.DONOR });
    const totalHospitals = await User.countDocuments({ role: ROLES.HOSPITAL });

    // How many hospitals are still waiting for approval?
    const pendingHospitals = await Hospital.countDocuments({ verificationStatus: "pending" });
    const approvedHospitals = await Hospital.countDocuments({ verificationStatus: "approved" });

    sendSuccess(res, 200, "Dashboard stats fetched.", {
      totalDonors,
      totalHospitals,
      pendingHospitals,
      approvedHospitals,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get All Donors ────────────────────────────────────────────────────────────
const getAllDonors = async (req, res, next) => {
  try {
    const { search } = req.query;

    const filter = { role: ROLES.DONOR };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const donors = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    const donorsWithProfile = await Promise.all(
      donors.map(async (donor) => {
        const profile = await DonorProfile.findOne({ userId: donor._id });
        return { ...donor.toObject(), profile };
      })
    );

    sendSuccess(res, 200, "Donors fetched.", donorsWithProfile);
  } catch (error) {
    next(error);
  }
};

// ─── Get All Hospitals ─────────────────────────────────────────────────────────
const getAllHospitals = async (req, res, next) => {
  try {
    const { search, verificationStatus } = req.query;

    const userFilter = { role: ROLES.HOSPITAL };
    if (search) {
      userFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const hospitalUsers = await User.find(userFilter).select("-password");

    const hospitalsWithProfile = await Promise.all(
      hospitalUsers.map(async (user) => {
        const profile = await Hospital.findOne({ userId: user._id });
        return { ...user.toObject(), profile };
      })
    );

    let result = hospitalsWithProfile;
    if (verificationStatus) {
      result = hospitalsWithProfile.filter(
        (h) => h.profile?.verificationStatus === verificationStatus
      );
    }

    sendSuccess(res, 200, "Hospitals fetched.", result);
  } catch (error) {
    next(error);
  }
};

// ─── Verify or Reject Hospital Account ────────────────────────────────────────
// This is the core admin function — approving hospital registrations
const updateHospitalVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;

    if (!verificationStatus) {
      const error = new Error("verificationStatus is required.");
      error.statusCode = 400;
      throw error;
    }

    const hospital = await Hospital.findByIdAndUpdate(
      id,
      { verificationStatus },
      { new: true }
    ).populate("userId", "name email");

    if (!hospital) {
      const error = new Error("Hospital not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, `Hospital ${verificationStatus} successfully.`, hospital);
  } catch (error) {
    next(error);
  }
};

// ─── Toggle User Active/Inactive ──────────────────────────────────────────────
const toggleUserActive = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    user.isActive = !user.isActive;
    await user.save();

    sendSuccess(
      res,
      200,
      `User has been ${user.isActive ? "activated" : "deactivated"}.`,
      user
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get Public List of Approved Hospitals (for donors) ───────────────────────
// No auth required — donors need to see which hospitals are available
const getApprovedHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find({ verificationStatus: "approved" })
      .select("hospitalName address contactPerson")
      .sort({ hospitalName: 1 });

    sendSuccess(res, 200, "Approved hospitals fetched.", hospitals);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  seedAdmin,
  getDashboardStats,
  getAllDonors,
  getAllHospitals,
  updateHospitalVerification,
  toggleUserActive,
  getApprovedHospitals,
};
