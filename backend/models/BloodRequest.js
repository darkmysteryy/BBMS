// models/BloodRequest.js
// A PUBLIC blood request posted by a donor — visible to ALL approved hospitals.
// Only ONE hospital can accept it (first-come-first-served, atomic).

const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    // Auto-generated unique readable ID
    requestId: {
      type: String,
      required: true,
      unique: true,
    },

    // The donor/patient who needs blood
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // NOT set at creation — filled only when a hospital accepts the request
    // This is how we enforce "only one hospital" — it's null until claimed
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null,
    },

    // When did a hospital accept this request?
    acceptedAt: {
      type: Date,
      default: null,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    urgency: {
      type: String,
      enum: ["Normal", "Urgent", "Critical"],
      default: "Normal",
    },

    // When does the patient need the blood by?
    requiredDate: {
      type: Date,
      required: true,
    },

    // Name of the patient who needs blood
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    // Donor's city/area — helps hospitals decide if they are nearby
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Any notes from the donor
    notes: {
      type: String,
      default: "",
    },

    // Status lifecycle:
    // Open     → visible to all hospitals, can be accepted
    // Accepted → claimed by one hospital, locked for others
    // Fulfilled→ hospital has provided the blood
    // Cancelled→ donor cancelled the request (only possible while Open)
    status: {
      type: String,
      enum: ["Open", "Accepted", "Fulfilled", "Cancelled"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

module.exports = BloodRequest;
