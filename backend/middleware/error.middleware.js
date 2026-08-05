// middleware/error.middleware.js
// This is the global error handler — catches all errors thrown in controllers

/**
 * errorHandler — Express error handling middleware
 * Must have 4 parameters (err, req, res, next) for Express to treat it as error handler
 * Add this LAST in server.js after all routes
 */
const errorHandler = (err, req, res, next) => {
  // Use the statusCode set on the error, or default to 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
