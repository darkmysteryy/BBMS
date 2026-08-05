// routes/hospital.route.js
const express = require("express");
const router = express.Router();
const { getHospitalProfile, updateHospitalProfile } = require("../controllers/hospital.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

router.use(verifyToken, authorizeRoles("hospital"));

router.get("/profile", getHospitalProfile);
router.put("/profile", updateHospitalProfile);

module.exports = router;
