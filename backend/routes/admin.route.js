// routes/admin.route.js
const express = require("express");
const router = express.Router();
const {
  seedAdmin,
  getDashboardStats,
  getAllDonors,
  getAllHospitals,
  updateHospitalVerification,
  toggleUserActive,
  getApprovedHospitals,
} = require("../controllers/admin.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Seed route — public, protected only by seed key
router.post("/seed", seedAdmin);

// Public — donors use this to see which hospitals are available
router.get("/hospitals/approved", getApprovedHospitals);

// All other admin routes require login and admin role
router.use(verifyToken, authorizeRoles("admin"));

router.get("/stats", getDashboardStats);
router.get("/donors", getAllDonors);
router.get("/hospitals", getAllHospitals);
router.put("/hospitals/:id/verify", updateHospitalVerification);
router.put("/users/:id/toggle", toggleUserActive);

module.exports = router;
