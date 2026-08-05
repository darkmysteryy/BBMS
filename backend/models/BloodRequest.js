// models/BloodRequest.js
// A request made by a hospital to get blood from the blood bank

const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    // Unique readable ID like "REQ-AP-1700000000000"
    requestId: {
      type: String,
      required: true,
      unique: true,
    },

    // Which hospital made this request?
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },

    // How many units are needed?
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // How urgent is this request?
    urgency: {
      type: String,
      enum: ["Normal", "Urgent", "Critical"],
      default: "Normal",
    },

    // By when does the hospital need the blood?
    requiredDate: {
      type: Date,
      required: true,
    },

    // Current status in the lifecycle
    status: {
      type: String,
      enum: ["Submitted", "Approved", "Rejected", "Dispatched"],
      default: "Submitted",
    },

    // Any notes from the hospital
    notes: {
      type: String,
      default: "",
    },

    // Which admin approved or rejected this request?
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // When was the blood dispatched?
    dispatchDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

module.exports = BloodRequest;
