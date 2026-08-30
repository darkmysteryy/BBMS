// routes/request.route.js
const express = require("express");
const router = express.Router();
const {
  createRequest,
  getOpenRequests,
  getMyRequests,
  getMyAcceptedRequests,
  acceptRequest,
  fulfilRequest,
  cancelRequest,
  getRequestById,
} = require("../controllers/request.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// ── Donor Routes ───────────────────────────────────────────────────────────────
// Donor posts a public blood request
router.post("/", verifyToken, authorizeRoles("donor"), createRequest);

// Donor sees their own requests
router.get("/my", verifyToken, authorizeRoles("donor"), getMyRequests);

// Donor cancels their own Open request
router.put("/:id/cancel", verifyToken, authorizeRoles("donor"), cancelRequest);

// ── Hospital Routes ────────────────────────────────────────────────────────────
// Hospital sees all Open public requests (the broadcast feed)
router.get("/open", verifyToken, authorizeRoles("hospital"), getOpenRequests);

// Hospital sees requests it has accepted
router.get("/accepted", verifyToken, authorizeRoles("hospital"), getMyAcceptedRequests);

// Hospital accepts an Open request (atomic — only first hospital wins)
router.put("/:id/accept", verifyToken, authorizeRoles("hospital"), acceptRequest);

// Hospital fulfils an accepted request (deducts from inventory)
router.put("/:id/fulfil", verifyToken, authorizeRoles("hospital"), fulfilRequest);

// ── Shared ─────────────────────────────────────────────────────────────────────
// Any logged-in user can get a single request by ID
router.get("/:id", verifyToken, getRequestById);

module.exports = router;
