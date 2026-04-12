import express from "express";
import Budget from "../models/Budget.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

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
    const { month, year, totalBudget } = req.body;

    const budget = new Budget({
      userId: req.user._id,
      month,
      year,
      totalBudget,
      passiveIncomes: [],
      savingGoals: []
    });

    const saved = await budget.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving budget:", err);
    res.status(400).json({ message: "Error saving budget" });
  }
});

// POST add passive income
router.post("/passive-income", authMiddleware, async (req, res) => {
  try {
    const { source, amount, description } = req.body;

    let budget = await Budget.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found. Create a budget first." });
    }

    const newIncome = {
      _id: new mongoose.Types.ObjectId(),
      source,
      amount: Number(amount),
      description: description || "",
      addedDate: new Date()
    };

    budget.passiveIncomes.push(newIncome);
    const updated = await budget.save();

    res.status(201).json(updated);
  } catch (err) {
    console.error("Error adding passive income:", err);
    res.status(400).json({ message: "Error adding passive income" });
  }
});

// DELETE passive income
router.delete("/passive-income/:incomeId", authMiddleware, async (req, res) => {
  try {
    const { incomeId } = req.params;

    const budget = await Budget.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.passiveIncomes = budget.passiveIncomes.filter(
      inc => inc._id.toString() !== incomeId
    );

    const updated = await budget.save();
    res.json(updated);
  } catch (err) {
    console.error("Error deleting passive income:", err);
    res.status(400).json({ message: "Error deleting passive income" });
  }
});

// POST add a new saving goal
router.post("/saving-goal", authMiddleware, async (req, res) => {
  try {
    const { goalName, targetAmount, icon, category, priority } = req.body;

    let budget = await Budget.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found. Create a budget first." });
    }

    const newGoal = {
      _id: new mongoose.Types.ObjectId(),
      goalName,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      icon: icon || "🎯",
      category: category || "Other",
      priority: priority || "Medium",
      createdAt: new Date()
    };

    budget.savingGoals.push(newGoal);
    const updated = await budget.save();

    res.status(201).json(updated);
  } catch (err) {
    console.error("Error adding saving goal:", err);
    res.status(400).json({ message: "Error adding saving goal" });
  }
});

// PUT update saving goal progress
router.put("/saving-goal/:goalId/add-amount", authMiddleware, async (req, res) => {
  try {
    const { goalId } = req.params;
    const { amount } = req.body;

    const budget = await Budget.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const goal = budget.savingGoals.find(g => g._id.toString() === goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.currentAmount += Number(amount);
    const updated = await budget.save();

    res.json(updated);
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(400).json({ message: "Error updating goal" });
  }
});

// PUT update saving goal details
router.put("/saving-goal/:goalId", authMiddleware, async (req, res) => {
  try {
    const { goalId } = req.params;
    const { goalName, targetAmount, icon, category, priority } = req.body;

    const budget = await Budget.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const goal = budget.savingGoals.find(g => g._id.toString() === goalId);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.goalName = goalName || goal.goalName;
    goal.targetAmount = targetAmount ? Number(targetAmount) : goal.targetAmount;
    goal.icon = icon || goal.icon;
    goal.category = category || goal.category;
    goal.priority = priority || goal.priority;

    const updated = await budget.save();
    res.json(updated);
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(400).json({ message: "Error updating goal" });
  }
});

// DELETE saving goal
router.delete("/saving-goal/:goalId", authMiddleware, async (req, res) => {
  try {
    const { goalId } = req.params;

    const budget = await Budget.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.savingGoals = budget.savingGoals.filter(g => g._id.toString() !== goalId);

    const updated = await budget.save();
    res.json(updated);
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(400).json({ message: "Error deleting goal" });
  }
});

export default router;