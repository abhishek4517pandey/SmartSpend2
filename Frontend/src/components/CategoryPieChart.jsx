import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getCategoryChartData,
  getCategoryChartOptions,
} from "../utils/chartUtils";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ expenses, isDarkMode = true }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      setChartData(getCategoryChartData(expenses, isDarkMode));
      setChartOptions(getCategoryChartOptions(isDarkMode));
    }
  }, [expenses, isDarkMode]);

  if (!chartData) {
    return (
      <div className="chart-empty">
        <p>No expenses to display. Start tracking your spending!</p>
      </div>
    );
  }

  return (
    <div className="category-chart-container">
      <h3>Category Distribution</h3>
      <div className="chart-wrapper">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CategoryPieChart;
