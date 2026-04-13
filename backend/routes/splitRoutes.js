import express from "express";
import SplitExpense from "../models/SplitExpense.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all split expenses for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const splits = await SplitExpense.find().sort({ date: -1 });
    res.json(splits);
  } catch (err) {
    console.error("Error fetching split expenses:", err);
    res.status(500).json({ message: "Error fetching split expenses" });
  }
});

// POST create split expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Split expense request body:", req.body);

    const description = String(req.body.description || "").trim();
    const paidBy = String(req.body.paidBy || "").trim();
    const participants = Array.isArray(req.body.participants)
      ? req.body.participants.map((p) => String(p || "").trim()).filter(Boolean)
      : [];
    const totalAmount = Number(req.body.totalAmount);
    const date = req.body.date ? new Date(req.body.date) : new Date();

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: "Total amount must be a number greater than zero" });
    }

    if (!paidBy) {
      return res.status(400).json({ message: "PaidBy is required" });
    }

    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: "At least 2 participants required" });
    }

    if (!participants.includes(paidBy)) {
      return res.status(400).json({ message: "The person who paid must be a participant" });
    }

    const sharePerPerson = totalAmount / participants.length;

    const participantsData = Array.isArray(req.body.participantsData)
      ? req.body.participantsData.filter(p => p?.name?.trim() && p?.email?.trim())
      : [];

    const split = new SplitExpense({
      description,
      totalAmount,
      date,
      paidBy,
      participants,
      participantsData,
      sharePerPerson,
      userId: req.user.id,
      // Backward compatibility
      paidByOld: paidBy === "Student A" ? "A" : paidBy === "Student B" ? "B" : null,
      sharePerStudent: participants.length === 2 ? sharePerPerson : null,
    });

    const saved = await split.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating split expense:", err);
    res.status(500).json({ message: "Error creating split expense" });
  }
});

// DELETE delete split expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SplitExpense.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!deleted) {
      return res.status(404).json({ message: "Split expense not found" });
    }

    res.json({ message: "Split expense deleted successfully", deleted });
  } catch (err) {
    console.error("Error deleting split expense:", err);
    res.status(500).json({ message: "Error deleting split expense" });
  }
});

// POST record payment for split
router.post("/:id/payment", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, amount } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ message: "from, to, and amount are required" });
    }

    const paidAmount = Number(amount);
    if (isNaN(paidAmount) || paidAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a valid number greater than zero" });
    }

    const split = await SplitExpense.findOne({ _id: id, userId: req.user.id });
    if (!split) {
      return res.status(404).json({ message: "Split expense not found" });
    }

    // Add payment record
    if (!Array.isArray(split.payments)) {
      split.payments = [];
    }

    split.payments.push({
      from: String(from).trim(),
      to: String(to).trim(),
      amount: paidAmount,
      date: new Date()
    });

    const updated = await split.save();
    res.json({ success: true, message: "Payment recorded successfully", split: updated });
  } catch (err) {
    console.error("Error recording payment:", err);
    res.status(500).json({ message: "Error recording payment" });
  }
});

export default router;