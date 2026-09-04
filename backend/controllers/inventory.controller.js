// controllers/inventory.controller.js
// Hospital manages its own blood inventory

const Inventory = require("../models/Inventory");
const Hospital = require("../models/Hospital");
const { sendSuccess } = require("../utils/apiResponse");

const LOW_STOCK_THRESHOLD = 10;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ─── Get Inventory ─────────────────────────────────────────────────────────────
const getInventory = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "hospital") {
      const hospital = await Hospital.findOne({ userId: req.user._id });
      if (!hospital) {
        const error = new Error("Hospital profile not found.");
        error.statusCode = 404;
        throw error;
      }
      filter.hospital = hospital._id;
    }

    const { bloodGroup, status } = req.query;
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

// ─── Add Inventory Item (Admin) ───────────────────────────────────────────────
const addInventoryItem = async (req, res, next) => {
  try {
    const { bloodGroup, units, status } = req.body;
    
    const collectionDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 42);

    const inventoryItem = await Inventory.create({
      bloodGroup,
      units,
      status: status || "available",
      collectionDate,
      expiryDate,
    });

    sendSuccess(res, 201, "Inventory item created.", inventoryItem);
  } catch (error) {
    next(error);
  }
};

// ─── Update Inventory Item (Admin) ────────────────────────────────────────────
const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bloodGroup, units, status } = req.body;

    const inventoryItem = await Inventory.findByIdAndUpdate(
      id,
      { bloodGroup, units, status },
      { new: true, runValidators: true }
    );

    if (!inventoryItem) {
      const error = new Error("Inventory item not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, "Inventory item updated.", inventoryItem);
  } catch (error) {
    next(error);
  }
};

// ─── Delete Inventory Item (Admin) ────────────────────────────────────────────
const deleteInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inventoryItem = await Inventory.findByIdAndDelete(id);

    if (!inventoryItem) {
      const error = new Error("Inventory item not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, "Inventory item deleted.", null);
  } catch (error) {
    next(error);
  }
};

module.exports = { getInventory, getPublicInventorySummary, addInventoryItem, updateInventoryItem, deleteInventoryItem };
