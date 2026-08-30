// controllers/inventory.controller.js
// Hospital manages its own blood inventory

const Inventory = require("../models/Inventory");
const Hospital = require("../models/Hospital");
const { sendSuccess } = require("../utils/apiResponse");

const LOW_STOCK_THRESHOLD = 10;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ─── Get This Hospital's Inventory ────────────────────────────────────────────
const getHospitalInventory = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    const { bloodGroup, status } = req.query;
    const filter = { hospital: hospital._id };
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (status) filter.status = status;

    const inventory = await Inventory.find(filter)
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    const lowStock = inventory.filter((item) => item.units < LOW_STOCK_THRESHOLD && item.status === "available");

    sendSuccess(res, 200, "Inventory fetched.", { inventory, lowStockCount: lowStock.length });
  } catch (error) {
    next(error);
  }
};

// ─── Public Inventory Summary (Donors can see this — no auth needed) ───────────
// Shows a summary of available blood per group across all approved hospitals
const getPublicInventorySummary = async (req, res, next) => {
  try {
    const summary = await Inventory.aggregate([
      { $match: { status: "available" } },
      {
        $group: {
          _id: "$bloodGroup",
          totalUnits: { $sum: "$units" },
          hospitalCount: { $addToSet: "$hospital" },
        },
      },
      {
        $project: {
          bloodGroup: "$_id",
          totalUnits: 1,
          hospitalsWithStock: { $size: "$hospitalCount" },
          _id: 0,
        },
      },
    ]);

    // Ensure all blood groups appear (even if 0 units)
    const result = BLOOD_GROUPS.map((group) => {
      const found = summary.find((s) => s.bloodGroup === group);
      return found || { bloodGroup: group, totalUnits: 0, hospitalsWithStock: 0 };
    });

    sendSuccess(res, 200, "Public inventory summary fetched.", result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHospitalInventory, getPublicInventorySummary };
