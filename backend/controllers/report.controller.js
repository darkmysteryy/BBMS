// controllers/report.controller.js
// Returns analytics data for the admin dashboard charts

const Donation = require("../models/Donation");
const BloodRequest = require("../models/BloodRequest");
const Inventory = require("../models/Inventory");
const User = require("../models/User");
const { sendSuccess } = require("../utils/apiResponse");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ─── Monthly Donations (last 6 months) ────────────────────────────────────────
const getMonthlyDonations = async (req, res, next) => {
  try {
    // Get donations grouped by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const donations = await Donation.aggregate([
      { $match: { donationDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$donationDate" },
            month: { $month: "$donationDate" },
          },
          totalDonations: { $sum: 1 },
          totalUnits: { $sum: "$quantity" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    sendSuccess(res, 200, "Monthly donations fetched.", donations);
  } catch (error) {
    next(error);
  }
};

// ─── Blood Group Distribution ──────────────────────────────────────────────────
const getBloodGroupDistribution = async (req, res, next) => {
  try {
    // Get total available units per blood group
    const distribution = await Inventory.aggregate([
      { $match: { status: "available" } },
      {
        $group: {
          _id: "$bloodGroup",
          totalUnits: { $sum: "$units" },
        },
      },
    ]);

    // Make sure all blood groups are represented (even if 0)
    const result = BLOOD_GROUPS.map((group) => {
      const found = distribution.find((d) => d._id === group);
      return { bloodGroup: group, totalUnits: found ? found.totalUnits : 0 };
    });

    sendSuccess(res, 200, "Blood group distribution fetched.", result);
  } catch (error) {
    next(error);
  }
};

// ─── Hospital Requests Summary ─────────────────────────────────────────────────
const getHospitalRequestsSummary = async (req, res, next) => {
  try {
    const summary = await BloodRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    sendSuccess(res, 200, "Hospital requests summary fetched.", summary);
  } catch (error) {
    next(error);
  }
};

// ─── Urgency Distribution ──────────────────────────────────────────────────────
const getUrgencyDistribution = async (req, res, next) => {
  try {
    const urgency = await BloodRequest.aggregate([
      {
        $group: {
          _id: "$urgency",
          count: { $sum: 1 },
        },
      },
    ]);

    sendSuccess(res, 200, "Urgency distribution fetched.", urgency);
  } catch (error) {
    next(error);
  }
};

// ─── Inventory Statistics ──────────────────────────────────────────────────────
const getInventoryStats = async (req, res, next) => {
  try {
    const stats = await Inventory.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalUnits: { $sum: "$units" },
        },
      },
    ]);

    sendSuccess(res, 200, "Inventory statistics fetched.", stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonthlyDonations,
  getBloodGroupDistribution,
  getHospitalRequestsSummary,
  getUrgencyDistribution,
  getInventoryStats,
};
