require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGO_URL;

(async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(uri, {serverSelectionTimeoutMS: 10000});
    console.log("✅ Successfully connected to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
})();
