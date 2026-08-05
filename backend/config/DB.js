const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    if (retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error("💀 Could not connect to MongoDB. Please check:");
      console.error("   1. Your internet connection");
      console.error("   2. MongoDB Atlas IP Whitelist (Add your IP at cloud.mongodb.com)");
      console.error("   3. Your MONGO_URI in .env file");
      process.exit(1);
    }
  }
};

module.exports = connectDB;
