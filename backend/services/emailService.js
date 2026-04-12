import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER || "abhishek4517pandey@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_PASS) {
  console.warn(
    "EMAIL_PASS is missing. Set EMAIL_PASS in backend/.env using an app-specific Gmail password."
  );
}

// Create transporter for email sending
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email service connection error:", error.message);
    console.log("Make sure EMAIL_PASS is a valid Gmail app-specific password");
  } else {
    console.log("✅ Email service ready and authenticated");
  }
});

/**
 * Send expense report email to user
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 * @param {Array} expenses - Array of expenses to include in report
 * @param {string} period - Time period of the report (e.g., "Last 7 days")
 */
export const sendReportEmail = async (email, userName, expenses, period = "Current") => {
  try {
    if (!email) {
      throw new Error("Recipient email is required");
    }
    
    if (!expenses || expenses.length === 0) {
      throw new Error("No expenses to report");
    }

    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryBreakdown = {};
    
    expenses.forEach((exp) => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    });

    const categoryRows = Object.entries(categoryBreakdown)
      .map(([category, amount]) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${category}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
        </tr>
      `)
      .join("");

    const expenseRows = expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20) // Show top 20 expenses
      .map((exp) => {
        const expDate = exp.date instanceof Date 
          ? exp.date.toISOString().split('T')[0]
          : typeof exp.date === 'string'
          ? exp.date.split('T')[0]
          : "-";
        return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${expDate}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${exp.category || "-"}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${exp.description || "-"}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(exp.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
        </tr>
      `;
      })
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .header h1 { margin: 0; }
          .section { margin: 20px 0; }
          .section h2 { color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; }
          .summary-box { background: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; border-radius: 4px; margin: 10px 0; }
          .total { font-size: 24px; font-weight: bold; color: #0ea5e9; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Expense Report - ${period}</h1>
            <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
          </div>

          <p>Hi ${userName},</p>
          <p>Here's your ${period.toLowerCase()} expense report from SmartSpend:</p>

          <div class="section">
            <h2>Summary</h2>
            <div class="summary-box">
              <p><strong>Total Expenses:</strong></p>
              <p class="total">₹${Number(totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
              <p><strong>Number of Transactions:</strong> ${expenses.length}</p>
              <p><strong>Average per Expense:</strong> ₹${Number(totalAmount / expenses.length).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div class="section">
            <h2>Category Breakdown</h2>
            <table>
              <thead>
                <tr style="background: #f0f9ff;">
                  <th style="padding: 8px; text-align: left;">Category</th>
                  <th style="padding: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${categoryRows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Recent Expenses (Top 20)</h2>
            <table>
              <thead>
                <tr style="background: #f0f9ff;">
                  <th style="padding: 8px; text-align: left;">Date</th>
                  <th style="padding: 8px; text-align: left;">Category</th>
                  <th style="padding: 8px; text-align: left;">Description</th>
                  <th style="padding: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${expenseRows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <p>💡 Tip: Use filters in SmartSpend to analyze your spending by category or time period.</p>
          </div>

          <div class="footer">
            <p>SmartSpend - Track, Manage, and Optimize Your Finances</p>
            <p><a href="http://localhost:5173" style="color: #0ea5e9; text-decoration: none;">Open Dashboard</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"SmartSpend" <${EMAIL_USER}>`,
      to: email,
      subject: `📊 SmartSpend Expense Report - ${period}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Report sent successfully" };
  } catch (error) {
    console.error("❌ Error sending report email:", error.message);
    console.error("Error code:", error.code);
    console.error("Error details:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send budget alert email to user
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 * @param {number} percentageUsed - Percentage of budget used
 * @param {number} spent - Amount spent
 * @param {number} budgetLimit - Total budget limit
 * @param {string} category - Category name (optional)
 */
export const sendBudgetAlertEmail = async (email, userName, percentageUsed, spent, budgetLimit, category = null) => {
  try {
    const alertType = percentageUsed >= 80 ? "🔴 Critical" : "🟡 Warning";
    const categoryText = category ? ` for <strong>${category}</strong>` : "";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .header h1 { margin: 0; }
          .alert-box { background: ${percentageUsed >= 80 ? '#fee2e2' : '#fef3c7'}; border-left: 4px solid ${percentageUsed >= 80 ? '#dc2626' : '#f59e0b'}; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .progress-bar { background: #e5e7eb; border-radius: 10px; height: 30px; overflow: hidden; margin: 10px 0; }
          .progress-fill { background: ${percentageUsed >= 80 ? '#dc2626' : percentageUsed >= 50 ? '#f59e0b' : '#10b981'}; height: 100%; width: ${percentageUsed}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .cta-button { background: #0ea5e9; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${alertType} Budget Alert</h1>
            <p>You've used ${percentageUsed}% of your budget</p>
          </div>

          <p>Hi ${userName},</p>
          <p>This is a budget alert from SmartSpend!</p>

          <div class="alert-box">
            <h2 style="margin-top: 0;">Budget Usage${categoryText}</h2>
            <p><strong>Amount Spent:</strong> ₹${Number(spent).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            <p><strong>Budget Limit:</strong> ₹${Number(budgetLimit).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            <p><strong>Remaining:</strong> ₹${Number(budgetLimit - spent).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            
            <div class="progress-bar">
              <div class="progress-fill">${percentageUsed}%</div>
            </div>
          </div>

          ${percentageUsed >= 80 ? `
            <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p><strong>⚠️ Critical Alert:</strong> You've reached or exceeded 80% of your budget. Please review your spending and consider adjusting your expenses.</p>
            </div>
          ` : `
            <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p><strong>📌 Reminder:</strong> You've used 50% of your budget. Keep monitoring your expenses to stay within your plan.</p>
            </div>
          `}

          <p style="text-align: center; margin-top: 20px;">
            <a href="http://localhost:5173/expenses" class="cta-button">View Expenses</a>
            <a href="http://localhost:5173/budget" class="cta-button" style="background: #6b7280; margin-left: 10px;">Adjust Budget</a>
          </p>

          <div class="footer">
            <p>SmartSpend - Track, Manage, and Optimize Your Finances</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${alertType} - SmartSpend Budget Alert (${percentageUsed}%)`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Alert sent successfully" };
  } catch (error) {
    console.error("❌ Error sending budget alert email:", error.message);
    console.error("Error code:", error.code);
    throw new Error(`Failed to send budget alert: ${error.message}`);
  }
};

/**
 * Send monthly expense report email
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 * @param {Array} expenses - Array of expenses for the month
 * @param {number} month - Month number (1-12)
 * @param {number} year - Year
 */
export const sendMonthlyReportEmail = async (email, userName, expenses, month, year) => {
  try {
    const monthName = new Date(year, month - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryBreakdown = {};
    
    expenses.forEach((exp) => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    });

    const topCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${category || "-"}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${((amount / totalAmount) * 100).toFixed(1)}%</td>
        </tr>
      `)
      .join("");

    const dailyAverage = totalAmount / new Date(year, month, 0).getDate();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 28px; }
          .section { margin: 20px 0; }
          .section h2 { color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
          .stat-box { background: #f0f9ff; padding: 15px; border-radius: 4px; border-left: 4px solid #0ea5e9; }
          .stat-box .label { color: #666; font-size: 12px; text-transform: uppercase; }
          .stat-box .value { font-size: 24px; font-weight: bold; color: #0ea5e9; margin-top: 5px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .insight { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📈 Monthly Expense Report</h1>
            <p>${monthName}</p>
          </div>

          <p>Hi ${userName},</p>
          <p>Here's your monthly expense summary for ${monthName}:</p>

          <div class="stats-grid">
            <div class="stat-box">
              <div class="label">Total Spent</div>
              <div class="value">₹${Number(totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
            <div class="stat-box">
              <div class="label">Daily Average</div>
              <div class="value">₹${Number(dailyAverage).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
            <div class="stat-box">
              <div class="label">Transactions</div>
              <div class="value">${expenses.length}</div>
            </div>
            <div class="stat-box">
              <div class="label">Per Transaction</div>
              <div class="value">₹${Number(totalAmount / expenses.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
          </div>

          <div class="section">
            <h2>Top 5 Spending Categories</h2>
            <table>
              <thead>
                <tr style="background: #f0f9ff;">
                  <th style="padding: 8px; text-align: left;">Category</th>
                  <th style="padding: 8px; text-align: right;">Amount</th>
                  <th style="padding: 8px; text-align: right;">% of Total</th>
                </tr>
              </thead>
              <tbody>
                ${topCategories}
              </tbody>
            </table>
          </div>

          <div class="insight">
            <strong>💡 Insight:</strong> Your daily average spending for ${monthName} was ₹${Number(dailyAverage).toLocaleString('en-IN', { maximumFractionDigits: 0 })}. Compare this with previous months to identify spending patterns.
          </div>

          <p style="text-align: center; margin-top: 20px;">
            <a href="http://localhost:5173/expenses" style="background: #0ea5e9; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block;">View Detailed Report</a>
          </p>

          <div class="footer">
            <p>SmartSpend - Track, Manage, and Optimize Your Finances</p>
            <p>This is an automated monthly report. Manage your notification preferences in your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `📈 SmartSpend Monthly Report - ${monthName}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Monthly report sent successfully" };
  } catch (error) {
    console.error("❌ Error sending monthly report email:", error.message);
    console.error("Error code:", error.code);
    throw new Error(`Failed to send monthly report: ${error.message}`);
  }
};

/**
 * Send split expense notification email to participant
 * @param {string} email - Participant's email address
 * @param {string} personName - Name of the person
 * @param {number} owedAmount - Amount they are owed by others
 * @param {number} oweAmount - Amount they owe to others
 * @param {number} net - Net balance (positive = owed, negative = owes)
 * @param {string} status - Balance status (settled/owes/owed)
 */
export const sendSplitNotificationEmail = async (email, personName, owedAmount, oweAmount, net, status) => {
  try {
    if (!email) {
      throw new Error("Recipient email is required");
    }

    const getStatusEmoji = () => {
      if (status === "settled") return "✅";
      if (status === "owes") return "📕";
      if (status === "owed") return "📗";
      return "📙";
    };

    const getStatusMessage = () => {
      if (status === "settled") return "All settled! You don't owe anyone and no one owes you.";
      if (status === "owes") return `You owe a total of ₹${Math.abs(net).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      if (status === "owed") return `You are owed a total of ₹${net.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      return "Balance information updated";
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .status-box { 
            background: ${status === "settled" ? "#dcfce7" : status === "owes" ? "#fee2e2" : "#dbeafe"};
            border-left: 4px solid ${status === "settled" ? "#22c55e" : status === "owes" ? "#ef4444" : "#3b82f6"};
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .status-emoji { font-size: 32px; margin-right: 10px; }
          .amount { font-size: 32px; font-weight: bold; color: ${status === "settled" ? "#22c55e" : status === "owes" ? "#ef4444" : "#3b82f6"}; margin: 10px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: 600; color: #666; }
          .detail-value { color: #333; }
          .action-button { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 12px 32px; border: none; border-radius: 6px; text-decoration: none; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 SmartSpend - Expense Split Update</h1>
            <p>Your balance has been updated</p>
          </div>

          <p>Hi <strong>${personName}</strong>,</p>
          <p>Your expense split balance has been updated in SmartSpend. Here's your current status:</p>

          <div class="status-box">
            <div style="display: flex; align-items: center;">
              <span class="status-emoji">${getStatusEmoji()}</span>
              <div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${getStatusMessage()}</div>
              </div>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #22c55e;">Balance Details</h3>
            <div class="detail-row">
              <span class="detail-label">Amount You're Owed:</span>
              <span class="detail-value"><strong>₹${Number(owedAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount You Owe:</span>
              <span class="detail-value"><strong>₹${Number(oweAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></span>
            </div>
            <div class="detail-row" style="border-bottom: none;">
              <span class="detail-label" style="font-size: 16px;">Net Balance:</span>
              <span class="detail-value" style="font-size: 16px;"><strong style="color: ${status === "settled" ? "#22c55e" : status === "owes" ? "#ef4444" : "#3b82f6"};">₹${Math.abs(net).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></span>
            </div>
          </div>

          <p style="text-align: center; color: #666;">
            To settle payments or add more expenses, please log in to your SmartSpend account.
          </p>

          <div class="footer">
            <p>This is an automated notification from SmartSpend.</p>
            <p>© 2024 SmartSpend. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🔔 SmartSpend - Your Expense Split Balance Update`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Split notification sent successfully" };
  } catch (error) {
    console.error("❌ Error sending split notification email:", error.message);
    console.error("Error code:", error.code);
    throw new Error(`Failed to send split notification: ${error.message}`);
  }
};

export default transporter;
