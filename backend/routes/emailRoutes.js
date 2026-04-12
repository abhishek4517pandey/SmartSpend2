import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { sendReportEmail, sendSplitNotificationEmail } from "../services/emailService.js";

const router = express.Router();

/**
 * GET /api/emails/test
 * Test email connectivity
 */
router.get("/test", authMiddleware, async (req, res) => {
  try {
    const result = await sendReportEmail(
      req.user.email,
      req.user.name,
      [
        {
          date: new Date().toISOString().split("T")[0],
          category: "Test",
          description: "Test expense",
          paymentMethod: "Test",
          amount: 100
        }
      ],
      "Test Report"
    );
    res.json({ success: true, message: "Test email sent successfully", result });
  } catch (error) {
    console.error("Test email error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: `Email test failed: ${error.message}`,
      error: error.code || error.response?.response || null
    });
  }
});

/**
 * POST /api/emails/send-report
 * Send current expense report to user's email
 */
router.post("/send-report", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { period = "Current", dateFrom, dateTo } = req.body;

    // Determine date range for report
    let query = { userId: req.user._id };
    let reportLabel = period;

    const now = new Date();
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.date.$lte = endDate;
      }
      reportLabel = `From ${dateFrom} to ${dateTo}`;
    } else {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      let startDate;

      switch (period) {
        case "today":
          startDate = today;
          reportLabel = "Today";
          break;
        case "last7":
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 6);
          reportLabel = "Last 7 Days";
          break;
        case "last30":
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 29);
          reportLabel = "Last 30 Days";
          break;
        case "month":
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          reportLabel = "This Month";
          break;
        default:
          startDate = null;
          reportLabel = period === "Current" ? "Current Expenses" : period;
      }

      if (startDate) {
        query.date = { $gte: startDate, $lte: now };
      }
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    if (expenses.length === 0) {
      return res.status(400).json({ message: "No expenses found for the specified period" });
    }

    // Send email
    await sendReportEmail(user.email, user.name, expenses, reportLabel);

    res.json({ success: true, message: `Report sent successfully to ${user.email}` });
  } catch (error) {
    console.error("Error sending report:", error.message, error);
    const errorMsg = error.message || "Error sending report email";
    res.status(500).json({ message: `Failed to send email: ${errorMsg}` });
  }
});

/**
 * GET /api/emails/preferences
 * Get user's notification preferences
 */
router.get("/preferences", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.notifications || {});
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Error fetching preferences" });
  }
});

/**
 * PUT /api/emails/preferences
 * Update user's notification preferences
 */
router.put("/preferences", authMiddleware, async (req, res) => {
  try {
    const { monthlyReport, budgetAlerts, budgetThreshold50, budgetThreshold80 } = req.body;

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        "notifications.monthlyReport": monthlyReport !== undefined ? monthlyReport : currentUser.notifications.monthlyReport,
        "notifications.budgetAlerts": budgetAlerts !== undefined ? budgetAlerts : currentUser.notifications.budgetAlerts,
        "notifications.budgetThreshold50": budgetThreshold50 !== undefined ? budgetThreshold50 : currentUser.notifications.budgetThreshold50,
        "notifications.budgetThreshold80": budgetThreshold80 !== undefined ? budgetThreshold80 : currentUser.notifications.budgetThreshold80
      },
      { new: true }
    );

    res.json({ success: true, preferences: user.notifications });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ message: "Error updating preferences" });
  }
});

/**
 * POST /api/emails/send-split-notification
 * Send split expense notification to participant
 */
router.post("/send-split-notification", async (req, res) => {
  try {
    const { email, personName, owedAmount, oweAmount, net, status } = req.body;

    if (!email || !personName) {
      return res.status(400).json({ message: "Email and person name are required" });
    }

    await sendSplitNotificationEmail(
      email,
      personName,
      owedAmount || 0,
      oweAmount || 0,
      net || 0,
      status || "settled"
    );

    res.json({ success: true, message: `Notification sent successfully to ${email}` });
  } catch (error) {
    console.error("Error sending split notification:", error.message);
    const errorMsg = error.message || "Error sending split notification";
    res.status(500).json({ message: `Failed to send notification: ${errorMsg}` });
  }
});

export default router;
