// routes/request.route.js
const express = require("express");
const router = express.Router();
const { createRequest, getAllRequests, getRequestById, updateRequestStatus } = require("../controllers/request.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Hospital creates a request; Admin and Hospital can view
router.post("/", verifyToken, authorizeRoles("hospital"), createRequest);
router.get("/", verifyToken, authorizeRoles("admin", "hospital"), getAllRequests);
router.get("/:id", verifyToken, authorizeRoles("admin", "hospital"), getRequestById);

// Only admin can update request status (approve/reject/dispatch)
router.put("/:id/status", verifyToken, authorizeRoles("admin"), updateRequestStatus);

module.exports = router;
