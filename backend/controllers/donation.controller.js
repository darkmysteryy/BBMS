// controllers/donation.controller.js
// Records a blood donation and updates inventory + donor eligibility

const Donation = require("../models/Donation");
const DonorProfile = require("../models/DonorProfile");
const Inventory = require("../models/Inventory");
const { sendSuccess } = require("../utils/apiResponse");

const DONOR_ELIGIBILITY_DAYS = 56;
const INVENTORY_STATUS = {
  AVAILABLE: "available",
  EXPIRED: "expired",
  USED: "used",
};

// ─── Record a Donation (Admin) ─────────────────────────────────────────────────
const createDonation = async (req, res, next) => {
  try {
    const { donorUserId, bloodGroup, quantity, collectionDate, location } = req.body;

    if (!donorUserId || !bloodGroup || !quantity || !collectionDate) {
      const error = new Error("donorUserId, bloodGroup, quantity, and collectionDate are required.");
      error.statusCode = 400;
      throw error;
    }

    // Find donor profile
    const donorProfile = await DonorProfile.findOne({ userId: donorUserId });
    if (!donorProfile) {
      const error = new Error("Donor profile not found.");
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

    // Create or update inventory for this blood group
    // Calculate expiry: blood is typically valid for 42 days from collection
    const expiryDate = new Date(collectionDate);
    expiryDate.setDate(expiryDate.getDate() + 42);

    const inventoryItem = await Inventory.create({
      bloodGroup,
      units: quantity,
      collectionDate,
      expiryDate,
      donor: donorUserId,
      status: INVENTORY_STATUS.AVAILABLE,
    });

    // Record the donation
    const donation = await Donation.create({
      donor: donorUserId,
      inventory: inventoryItem._id,
      quantity,
      donationDate: collectionDate,
      location,
    });

    // Update donor profile: set last donation date and calculate next eligible date
    const eligibleAfter = new Date(collectionDate);
    eligibleAfter.setDate(eligibleAfter.getDate() + DONOR_ELIGIBILITY_DAYS);

    await DonorProfile.findOneAndUpdate(
      { userId: donorUserId },
      {
        lastDonationDate: collectionDate,
        eligibleAfter,
      }
    );

    sendSuccess(res, 201, "Donation recorded and inventory updated.", donation);
  } catch (error) {
    next(error);
  }
};

// ─── Get All Donations (Admin) ─────────────────────────────────────────────────
const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email")
      .populate("inventory", "bloodGroup units")
      .sort({ donationDate: -1 });

    sendSuccess(res, 200, "Donations fetched.", donations);
  } catch (error) {
    next(error);
  }
};

// ─── Get Donations for Logged-in Donor ────────────────────────────────────────
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate("inventory", "bloodGroup units")
      .sort({ donationDate: -1 });

    sendSuccess(res, 200, "Your donation history fetched.", donations);
  } catch (error) {
    next(error);
  }
};

module.exports = { createDonation, getAllDonations, getMyDonations };
