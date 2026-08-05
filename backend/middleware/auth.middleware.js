// middleware/auth.middleware.js
// Protects routes — checks JWT token and user role

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * verifyToken — checks if the request has a valid JWT token
 * Attaches the user info to req.user so controllers can use it
 */
const verifyToken = async (req, res, next) => {
  try {
    // Get token from the Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("No token provided. Please login.");
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      const error = new Error("User not found. Token is invalid.");
      error.statusCode = 401;
      return next(error);
    }

    if (!user.isActive) {
      const error = new Error("Your account has been deactivated.");
      error.statusCode = 403;
      return next(error);
    }

    // Attach user to request so controllers can use it
    req.user = user;
    next();
  } catch (error) {
    // jwt.verify throws an error if the token is expired or invalid
    error.statusCode = 401;
    error.message = "Invalid or expired token. Please login again.";
    next(error);
  }
};

/**
 * authorizeRoles — checks if the logged-in user has the right role
 * Usage: authorizeRoles("admin") or authorizeRoles("admin", "donor")
 * @param {...string} roles - Allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(
        `Access denied. Only ${roles.join(", ")} can access this.`
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
