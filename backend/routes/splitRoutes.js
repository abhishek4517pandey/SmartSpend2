import express from "express";
import SplitExpense from "../models/SplitExpense.js";

const router = express.Router();

// GET all split expenses
router.get("/", async (req, res) => {
  try {
    const splits = await SplitExpense.find().sort({ date: -1 });
    res.json(splits);
  } catch (err) {
    console.error("Error fetching split expenses:", err);
    res.status(500).json({ message: "Error fetching split expenses" });
  }
});

// POST create split expense
router.post("/", async (req, res) => {
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

    const split = new SplitExpense({
      description,
      totalAmount,
      date,
      paidBy,
      participants,
      sharePerPerson,
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

export default router;