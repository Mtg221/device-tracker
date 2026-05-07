const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  fleetName: { type: String },
  region: { type: String },
  },
  {
  timestamps: true,
  toJSON: { virtuals: true, transform: (_, ret) => { ret.id = ret._id; delete ret.__v; return ret; } },
  }
);

module.exports = mongoose.model("User", userSchema);