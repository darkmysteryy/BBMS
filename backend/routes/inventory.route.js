// routes/inventory.route.js
const express = require("express");
const router = express.Router();
const { getAllInventory, addInventory, updateInventory, deleteInventory } = require("../controllers/inventory.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

// Anyone logged in can view inventory
router.get("/", verifyToken, getAllInventory);

// Only admin can add, update, or delete inventory
router.post("/", verifyToken, authorizeRoles("admin"), addInventory);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateInventory);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteInventory);

module.exports = router;
