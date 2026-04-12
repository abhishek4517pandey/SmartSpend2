export const groupByCategory = (expenses) => {
  const grouped = {};
  expenses.forEach((expense) => {
    const category = expense.category || "Uncategorized";
    grouped[category] = (grouped[category] || 0) + expense.amount;
  });
  return grouped;
};

export const groupByMonth = (expenses) => {
  const grouped = {};
  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("default", { year: "numeric", month: "short" });
    if (!grouped[monthKey]) {
      grouped[monthKey] = { label: monthLabel, total: 0 };
    }
    grouped[monthKey].total += expense.amount;
  });
  return grouped;
};

export const getCategoryChartData = (expenses, isDarkMode = true) => {
  const data = groupByCategory(expenses);
  const categories = Object.keys(data);
  const amounts = Object.values(data);

  // Color palette
  const colors = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#6366f1",
  ];

  return {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: isDarkMode ? "#020617" : "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
};

export const getCategoryChartOptions = (isDarkMode = true) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1e293b";
  const gridColor = isDarkMode ? "#334155" : "#cbd5e1";

  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          font: {
            size: 13,
            weight: 500,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
        titleColor: isDarkMode ? "#f8fafc" : "#0f172a",
        bodyColor: isDarkMode ? "#e5e7eb" : "#1e293b",
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };
};

export const getMonthlyChartData = (expenses, isDarkMode = true) => {
  const data = groupByMonth(expenses);
  const sortedMonths = Object.keys(data).sort();
  const labels = sortedMonths.map((key) => data[key].label);
  const amounts = sortedMonths.map((key) => data[key].total);

  return {
    labels,
    datasets: [
      {
        label: "Monthly Expenses",
        data: amounts,
        backgroundColor: isDarkMode ? "#22c55e" : "#16a34a",
        borderColor: isDarkMode ? "#16a34a" : "#15803d",
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: isDarkMode ? "#16a34a" : "#15803d",
      },
    ],
  };
};

export const getMonthlyChartOptions = (isDarkMode = true) => {
  const textColor = isDarkMode ? "#e5e7eb" : "#1e293b";
  const gridColor = isDarkMode ? "#334155" : "#cbd5e1";

  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: textColor,
          font: {
            size: 13,
            weight: 600,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
        titleColor: isDarkMode ? "#f8fafc" : "#0f172a",
        bodyColor: isDarkMode ? "#e5e7eb" : "#1e293b",
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            return `Expenses: ₹${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: {
            size: 12,
          },
        },
        grid: {
          color: gridColor,
          drawBorder: false,
          display: false,
        },
      },
      y: {
        ticks: {
          color: textColor,
          font: {
            size: 12,
          },
          callback: function (value) {
            return "₹" + value.toFixed(0);
          },
        },
        grid: {
          color: gridColor,
          drawBorder: false,
        },
      },
    },
  };
};
