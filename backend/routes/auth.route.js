// routes/auth.route.js
const express = require("express");
const router = express.Router();
const { registerDonor, registerHospital, login, getMe } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/register/donor", registerDonor);
router.post("/register/hospital", registerHospital);
router.post("/login", login);
router.get("/me", verifyToken, getMe);

module.exports = router;
