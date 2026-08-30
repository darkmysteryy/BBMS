// routes/inventory.route.js
const express = require("express");
const router = express.Router();
const { getHospitalInventory, getPublicInventorySummary } = require("../controllers/inventory.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Public — anyone (including unauthenticated) can see overall blood availability
router.get("/public", getPublicInventorySummary);

// Hospital sees and manages its own inventory
router.get("/", verifyToken, authorizeRoles("hospital"), getHospitalInventory);

module.exports = router;
