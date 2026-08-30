const mongoose = require("mongoose");
const User = require("../models/User");
const generateRegId = require("../utils/generateRegId");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bbms";

const migrate = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const users = await User.find({ registrationId: { $exists: false } });
    console.log(`Found ${users.length} users without registrationId.`);

    for (const user of users) {
      let uniqueIdFound = false;
      let newId;

      while (!uniqueIdFound) {
        newId = generateRegId();
        const existing = await User.findOne({ registrationId: newId });
        if (!existing) uniqueIdFound = true;
      }

      await User.collection.updateOne({ _id: user._id }, { $set: { registrationId: newId } });
      console.log(`Updated user ${user.email || user._id} with ID ${newId}`);
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrate();
