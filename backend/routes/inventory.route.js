// routes/inventory.route.js
const express = require("express");
const router = express.Router();
const { getInventory, getPublicInventorySummary, addInventoryItem, updateInventoryItem, deleteInventoryItem } = require("../controllers/inventory.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Public — anyone (including unauthenticated) can see overall blood availability
router.get("/public", getPublicInventorySummary);

// Hospital or admin sees inventory
router.get("/", verifyToken, authorizeRoles("hospital", "admin"), getInventory);

// Admin manual inventory actions
router.post("/", verifyToken, authorizeRoles("admin"), addInventoryItem);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateInventoryItem);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteInventoryItem);

module.exports = router;
