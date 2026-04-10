import express from "express";
import Budget from "../models/Budget.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET latest budget for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(budget);
  } catch (err) {
    console.error("Error fetching budget:", err);
    res.status(500).json({ message: "Error fetching budget" });
  }
});

// POST create new budget for authenticated user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { month, year, totalBudget, categoryBudgets } = req.body;

    const budget = new Budget({
      userId: req.user._id,
      month,
      year,
      totalBudget,
      categoryBudgets
    });

    const saved = await budget.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving budget:", err);
    res.status(400).json({ message: "Error saving budget" });
  }
});

export default router;