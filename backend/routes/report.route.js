// routes/report.route.js
const express = require("express");
const router = express.Router();
const {
  getMonthlyDonations,
  getBloodGroupDistribution,
  getHospitalRequestsSummary,
  getUrgencyDistribution,
  getInventoryStats,
} = require("../controllers/report.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// All report routes are admin only
router.use(verifyToken, authorizeRoles("admin"));

router.get("/monthly-donations", getMonthlyDonations);
router.get("/blood-groups", getBloodGroupDistribution);
router.get("/requests-summary", getHospitalRequestsSummary);
router.get("/urgency", getUrgencyDistribution);
router.get("/inventory-stats", getInventoryStats);

module.exports = router;
