// models/Hospital.js
// Extra details specific to a hospital — linked to the User model

const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    // Links this profile to a User account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Official hospital registration number
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    // Name of the person who manages this account
    contactPerson: {
      type: String,
      required: true,
    },

    // Admin must approve hospital before it can request blood
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
