import mongoose from "mongoose";

const categoryBudgetSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  alertSent50: { type: Boolean, default: false },
  alertSent80: { type: Boolean, default: false }
});

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    month: Number, // 1-12
    year: Number,
    totalBudget: Number,
    categoryBudgets: [categoryBudgetSchema],
    alert50Sent: { type: Boolean, default: false },
    alert80Sent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Simplest approach: one active budget (latest)
const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;