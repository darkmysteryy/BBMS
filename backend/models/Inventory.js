// models/Inventory.js
// Tracks blood units in a specific hospital's inventory

const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    // Which hospital owns this blood stock?
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },

    // How many units of blood are available
    units: {
      type: Number,
      required: true,
      min: 0,
    },

    // When was this blood collected?
    collectionDate: {
      type: Date,
      required: true,
    },

    // Blood expires after a certain period
    expiryDate: {
      type: Date,
      required: true,
    },

    // Which donor donated this blood? (optional)
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Is this blood available, expired, or already used?
    status: {
      type: String,
      enum: ["available", "expired", "used"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
