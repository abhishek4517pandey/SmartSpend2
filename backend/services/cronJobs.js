import cron from "node-cron";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import { sendMonthlyReportEmail } from "./emailService.js";

/**
 * Initialize cron jobs for automated tasks
 */
export const initializeCronJobs = () => {
  // Run at 00:01 on the 1st day of every month
  // Cron format: minute hour day month dayOfWeek
  const monthlyReportJob = cron.schedule("1 0 1 * *", async () => {
    console.log("🕐 Running monthly report job at", new Date().toLocaleString());
    await sendMonthlyReports();
  });

  // Reset budget alerts at 00:00 on the 1st day of every month
  const resetBudgetAlertsJob = cron.schedule("0 0 1 * *", async () => {
    console.log("🕐 Running reset budget alerts job at", new Date().toLocaleString());
    await resetBudgetAlerts();
  });

  console.log("✅ Cron jobs initialized");
  return { monthlyReportJob, resetBudgetAlertsJob };
};

/**
 * Send monthly reports to all users
 */
const sendMonthlyReports = async () => {
  try {
    const users = await User.find({ "notifications.monthlyReport": true });
    console.log(`📧 Found ${users.length} users with monthly reports enabled`);

    // Get previous month data
    const now = new Date();
    const previousMonth = now.getMonth(); // 0-11, so current month - 1
    const previousMonthNumber = previousMonth === 0 ? 12 : previousMonth; // 1-12
    const year = previousMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();

    // Get start and end dates of previous month
    const startOfMonth = new Date(year, previousMonth, 1);
    const endOfMonth = new Date(year, previousMonth + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    for (const user of users) {
      try {
        // Fetch expenses for previous month
        const expenses = await Expense.find({
          userId: user._id,
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        });

        if (expenses.length > 0) {
          // Send email
          await sendMonthlyReportEmail(
            user.email,
            user.name,
            expenses,
            previousMonthNumber,
            year
          );

          // Update lastMonthlyReportSent
          user.lastMonthlyReportSent = new Date();
          await user.save();

          console.log(`✅ Monthly report sent to ${user.email}`);
        } else {
          console.log(`⏭️  No expenses found for ${user.email} in previous month`);
        }
      } catch (error) {
        console.error(`❌ Error sending report to ${user.email}:`, error);
      }
    }

    console.log("✅ Monthly report job completed");
  } catch (error) {
    console.error("❌ Error in sendMonthlyReports:", error);
  }
};

/**
 * Reset budget alert flags for new month
 */
const resetBudgetAlerts = async () => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Find all budgets for current month
    const budgets = await Budget.updateMany(
      {
        month: currentMonth,
        year: currentYear
      },
      {
        $set: {
          alert50Sent: false,
          alert80Sent: false,
          "categoryBudgets.$[].alertSent50": false,
          "categoryBudgets.$[].alertSent80": false
        }
      }
    );

    console.log(`✅ Reset alert flags for ${budgets.modifiedCount} budgets`);
  } catch (error) {
    console.error("❌ Error in resetBudgetAlerts:", error);
  }
};

/**
 * Manually trigger monthly reports (for testing)
 */
export const manuallyTriggerMonthlyReports = async () => {
  console.log("🚀 Manually triggering monthly reports...");
  await sendMonthlyReports();
};

export default { initializeCronJobs, manuallyTriggerMonthlyReports };
