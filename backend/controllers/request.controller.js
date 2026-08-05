// controllers/request.controller.js
// Hospital submits blood requests, Admin manages their lifecycle

const BloodRequest = require("../models/BloodRequest");
const Hospital = require("../models/Hospital");
const Inventory = require("../models/Inventory");
const { sendSuccess } = require("../utils/apiResponse");
const generateRequestId = require("../utils/generateRequestId");

const HOSPITAL_VERIFICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const BLOOD_REQUEST_STATUS = {
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DISPATCHED: "Dispatched",
};

const INVENTORY_STATUS = {
  AVAILABLE: "available",
  EXPIRED: "expired",
  USED: "used",
};


// ─── Create Blood Request (Hospital) ──────────────────────────────────────────
const createRequest = async (req, res, next) => {
  try {
    const { bloodGroup, quantity, urgency, requiredDate, notes } = req.body;

    if (!bloodGroup || !quantity || !requiredDate) {
      const error = new Error("bloodGroup, quantity, and requiredDate are required.");
      error.statusCode = 400;
      throw error;
    }

    // Check if hospital is approved by admin
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      const error = new Error("Hospital profile not found.");
      error.statusCode = 404;
      throw error;
    }

    if (hospital.verificationStatus !== HOSPITAL_VERIFICATION_STATUS.APPROVED) {
      const error = new Error("Your hospital is not approved yet. Please wait for admin approval.");
      error.statusCode = 403;
      throw error;
    }

    // Generate a unique request ID
    const requestId = generateRequestId(bloodGroup);

    const request = await BloodRequest.create({
      requestId,
      hospital: hospital._id,
      bloodGroup,
      quantity,
      urgency,
      requiredDate,
      notes,
    });

    sendSuccess(res, 201, "Blood request submitted successfully.", request);
  } catch (error) {
    next(error);
  }
};

// ─── Get All Requests (Admin sees all, Hospital sees own) ──────────────────────
const getAllRequests = async (req, res, next) => {
  try {
    const { status, bloodGroup } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (bloodGroup) filter.bloodGroup = bloodGroup;

    // If the logged-in user is a hospital, only show their requests
    if (req.user.role === "hospital") {
      const hospital = await Hospital.findOne({ userId: req.user._id });
      if (!hospital) {
        const error = new Error("Hospital not found.");
        error.statusCode = 404;
        throw error;
      }
      filter.hospital = hospital._id;
    }

    const requests = await BloodRequest.find(filter)
      .populate("hospital", "hospitalName address")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, "Requests fetched.", requests);
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Request ────────────────────────────────────────────────────────
const getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate("hospital", "hospitalName address contactPerson")
      .populate("approvedBy", "name");

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

// ─── Update Request Status (Admin Only) ───────────────────────────────────────
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      const error = new Error("Status is required.");
      error.statusCode = 400;
      throw error;
    }

    const request = await BloodRequest.findById(id).populate("hospital");
    if (!request) {
      const error = new Error("Blood request not found.");
      error.statusCode = 404;
      throw error;
    }

    const hospital = request.hospital;

    // When dispatching, deduct units from inventory
    if (status === BLOOD_REQUEST_STATUS.DISPATCHED) {
      // Find available inventory for this blood group
      const inventoryItem = await Inventory.findOne({
        bloodGroup: request.bloodGroup,
        status: INVENTORY_STATUS.AVAILABLE,
        units: { $gte: request.quantity },
      });

      if (!inventoryItem) {
        const error = new Error(
          `Not enough ${request.bloodGroup} blood units in inventory to dispatch.`
        );
        error.statusCode = 400;
        throw error;
      }

      // Deduct the units
      inventoryItem.units -= request.quantity;
      if (inventoryItem.units === 0) {
        inventoryItem.status = INVENTORY_STATUS.USED;
      }
      await inventoryItem.save();

      request.dispatchDate = new Date();
    }

    request.status = status;
    request.approvedBy = req.user._id;
    await request.save();

    sendSuccess(res, 200, `Request status updated to ${status}.`, request);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRequest, getAllRequests, getRequestById, updateRequestStatus };
