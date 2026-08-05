// utils/generateRequestId.js
// Creates a unique readable ID for every blood request

/**
 * Generate a unique blood request ID
 * Format: REQ-A+-1700000000000
 * @param {string} bloodGroup - The requested blood group (e.g. "A+")
 * @returns {string} - Unique request ID
 */
const generateRequestId = (bloodGroup) => {
  // Remove special characters from blood group for the ID
  const cleanBloodGroup = bloodGroup.replace("+", "P").replace("-", "N");
  const timestamp = Date.now();
  return `REQ-${cleanBloodGroup}-${timestamp}`;
};

module.exports = generateRequestId;
