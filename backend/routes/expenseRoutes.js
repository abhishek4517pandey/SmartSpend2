import express from "express";
import Expense from "../models/Expense.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkBudgetAlerts, checkCategoryBudgetAlerts } from "../services/budgetAlertService.js";
import { updateDailyStreak } from "../services/streakService.js";

const router = express.Router();

// GET all expenses for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  console.log("GET /expenses: req.user.id =", req.user.id);
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    console.log("GET /expenses: Found", expenses.length, "expenses for user", req.user.id);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// POST create expense
router.post("/", authMiddleware, async (req, res) => {
  console.log("POST /expenses: req.user.id =", req.user.id);
  try {
    const { amount, category, date, paymentMethod, description, tags } = req.body;

    const expense = new Expense({
      amount,
      category,
      date,
      paymentMethod,
      description,
      tags,
      userId: req.user.id
    });

    const saved = await expense.save();
    console.log("POST /expenses: Created expense with id", saved._id, "for user", req.user.id);
    
    // Update daily streak
    const streakData = await updateDailyStreak(req.user.id);
    
    // Check budget alerts after adding expense
    const budgetCheckResult = await checkBudgetAlerts(req.user.id);
    const categoryCheckResult = await checkCategoryBudgetAlerts(req.user.id, category);
    
    res.status(201).json({ 
      expense: saved,
      streak: streakData,
      budgetCheck: budgetCheckResult,
      categoryCheck: categoryCheckResult
    });
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(400).json({ message: "Error creating expense" });
  }
});

// PUT update expense
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const { amount, category, date, paymentMethod, description, tags } = req.body;
    expense.amount = amount;
    expense.category = category;
    expense.date = date;
    expense.paymentMethod = paymentMethod;
    expense.description = description;
    expense.tags = tags;

    const updated = await expense.save();
    
    // Check budget alerts after updating expense
    const budgetCheckResult = await checkBudgetAlerts(req.user.id);
    const categoryCheckResult = await checkCategoryBudgetAlerts(req.user.id, category);
    
    res.json({ 
      expense: updated,
      budgetCheck: budgetCheckResult,
      categoryCheck: categoryCheckResult
    });
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(400).json({ message: "Error updating expense" });
  }
});

// DELETE expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(400).json({ message: "Error deleting expense" });
  }
});

// GET user's daily streak data
router.get("/streak/data", authMiddleware, async (req, res) => {
  try {
    const { getStreakData } = await import("../services/streakService.js");
    const streakData = await getStreakData(req.user.id);
    res.json(streakData);
  } catch (err) {
    console.error("Error fetching streak data:", err);
    res.status(400).json({ message: "Error fetching streak data" });
  }
});

export default router;