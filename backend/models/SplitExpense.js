import mongoose from "mongoose";

const splitExpenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paidBy: { type: String, required: true }, // Name of the person who paid
    participants: [{ type: String, required: true }], // Array of participant names
    sharePerPerson: { type: Number, required: true }, // totalAmount / participants.length
    participantsData: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true }
      }
    ], // Array of participant details with emails
    payments: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now }
      }
    ], // Track payments made towards settling the split
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Keep backward compatibility
    paidByOld: { type: String, enum: ["A", "B"] }, // For migration
    sharePerStudent: { type: Number } // For migration
  },
  { timestamps: true }
);

const SplitExpense = mongoose.model("SplitExpense", splitExpenseSchema);

export default SplitExpense;