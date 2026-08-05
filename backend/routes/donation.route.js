// routes/donation.route.js
const express = require("express");
const router = express.Router();
const { createDonation, getAllDonations, getMyDonations } = require("../controllers/donation.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Admin records donations and sees all
router.post("/", verifyToken, authorizeRoles("admin"), createDonation);
router.get("/", verifyToken, authorizeRoles("admin"), getAllDonations);

// Donor sees their own donation history
router.get("/my", verifyToken, authorizeRoles("donor"), getMyDonations);

module.exports = router;
