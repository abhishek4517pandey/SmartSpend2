import mongoose from "mongoose";

const categoryBudgetSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  alertSent50: { type: Boolean, default: false },
  alertSent80: { type: Boolean, default: false }
});

const savingGoalSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  goalName: String,
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  icon: { type: String, default: "🎯" },
  category: { type: String, default: "Other" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  createdAt: { type: Date, default: Date.now }
});

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    month: Number, // 1-12
    year: Number,
    totalBudget: Number,
    categoryBudgets: [categoryBudgetSchema],
    savingGoals: [savingGoalSchema],
    alert50Sent: { type: Boolean, default: false },
    alert80Sent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Simplest approach: one active budget (latest)
const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;