// controllers/admin.controller.js
// Admin-only actions: dashboard stats, manage users, approve hospitals

const User = require("../models/User");
const DonorProfile = require("../models/DonorProfile");
const Hospital = require("../models/Hospital");
const Inventory = require("../models/Inventory");
const BloodRequest = require("../models/BloodRequest");
const Donation = require("../models/Donation");
const bcrypt = require("bcrypt");
const { sendSuccess } = require("../utils/apiResponse");

const ROLES = {
  ADMIN: "admin",
  DONOR: "donor",
  HOSPITAL: "hospital",
};

const HOSPITAL_VERIFICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const BLOOD_REQUEST_STATUS = {
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DISPATCHED: "Dispatched",
};

const LOW_STOCK_THRESHOLD = 10;


// ─── Seed Admin (one-time setup) ──────────────────────────────────────────────
const seedAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, seedKey } = req.body;

    // Verify the secret seed key from environment variables
    if (seedKey !== process.env.ADMIN_SEED_KEY) {
      const error = new Error("Invalid seed key.");
      error.statusCode = 403;
      throw error;
    }

    const existingAdmin = await User.findOne({ role: ROLES.ADMIN });
    if (existingAdmin) {
      const error = new Error("Admin already exists.");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: ROLES.ADMIN,
    });

    sendSuccess(res, 201, "Admin created successfully.", { name: admin.name, email: admin.email });
  } catch (error) {
    next(error);
  }
};

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const totalDonors = await User.countDocuments({ role: ROLES.DONOR });
    const totalHospitals = await User.countDocuments({ role: ROLES.HOSPITAL });

    // Total available blood units
    const inventoryData = await Inventory.aggregate([
      { $match: { status: "available" } },
      { $group: { _id: null, totalUnits: { $sum: "$units" } } },
    ]);
    const totalBloodUnits = inventoryData[0]?.totalUnits || 0;

    // Pending blood requests
    const pendingRequests = await BloodRequest.countDocuments({
      status: BLOOD_REQUEST_STATUS.SUBMITTED,
    });

    // Low stock alerts (blood groups with units < threshold)
    const lowStockItems = await Inventory.find({
      status: "available",
      units: { $lt: LOW_STOCK_THRESHOLD },
    });

    // Donations this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const donationsThisMonth = await Donation.countDocuments({
      donationDate: { $gte: startOfMonth },
    });

    sendSuccess(res, 200, "Dashboard stats fetched.", {
      totalDonors,
      totalHospitals,
      totalBloodUnits,
      pendingRequests,
      lowStockAlerts: lowStockItems.length,
      donationsThisMonth,
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

    // Attach donor profiles
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

    // Filter by verification status if provided
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

// ─── Verify or Reject Hospital ─────────────────────────────────────────────────
const updateHospitalVerification = async (req, res, next) => {
  try {
    const { id } = req.params; // Hospital profile ID
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

    // Flip the isActive status
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

module.exports = {
  seedAdmin,
  getDashboardStats,
  getAllDonors,
  getAllHospitals,
  updateHospitalVerification,
  toggleUserActive,
};
