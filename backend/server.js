// server.js
// Main entry point — sets up Express, connects to MongoDB, registers all routes

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/DB");
const errorHandler = require("./middleware/error.middleware");

// ─── Import All Routes ─────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth.route");
const donorRoutes = require("./routes/donor.route");
const hospitalRoutes = require("./routes/hospital.route");
const inventoryRoutes = require("./routes/inventory.route");
const requestRoutes = require("./routes/request.route");
const donationRoutes = require("./routes/donation.route");
const reportRoutes = require("./routes/report.route");
const adminRoutes = require("./routes/admin.route");

const app = express();

// ─── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json()); // parse incoming JSON requests
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // allow frontend to call this API

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "BBMS API is running 🩸" });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
// Must be LAST — handles all errors thrown in controllers
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
