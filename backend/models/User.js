import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, default: null },
    googleId: { type: String, default: null },
    profilePicture: { type: String, default: null },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    notifications: {
      monthlyReport: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
      budgetThreshold50: { type: Boolean, default: true },
      budgetThreshold80: { type: Boolean, default: true }
    },
    lastMonthlyReportSent: { type: Date, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
