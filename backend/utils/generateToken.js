// utils/generateToken.js
// Helper to create a JWT token for a user

const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token
 * @param {object} user - The user object from MongoDB
 * @returns {string} - Signed JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token expires in 7 days
  );
};

module.exports = generateToken;
