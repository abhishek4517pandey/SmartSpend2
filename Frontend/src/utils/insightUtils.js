/**
 * Calculate total spending for a given set of expenses
 * @param {Array} expenses - Array of expense objects
 * @returns {number} - Total spending amount
 */
export const calculateTotalSpending = (expenses) => {
  if (!Array.isArray(expenses) || expenses.length === 0) return 0;
  return expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
};

/**
 * Find the top spending category
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} - Object with category name and amount
 */
export const getTopCategory = (expenses) => {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return { category: null, amount: 0 };
  }

  const categoryTotals = {};
  expenses.forEach((expense) => {
    const category = expense.category || "Uncategorized";
    categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
  });

  let topCategory = null;
  let maxAmount = 0;
  Object.entries(categoryTotals).forEach(([category, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategory = category;
    }
  });

  return { category: topCategory, amount: maxAmount };
};

/**
 * Get the current month's spending
 * @param {Array} expenses - Array of expense objects
 * @returns {number} - Total spending for current month
 */
export const getCurrentMonthSpending = (expenses) => {
  if (!Array.isArray(expenses) || expenses.length === 0) return 0;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);
};

/**
 * Get the previous month's spending
 * @param {Array} expenses - Array of expense objects
 * @returns {number} - Total spending for previous month
 */
export const getPreviousMonthSpending = (expenses) => {
  if (!Array.isArray(expenses) || expenses.length === 0) return 0;

  const today = new Date();
  let prevMonth = today.getMonth() - 1;
  let prevYear = today.getFullYear();

  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear -= 1;
  }

  return expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === prevMonth &&
        expenseDate.getFullYear() === prevYear
      );
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);
};

/**
 * Calculate percentage change between two values
 * @param {number} current - Current month spending
 * @param {number} previous - Previous month spending
 * @returns {Object} - Object with percentage, direction, and status
 */
export const calculateMonthlyComparison = (current, previous) => {
  if (previous === 0) {
    return {
      percentage: 0,
      direction: "up",
      status: "no-previous-data",
      message: "First month with expenses",
    };
  }

  const difference = current - previous;
  const percentage = Math.round((Math.abs(difference) / previous) * 100);
  const direction = difference >= 0 ? "up" : "down";

  return {
    percentage,
    direction,
    difference,
    message:
      difference >= 0
        ? `${percentage}% more than last month`
        : `${percentage}% less than last month`,
  };
};

/**
 * Get top 3 spending categories
 * @param {Array} expenses - Array of expense objects
 * @returns {Array} - Array of top 3 categories with amounts
 */
export const getTopCategories = (expenses, limit = 3) => {
  if (!Array.isArray(expenses) || expenses.length === 0) return [];

  const categoryTotals = {};
  expenses.forEach((expense) => {
    const category = expense.category || "Uncategorized";
    categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
  });

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};

/**
 * Generate spending insights
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} - Object containing various insights
 */
export const generateInsights = (expenses) => {
  const totalSpending = calculateTotalSpending(expenses);
  const currentMonth = getCurrentMonthSpending(expenses);
  const previousMonth = getPreviousMonthSpending(expenses);
  const topCategory = getTopCategory(expenses);
  const monthlyComparison = calculateMonthlyComparison(currentMonth, previousMonth);
  const topCategories = getTopCategories(expenses, 3);

  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });

  return {
    totalSpending,
    currentMonth,
    previousMonth,
    topCategory,
    monthlyComparison,
    topCategories,
    monthName,
    hasData: expenses.length > 0,
    expenseCount: expenses.length,
  };
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};
