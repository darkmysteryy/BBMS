// controllers/donation.controller.js
// Hospital records walk-in donor donations — adds blood to hospital's own inventory

const Donation = require("../models/Donation");
const DonorProfile = require("../models/DonorProfile");
const User = require("../models/User");
const Inventory = require("../models/Inventory");
const Hospital = require("../models/Hospital");
const { sendSuccess } = require("../utils/apiResponse");

const DONOR_ELIGIBILITY_DAYS = 56;

// ─── Record a Donation (Hospital) ──────────────────────────────────────────────
// Hospital staff records a walk-in donor donation
// Blood units are added to THIS hospital's inventory
const createDonation = async (req, res, next) => {
  try {
    const { donorRegId, bloodGroup, quantity, collectionDate, location } = req.body;

    if (!donorRegId || !bloodGroup || !quantity || !collectionDate) {
      const error = new Error("donorRegId, bloodGroup, quantity, and collectionDate are required.");
      error.statusCode = 400;
      throw error;
    }

    // Find the hospital profile of the logged-in hospital user
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    // Find the User account using the 8-digit Registration ID
    const donorUser = await User.findOne({ registrationId: donorRegId, role: "donor" });
    if (!donorUser) {
      const error = new Error("No donor found with this Registration ID.");
      error.statusCode = 404;
      throw error;
    }

    // Find donor profile using the found User ID
    const donorProfile = await DonorProfile.findOne({ userId: donorUser._id });
    if (!donorProfile) {
      const error = new Error("Donor profile data is incomplete.");
      error.statusCode = 404;
      throw error;
    }

    // Check donor eligibility
    if (donorProfile.eligibleAfter && new Date() < donorProfile.eligibleAfter) {
      const error = new Error(
        `Donor is not eligible yet. Eligible after: ${donorProfile.eligibleAfter.toDateString()}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Calculate expiry: blood is typically valid for 42 days from collection
    const expiryDate = new Date(collectionDate);
    expiryDate.setDate(expiryDate.getDate() + 42);

    // Add the donated blood to THIS hospital's inventory
    const inventoryItem = await Inventory.create({
      hospital: hospital._id,
      bloodGroup,
      units: quantity,
      collectionDate,
      expiryDate,
      donor: donorUser._id,
      status: "available",
    });

    // Record the donation
    const donation = await Donation.create({
      donor: donorUser._id,
      hospital: hospital._id,
      inventory: inventoryItem._id,
      quantity,
      donationDate: collectionDate,
      location: location || hospital.hospitalName,
    });

    // Update donor profile: set last donation date and calculate next eligible date
    const eligibleAfter = new Date(collectionDate);
    eligibleAfter.setDate(eligibleAfter.getDate() + DONOR_ELIGIBILITY_DAYS);

    await DonorProfile.findOneAndUpdate(
      { userId: donorUser._id },
      { lastDonationDate: collectionDate, eligibleAfter }
    );

    sendSuccess(res, 201, "Donation recorded and added to hospital inventory.", donation);
  } catch (error) {
    next(error);
  }
};

// ─── Get All Donations at This Hospital ───────────────────────────────────────
const getHospitalDonations = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    const donations = await Donation.find({ hospital: hospital._id })
      .populate("donor", "name email")
      .populate("inventory", "bloodGroup units")
      .sort({ donationDate: -1 });

    sendSuccess(res, 200, "Hospital donations fetched.", donations);
  } catch (error) {
    next(error);
  }
};

// ─── Get Donations for Logged-in Donor ────────────────────────────────────────
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate("hospital", "hospitalName address")
      .populate("inventory", "bloodGroup units")
      .sort({ donationDate: -1 });

    sendSuccess(res, 200, "Your donation history fetched.", donations);
  } catch (error) {
    next(error);
  }
};

module.exports = { createDonation, getHospitalDonations, getMyDonations };
