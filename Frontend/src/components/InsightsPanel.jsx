import React, { useMemo } from "react";
import { generateInsights, formatCurrency } from "../utils/insightUtils";

const InsightsPanel = ({ expenses = [], budget = 0 }) => {
  const insights = useMemo(() => {
    return generateInsights(expenses);
  }, [expenses]);

  const budgetUsage = budget > 0 ? Math.round((insights.currentMonth / budget) * 100) : 0;
  const budgetWarning = budgetUsage >= 80 && budget > 0;

  if (!insights.hasData) {
    return (
      <div className="insights-container">
        <div className="insights-empty">
          <p>📊 Start tracking your expenses to see insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-container">
      <div className="insights-grid">
        {/* Spending Overview */}
        <div className="insight-card insight-primary">
          <div className="insight-icon">💰</div>
          <div className="insight-content">
            <h4>Total Spending</h4>
            <p className="insight-value">{formatCurrency(insights.totalSpending)}</p>
            <span className="insight-meta">{insights.expenseCount} transactions</span>
          </div>
        </div>

        {/* Current Month */}
        <div className="insight-card insight-info">
          <div className="insight-icon">📅</div>
          <div className="insight-content">
            <h4>{insights.monthName} Spending</h4>
            <p className="insight-value">{formatCurrency(insights.currentMonth)}</p>
            <span className="insight-meta">This month</span>
          </div>
        </div>

        {/* Top Category */}
        <div className="insight-card insight-success">
          <div className="insight-icon">🏆</div>
          <div className="insight-content">
            <h4>Top Category</h4>
            <p className="insight-value">
              {insights.topCategory.category || "No data"}
            </p>
            <span className="insight-meta">
              {insights.topCategory.category
                ? formatCurrency(insights.topCategory.amount)
                : "Start adding expenses"}
            </span>
          </div>
        </div>

        {budget > 0 && (
          <div className={`insight-card ${budgetWarning ? "insight-warning" : "insight-info"} budget-usage-card`}>
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h4>Budget Usage</h4>
              <p className={`insight-value ${budgetWarning ? "budget-usage-blink" : ""}`}>
                {budgetUsage}% used
              </p>
              <span className="insight-meta">
                Out of {formatCurrency(budget)} this month
              </span>
            </div>
          </div>
        )}

        {/* Month Comparison */}
        <div
          className={`insight-card insight-comparison ${
            insights.monthlyComparison.direction === "down"
              ? "insight-positive"
              : "insight-warning"
          }`}
        >
          <div className="insight-icon">
            {insights.monthlyComparison.direction === "down" ? "📉" : "📈"}
          </div>
          <div className="insight-content">
            <h4>Month-over-Month</h4>
            <p className="insight-value">
              {insights.monthlyComparison.percentage}%{" "}
              {insights.monthlyComparison.direction === "down" ? "↓" : "↑"}
            </p>
            <span className="insight-meta">
              {insights.monthlyComparison.direction === "down"
                ? "You're spending less"
                : "You're spending more"}
            </span>
          </div>
        </div>
      </div>

      {/* Insights Messages */}
      <div className="insights-messages">
        <h4 className="insights-title">💡 Smart Insights</h4>
        <ul className="insights-list">
          <li>
            <span className="insight-bullet">•</span>
            You've spent{" "}
            <strong>{formatCurrency(insights.currentMonth)}</strong> this month
          </li>

          {insights.topCategory.category && (
            <li>
              <span className="insight-bullet">•</span>
              <strong>{insights.topCategory.category}</strong> is your highest
              spending category at{" "}
              <strong>{formatCurrency(insights.topCategory.amount)}</strong>
            </li>
          )}

          {insights.previousMonth > 0 && (
            <li>
              <span className="insight-bullet">•</span>
              You spent{" "}
              <strong>
                {insights.monthlyComparison.percentage}%{" "}
                {insights.monthlyComparison.direction === "down"
                  ? "less"
                  : "more"}
              </strong>{" "}
              compared to last month
            </li>
          )}

          {insights.topCategories.length > 1 && (
            <li>
              <span className="insight-bullet">•</span>
              Your top 3 categories are{" "}
              <strong>
                {insights.topCategories
                  .map((cat) => cat.category)
                  .join(", ")}
              </strong>
            </li>
          )}

          {insights.currentMonth > 0 && insights.expenseCount > 0 && (
            <li>
              <span className="insight-bullet">•</span>
              Average spending per transaction:{" "}
              <strong>
                {formatCurrency(
                  insights.currentMonth / insights.expenseCount
                )}
              </strong>
            </li>
          )}

          {insights.currentMonth > 2000 && (
            <li>
              <span className="insight-bullet">•</span>
              <span className="insight-warning-text">
                ⚠️ Your spending is increasing. Consider reviewing your budget.
              </span>
            </li>
          )}

          {budget > 0 && (
            <li className={budgetWarning ? "insight-warning-text budget-usage-note" : ""}>
              <span className="insight-bullet">•</span>
              {budgetWarning
                ? `⚠️ You've used ${budgetUsage}% of your monthly budget.`
                : `You've used ${budgetUsage}% of your monthly budget.`}
            </li>
          )}
        </ul>
      </div>

      {/* Category Breakdown */}
      {insights.topCategories.length > 0 && (
        <div className="category-breakdown">
          <h4 className="insights-title">📊 Top Categories</h4>
          <div className="category-list">
            {insights.topCategories.map((cat, index) => {
              const percentage = Math.round(
                (cat.amount / insights.totalSpending) * 100
              );
              return (
                <div key={cat.category} className="category-item">
                  <div className="category-info">
                    <span className="category-rank">#{index + 1}</span>
                    <div className="category-details">
                      <p className="category-name">{cat.category}</p>
                      <p className="category-amount">
                        {formatCurrency(cat.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="category-progress">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="category-percentage">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
