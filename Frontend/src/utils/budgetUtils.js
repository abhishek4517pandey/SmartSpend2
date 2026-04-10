/**
 * Calculate budget usage percentage
 * @param {number} spent - Amount spent
 * @param {number} budget - Total budget
 * @returns {number} - Usage percentage
 */
export const calculateBudgetUsage = (spent, budget) => {
  if (!budget || budget === 0) return 0;
  return Math.round((spent / budget) * 100);
};

/**
 * Get alert status based on budget usage
 * @param {number} percentage - Budget usage percentage
 * @returns {Object} - Alert status object
 */
export const getBudgetAlertStatus = (percentage) => {
  if (percentage >= 100) {
    return {
      level: "danger",
      title: "Budget Exceeded",
      message: `You've exceeded your monthly budget by ${percentage - 100}%`,
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      icon: "🚨",
    };
  } else if (percentage >= 80) {
    return {
      level: "warning",
      title: "Budget Warning",
      message: `You've used ${percentage}% of your monthly budget`,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      icon: "⚠️",
    };
  } else if (percentage >= 50) {
    return {
      level: "info",
      title: "Budget Status",
      message: `You've used ${percentage}% of your monthly budget`,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
      icon: "ℹ️",
    };
  } else {
    return {
      level: "success",
      title: "Spending Under Control",
      message: `You've used ${percentage}% of your monthly budget`,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      icon: "✅",
    };
  }
};

/**
 * Get remaining budget amount
 * @param {number} budget - Total budget
 * @param {number} spent - Amount spent
 * @returns {number} - Remaining budget
 */
export const getRemainingBudget = (budget, spent) => {
  if (!budget) return 0;
  const remaining = budget - spent;
  return remaining > 0 ? remaining : 0;
};

/**
 * Format budget data for display
 * @param {number} spent - Amount spent
 * @param {number} budget - Total budget
 * @returns {Object} - Formatted budget data
 */
export const formatBudgetData = (spent, budget) => {
  const percentage = calculateBudgetUsage(spent, budget);
  const remaining = getRemainingBudget(budget, spent);
  const status = getBudgetAlertStatus(percentage);

  return {
    spent: spent || 0,
    budget: budget || 0,
    percentage,
    remaining,
    status,
  };
};
