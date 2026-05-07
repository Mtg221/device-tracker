const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
    await createDefaultUsers();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const createDefaultUsers = async () => {
  const User = require("../models/users");
  
  // Create super admin
  const superAdminExists = await User.findOne({ email: "superadmin@driveelite.com" });
  if (!superAdminExists) {
    const hashed = await bcrypt.hash("superadmin123", 10);
    await User.create({
      name: "Super Admin",
      email: "superadmin@driveelite.com",
      password: hashed,
      role: "superadmin",
      fleetName: "All Fleets"
    });
    console.log("👑 Super admin created → superadmin@driveelite.com / superadmin123");
  }
  
  // Create default admin
  const adminExists = await User.findOne({ email: "admin@driveelite.com" });
  if (!adminExists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Fleet Admin",
      email: "admin@driveelite.com",
      password: hashed,
      role: "admin",
      fleetName: "Default Fleet",
      region: "dakar"
    });
    console.log("👤 Default admin created → admin@driveelite.com / admin123");
  }
};

module.exports = connectDB;
