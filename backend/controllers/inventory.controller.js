// controllers/inventory.controller.js
// Admin manages the blood inventory

const Inventory = require("../models/Inventory");
const { sendSuccess } = require("../utils/apiResponse");
const LOW_STOCK_THRESHOLD = 10;

// ─── Get All Inventory ─────────────────────────────────────────────────────────
const getAllInventory = async (req, res, next) => {
  try {
    const { bloodGroup, status } = req.query;

    // Build filter object based on query params
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (status) filter.status = status;

    const inventory = await Inventory.find(filter)
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    // Check which blood groups are low stock
    const lowStock = inventory.filter((item) => item.units < LOW_STOCK_THRESHOLD);

    sendSuccess(res, 200, "Inventory fetched.", { inventory, lowStockCount: lowStock.length });
  } catch (error) {
    next(error);
  }
};

// ─── Add Inventory ─────────────────────────────────────────────────────────────
const addInventory = async (req, res, next) => {
  try {
    const { bloodGroup, units, collectionDate, expiryDate, donor } = req.body;

    if (!bloodGroup || !units || !collectionDate || !expiryDate) {
      const error = new Error("bloodGroup, units, collectionDate, and expiryDate are required.");
      error.statusCode = 400;
      throw error;
    }

    const item = await Inventory.create({ bloodGroup, units, collectionDate, expiryDate, donor });

    sendSuccess(res, 201, "Inventory added.", item);
  } catch (error) {
    next(error);
  }
};

// ─── Update Inventory ──────────────────────────────────────────────────────────
const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { units, status, expiryDate } = req.body;

    const item = await Inventory.findByIdAndUpdate(
      id,
      { units, status, expiryDate },
      { new: true }
    );

    if (!item) {
      const error = new Error("Inventory item not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, "Inventory updated.", item);
  } catch (error) {
    next(error);
  }
};

// ─── Delete Inventory ──────────────────────────────────────────────────────────
const deleteInventory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByIdAndDelete(id);

    if (!item) {
      const error = new Error("Inventory item not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, "Inventory item deleted.");
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllInventory, addInventory, updateInventory, deleteInventory };
