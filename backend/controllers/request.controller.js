// controllers/request.controller.js
// Donor posts public blood requests. Hospitals accept them (first-come-first-served).
// Only ONE hospital can accept a request — atomic operation prevents race conditions.

const BloodRequest = require("../models/BloodRequest");
const Hospital = require("../models/Hospital");
const Inventory = require("../models/Inventory");
const { sendSuccess } = require("../utils/apiResponse");
const generateRequestId = require("../utils/generateRequestId");

const HOSPITAL_VERIFICATION_STATUS = { APPROVED: "approved" };

// ─── Create Blood Request (Donor) ──────────────────────────────────────────────
// Donor posts a public broadcast request — all approved hospitals can see and accept it
const createRequest = async (req, res, next) => {
  try {
    const { bloodGroup, quantity, urgency, requiredDate, patientName, location, notes } = req.body;

    if (!bloodGroup || !quantity || !requiredDate || !patientName || !location) {
      const error = new Error("bloodGroup, quantity, requiredDate, patientName, and location are required.");
      error.statusCode = 400;
      throw error;
    }

    const requestId = generateRequestId(bloodGroup);

    const request = await BloodRequest.create({
      requestId,
      donor: req.user._id,
      bloodGroup,
      quantity,
      urgency,
      requiredDate,
      patientName,
      location,
      notes,
      status: "Open",
    });

    sendSuccess(res, 201, "Blood request posted publicly. Nearby hospitals can now accept it.", request);
  } catch (error) {
    next(error);
  }
};

// ─── Get All Open Requests (Hospitals see this feed) ──────────────────────────
// Returns all Open requests any approved hospital can accept
// Sorted by urgency priority (Critical → Urgent → Normal), then oldest first
const URGENCY_PRIORITY = { Critical: 3, Urgent: 2, Normal: 1 };

const getOpenRequests = async (req, res, next) => {
  try {
    const { bloodGroup, urgency } = req.query;

    const filter = { status: "Open" };
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (urgency) filter.urgency = urgency;

    const requests = await BloodRequest.find(filter)
      .populate("donor", "name phone")
      .sort({ createdAt: 1 }); // fetch oldest first as base

    // Sort in JS by urgency priority (Critical first) then by createdAt
    requests.sort((a, b) => {
      const urgencyDiff =
        (URGENCY_PRIORITY[b.urgency] || 1) - (URGENCY_PRIORITY[a.urgency] || 1);
      if (urgencyDiff !== 0) return urgencyDiff;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    sendSuccess(res, 200, "Open blood requests fetched.", requests);
  } catch (error) {
    next(error);
  }
};

// ─── Get Donor's Own Requests ─────────────────────────────────────────────────
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ donor: req.user._id })
      .populate("acceptedBy", "hospitalName address contactPerson")
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, "Your blood requests fetched.", requests);
  } catch (error) {
    next(error);
  }
};

// ─── Get Hospital's Accepted Requests ─────────────────────────────────────────
// Returns requests this specific hospital has accepted
const getMyAcceptedRequests = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    const requests = await BloodRequest.find({ acceptedBy: hospital._id })
      .populate("donor", "name phone")
      .sort({ acceptedAt: -1 });

    sendSuccess(res, 200, "Accepted requests fetched.", requests);
  } catch (error) {
    next(error);
  }
};

// ─── Accept a Request (Hospital — Atomic, First-Come-First-Served) ─────────────
// Uses findOneAndUpdate with status: "Open" filter.
// If two hospitals try simultaneously, only ONE will succeed.
// The other gets null back and receives a 409 Conflict response.
const acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the hospital profile of the logged-in hospital user
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    if (hospital.verificationStatus !== HOSPITAL_VERIFICATION_STATUS.APPROVED) {
      const error = new Error("Your hospital is not approved by admin yet.");
      error.statusCode = 403;
      throw error;
    }

    // ATOMIC: only updates if status is still "Open" — prevents race conditions
    const request = await BloodRequest.findOneAndUpdate(
      { _id: id, status: "Open" },               // filter: must still be Open
      {
        status: "Accepted",
        acceptedBy: hospital._id,
        acceptedAt: new Date(),
      },
      { new: true }
    ).populate("donor", "name phone");

    if (!request) {
      // Either doesn't exist OR another hospital already accepted it
      const existing = await BloodRequest.findById(id);
      if (!existing) {
        const error = new Error("Blood request not found.");
        error.statusCode = 404;
        throw error;
      }
      // It exists but is no longer Open
      const error = new Error("This request has already been accepted by another hospital.");
      error.statusCode = 409;
      throw error;
    }

    sendSuccess(res, 200, "Request accepted successfully. Please fulfil it from your inventory.", request);
  } catch (error) {
    next(error);
  }
};

// ─── Fulfil a Request (Hospital) ───────────────────────────────────────────────
// The hospital that accepted marks it as Fulfilled — deducts from their inventory
const fulfilRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    const request = await BloodRequest.findById(id);
    if (!request) {
      const error = new Error("Blood request not found.");
      error.statusCode = 404;
      throw error;
    }

    // Only the hospital that accepted can fulfil it
    if (!request.acceptedBy || request.acceptedBy.toString() !== hospital._id.toString()) {
      const error = new Error("You can only fulfil requests that your hospital has accepted.");
      error.statusCode = 403;
      throw error;
    }

    if (request.status !== "Accepted") {
      const error = new Error(`Cannot fulfil a request with status: ${request.status}`);
      error.statusCode = 400;
      throw error;
    }

    // Find available inventory for this blood group at this hospital
    const inventoryItem = await Inventory.findOne({
      hospital: hospital._id,
      bloodGroup: request.bloodGroup,
      status: "available",
      units: { $gte: request.quantity },
    });

    if (!inventoryItem) {
      const error = new Error(
        `Not enough ${request.bloodGroup} blood units in your hospital's inventory.`
      );
      error.statusCode = 400;
      throw error;
    }

    // Deduct units from hospital inventory
    inventoryItem.units -= request.quantity;
    if (inventoryItem.units === 0) {
      inventoryItem.status = "used";
    }
    await inventoryItem.save();

    // Mark request as Fulfilled
    request.status = "Fulfilled";
    await request.save();

    sendSuccess(res, 200, "Request fulfilled successfully. Inventory updated.", request);
  } catch (error) {
    next(error);
  }
};

// ─── Cancel a Request (Donor) ──────────────────────────────────────────────────
// Donor can only cancel their own Open requests
const cancelRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findOne({ _id: id, donor: req.user._id });
    if (!request) {
      const error = new Error("Blood request not found or you don't have permission.");
      error.statusCode = 404;
      throw error;
    }

    if (request.status !== "Open") {
      const error = new Error(`Cannot cancel a request that is already ${request.status}.`);
      error.statusCode = 400;
      throw error;
    }

    request.status = "Cancelled";
    await request.save();

    sendSuccess(res, 200, "Blood request cancelled.", request);
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Request ────────────────────────────────────────────────────────
const getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate("donor", "name phone")
      .populate("acceptedBy", "hospitalName address contactPerson");

    if (!request) {
      const error = new Error("Blood request not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, "Request fetched.", request);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getOpenRequests,
  getMyRequests,
  getMyAcceptedRequests,
  acceptRequest,
  fulfilRequest,
  cancelRequest,
  getRequestById,
};
