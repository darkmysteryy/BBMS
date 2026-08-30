// models/Donation.js
// Records each blood donation made by a donor at a hospital

const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // Which donor donated blood?
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // At which hospital did the donation happen?
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    // Which inventory record did this donation add to?
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },

    // How many units were donated?
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // When did the donation happen?
    donationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Location/ward in the hospital
    location: {
      type: String,
      default: "Blood Bank Center",
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
