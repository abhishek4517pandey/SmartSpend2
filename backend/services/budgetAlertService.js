import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { sendBudgetAlertEmail } from "./emailService.js";

/**
 * Check budget usage and send alerts if thresholds are crossed
 * @param {string} userId - User ID
 * @returns {Promise<object>} Result of alert checking
 */
export const checkBudgetAlerts = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // Fetch budget for current month
    const budget = await Budget.findOne({
      userId: userId,
      month: currentMonth,
      year: currentYear
    });

    if (!budget) {
      return { success: false, message: "No budget set for this month" };
    }

    // Calculate total spent this month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const expenses = await Expense.find({
      userId: userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetLimit = budget.totalBudget;
    const percentageUsed = (totalSpent / budgetLimit) * 100;

    const alerts = [];

    // Check if user wants budget alerts
    if (!user.notifications.budgetAlerts) {
      return { success: true, message: "Budget alerts disabled by user" };
    }

    // 50% threshold alert
    if (percentageUsed >= 50 && percentageUsed < 80 && !budget.alert50Sent && user.notifications.budgetThreshold50) {
      try {
        await sendBudgetAlertEmail(user.email, user.name, 50, totalSpent, budgetLimit);
        budget.alert50Sent = true;
        alerts.push("50% threshold alert sent");
      } catch (error) {
        console.error("Error sending 50% alert:", error);
      }
    }

    // 80% threshold alert
    if (percentageUsed >= 80 && !budget.alert80Sent && user.notifications.budgetThreshold80) {
      try {
        await sendBudgetAlertEmail(user.email, user.name, Math.min(percentageUsed, 100), totalSpent, budgetLimit);
        budget.alert80Sent = true;
        alerts.push("80% threshold alert sent");
      } catch (error) {
        console.error("Error sending 80% alert:", error);
      }
    }

    // Save budget with updated alert flags
    if (alerts.length > 0) {
      await budget.save();
    }

    return {
      success: true,
      totalSpent,
      budgetLimit,
      percentageUsed: parseFloat(percentageUsed.toFixed(2)),
      alerts
    };
  } catch (error) {
    console.error("Error checking budget alerts:", error);
    return { success: false, message: "Error checking budget alerts", error: error.message };
  }
};

/**
 * Check category budget alerts
 * @param {string} userId - User ID
 * @param {string} category - Expense category
 * @returns {Promise<object>} Result of category alert checking
 */
export const checkCategoryBudgetAlerts = async (userId, category) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budget = await Budget.findOne({
      userId: userId,
      month: currentMonth,
      year: currentYear
    });

    if (!budget) {
      return { success: false, message: "No budget set for this month" };
    }

    const categoryBudget = budget.categoryBudgets.find(cb => cb.category === category);
    if (!categoryBudget) {
      return { success: false, message: "No budget set for this category" };
    }

    // Calculate total spent in this category this month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const expenses = await Expense.find({
      userId: userId,
      category: category,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const percentageUsed = (totalSpent / categoryBudget.amount) * 100;

    const alerts = [];

    // Check if user wants budgetThreshold alerts
    if (!user.notifications.budgetAlerts) {
      return { success: true, message: "Budget alerts disabled by user" };
    }

    // 50% threshold for category
    if (percentageUsed >= 50 && percentageUsed < 80 && !categoryBudget.alertSent50 && user.notifications.budgetThreshold50) {
      try {
        await sendBudgetAlertEmail(user.email, user.name, 50, totalSpent, categoryBudget.amount, category);
        categoryBudget.alertSent50 = true;
        alerts.push("50% threshold alert sent for category");
      } catch (error) {
        console.error("Error sending category 50% alert:", error);
      }
    }

    // 80% threshold for category
    if (percentageUsed >= 80 && !categoryBudget.alertSent80 && user.notifications.budgetThreshold80) {
      try {
        await sendBudgetAlertEmail(user.email, user.name, Math.min(percentageUsed, 100), totalSpent, categoryBudget.amount, category);
        categoryBudget.alertSent80 = true;
        alerts.push("80% threshold alert sent for category");
      } catch (error) {
        console.error("Error sending category 80% alert:", error);
      }
    }

    if (alerts.length > 0) {
      await budget.save();
    }

    return {
      success: true,
      totalSpent,
      budgetLimit: categoryBudget.amount,
      percentageUsed: parseFloat(percentageUsed.toFixed(2)),
      alerts
    };
  } catch (error) {
    console.error("Error checking category budget alerts:", error);
    return { success: false, message: "Error checking category budget alerts", error: error.message };
  }
};

export default { checkBudgetAlerts, checkCategoryBudgetAlerts };
