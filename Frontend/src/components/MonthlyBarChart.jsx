import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getMonthlyChartData,
  getMonthlyChartOptions,
} from "../utils/chartUtils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarChart = ({ expenses, isDarkMode = true }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      setChartData(getMonthlyChartData(expenses, isDarkMode));
      setChartOptions(getMonthlyChartOptions(isDarkMode));
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
    <div className="monthly-chart-container">
      <h3>Monthly Expenses</h3>
      <div className="chart-wrapper">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MonthlyBarChart;
