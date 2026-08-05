// routes/donor.route.js
const express = require("express");
const router = express.Router();
const { getDonorProfile, updateDonorProfile } = require("../controllers/donor.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// All donor routes require login and donor role
router.use(verifyToken, authorizeRoles("donor"));

router.get("/profile", getDonorProfile);
router.put("/profile", updateDonorProfile);

module.exports = router;
