import mongoose from "mongoose";

const splitExpenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paidBy: { type: String, required: true }, // Name of the person who paid
    participants: [{ type: String, required: true }], // Array of participant names
    sharePerPerson: { type: Number, required: true }, // totalAmount / participants.length
    // Keep backward compatibility
    paidByOld: { type: String, enum: ["A", "B"] }, // For migration
    sharePerStudent: { type: Number } // For migration
  },
  { timestamps: true }
);

const SplitExpense = mongoose.model("SplitExpense", splitExpenseSchema);

export default SplitExpense;