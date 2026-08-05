// controllers/auth.controller.js
// Handles registration, login, and getting logged-in user info

const bcrypt = require("bcrypt");
const User = require("../models/User");
const DonorProfile = require("../models/DonorProfile");
const Hospital = require("../models/Hospital");
const generateToken = require("../utils/generateToken");
const { sendSuccess } = require("../utils/apiResponse");

const ROLES = {
  ADMIN: "admin",
  DONOR: "donor",
  HOSPITAL: "hospital",
};

// ─── Register Donor ────────────────────────────────────────────────────────────
const registerDonor = async (req, res, next) => {
  try {
    const { name, email, password, phone, bloodGroup, dob, gender, address } = req.body;

    // Check if required fields are present
    if (!name || !email || !password || !phone || !bloodGroup || !dob || !gender || !address) {
      const error = new Error("All fields are required.");
      error.statusCode = 400;
      throw error;
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email is already registered.");
      error.statusCode = 400;
      throw error;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User account
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: ROLES.DONOR,
    });

    // Create the Donor Profile with extra donor details
    await DonorProfile.create({
      userId: user._id,
      bloodGroup,
      dob,
      gender,
      address,
    });

    const token = generateToken(user);

    sendSuccess(res, 201, "Donor registered successfully.", { token, role: user.role, name: user.name });
  } catch (error) {
    next(error);
  }
};

// ─── Register Hospital ─────────────────────────────────────────────────────────
const registerHospital = async (req, res, next) => {
  try {
    const { hospitalName, registrationNumber, email, password, phone, address, contactPerson } = req.body;

    if (!hospitalName || !registrationNumber || !email || !password || !phone || !address || !contactPerson) {
      const error = new Error("All fields are required.");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email is already registered.");
      error.statusCode = 400;
      throw error;
    }

    const existingHospital = await Hospital.findOne({ registrationNumber });
    if (existingHospital) {
      const error = new Error("This registration number is already used.");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: hospitalName,
      email,
      password: hashedPassword,
      phone,
      role: ROLES.HOSPITAL,
    });

    await Hospital.create({
      userId: user._id,
      registrationNumber,
      hospitalName,
      address,
      contactPerson,
    });

    const token = generateToken(user);

    sendSuccess(res, 201, "Hospital registered successfully. Please wait for admin approval.", {
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("No account found with this email.");
      error.statusCode = 404;
      throw error;
    }

    // Check if account is active
    if (!user.isActive) {
      const error = new Error("Your account has been deactivated. Contact admin.");
      error.statusCode = 403;
      throw error;
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Incorrect password.");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);

    sendSuccess(res, 200, "Login successful.", {
      token,
      role: user.role,
      name: user.name,
      id: user._id,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Logged-in User ────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the verifyToken middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    sendSuccess(res, 200, "User fetched successfully.", user);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerDonor, registerHospital, login, getMe };
