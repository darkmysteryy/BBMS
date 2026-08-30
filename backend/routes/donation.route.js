// routes/donation.route.js
const express = require("express");
const router = express.Router();
const { createDonation, getHospitalDonations, getMyDonations } = require("../controllers/donation.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Hospital records a walk-in donor donation (adds to hospital's inventory)
router.post("/", verifyToken, authorizeRoles("hospital"), createDonation);

// Hospital sees all donations recorded at their facility
router.get("/hospital", verifyToken, authorizeRoles("hospital"), getHospitalDonations);

// Donor sees their own donation history
router.get("/my", verifyToken, authorizeRoles("donor"), getMyDonations);

module.exports = router;
