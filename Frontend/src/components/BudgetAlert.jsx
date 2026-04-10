import React, { useMemo } from "react";
import { calculateBudgetUsage, getBudgetAlertStatus } from "../utils/budgetUtils";

const BudgetAlert = ({ spent = 0, budget = 0, showDetails = true }) => {
  const alertData = useMemo(() => {
    const percentage = calculateBudgetUsage(spent, budget);
    const status = getBudgetAlertStatus(percentage);
    const remaining = Math.max(0, budget - spent);

    return {
      percentage,
      status,
      remaining,
    };
  }, [spent, budget]);

  // Don't show alert if no budget
  if (!budget || budget === 0) {
    return null;
  }

  const { percentage, status, remaining } = alertData;

  return (
    <div
      className={`budget-alert budget-alert-${status.level}`}
      style={{
        backgroundColor: status.bgColor,
        borderColor: status.color,
      }}
    >
      <div className="budget-alert-header">
        <span className="budget-alert-icon">{status.icon}</span>
        <h3 className="budget-alert-title">{status.title}</h3>
      </div>

      <div className="budget-alert-content">
        <p className="budget-alert-message">{status.message}</p>

        {showDetails && (
          <div className="budget-alert-details">
            <div className="budget-progress-bar">
              <div
                className="budget-progress-fill"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: status.color,
                }}
              />
            </div>

            <div className="budget-stats">
              <div className="budget-stat">
                <span className="budget-stat-label">Spent</span>
                <span className="budget-stat-value">₹{spent.toFixed(2)}</span>
              </div>
              <div className="budget-stat">
                <span className="budget-stat-label">Budget</span>
                <span className="budget-stat-value">₹{budget.toFixed(2)}</span>
              </div>
              <div className="budget-stat">
                <span className="budget-stat-label">Remaining</span>
                <span
                  className="budget-stat-value"
                  style={{
                    color: remaining > 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  ₹{remaining.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetAlert;
