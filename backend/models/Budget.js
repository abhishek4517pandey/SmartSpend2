import mongoose from "mongoose";

const passiveIncomeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  source: String,
  amount: Number,
  addedDate: { type: Date, default: Date.now },
  description: { type: String, default: "" }
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
    passiveIncomes: [passiveIncomeSchema],
    savingGoals: [savingGoalSchema],
    alert50Sent: { type: Boolean, default: false },
    alert80Sent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;