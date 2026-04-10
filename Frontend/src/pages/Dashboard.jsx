import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext.jsx";
import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyBarChart from "../components/MonthlyBarChart";
import InsightsPanel from "../components/InsightsPanel";
import BudgetAlert from "../components/BudgetAlert";

const filterOptions = [
  { value: "today", label: "Today", days: 1, today: true },
  { value: "last7", label: "Last week", days: 7 },
  { value: "last30", label: "Last month", days: 30 },
  { value: "last60", label: "Last 60 days", days: 60 },
  { value: "year", label: "This year", days: null, year: true },
  { value: "all", label: "All time", days: null, all: true }
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [selectedRange, setSelectedRange] = useState("last30");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setProfile(null);
      return;
    }

    const fetchData = async () => {
      try {
        const [expRes, profRes, budgetRes] = await Promise.all([
          api.get("/expenses"),
          api.get("/profile"),
          api.get("/budget")
        ]);
        setExpenses(expRes.data || []);
        setProfile(profRes.data || null);
        setBudgetData(budgetRes.data || null);
      } catch (error) {
        console.error(error);
      }
    };

    const handleExpenseAdded = () => {
      fetchData();
    };

    fetchData();
    window.addEventListener("expenseAdded", handleExpenseAdded);
    return () => window.removeEventListener("expenseAdded", handleExpenseAdded);
  }, [user]);

  // Detect theme changes
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "dark";
    setIsDarkMode(currentTheme === "dark");

    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme") || "dark";
      setIsDarkMode(theme === "dark");
    };

    window.addEventListener("storage", handleThemeChange);
    // Also check for data-theme attribute changes
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute("data-theme") || "dark";
      setIsDarkMode(theme === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const getStartDate = (range) => {
    const today = new Date();
    if (range === "all") return null;
    if (range === "year") return new Date(today.getFullYear(), 0, 1);
    if (range === "today") return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return new Date(today.getTime() - (filterOptions.find((opt) => opt.value === range)?.days || 30) * 24 * 60 * 60 * 1000);
  };

  const filteredExpenses = useMemo(() => {
    const startDate = getStartDate(selectedRange);
    if (!startDate) return expenses;
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate;
    });
  }, [expenses, selectedRange]);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyBudget = budgetData?.totalBudget || profile?.monthlyBudget || 0;
  const remaining = monthlyBudget - totalSpent;
  const percentUsed =
    monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : 0;

  const chartData = useMemo(() => {
    const today = new Date();
    const buckets = [];
    const isToday = selectedRange === "today";
    const isWeek = selectedRange === "last7";
    const periodDays = filterOptions.find((opt) => opt.value === selectedRange)?.days;

    if (isToday) {
      for (let i = 0; i < 12; i += 1) {
        const bucketDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), i * 2);
        const label = bucketDate.toLocaleTimeString("default", { hour: "numeric", hour12: true });
        buckets.push({
          key: `${bucketDate.getFullYear()}-${bucketDate.getMonth()}-${bucketDate.getDate()}-${bucketDate.getHours()}`,
          label,
          total: 0
        });
      }
    } else if (isWeek) {
      for (let i = 6; i >= 0; i -= 1) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        buckets.push({
          key,
          label: date.toLocaleDateString("default", { weekday: "short" }),
          total: 0
        });
      }
    } else if (selectedRange === "year" || selectedRange === "all") {
      for (let i = 11; i >= 0; i -= 1) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        buckets.push({
          key,
          label: date.toLocaleString("default", { month: "short" }),
          total: 0
        });
      }
    } else {
      const monthsToShow = Math.ceil((periodDays || 30) / 30) + 1;
      for (let i = monthsToShow - 1; i >= 0; i -= 1) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        buckets.push({
          key,
          label: date.toLocaleString("default", { month: "short" }),
          total: 0
        });
      }
    }

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const bucketKey = isToday
        ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${Math.floor(date.getHours() / 2) * 2}`
        : isWeek
        ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        : `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = buckets.find((b) => b.key === bucketKey);
      if (bucket) {
        bucket.total += expense.amount;
      }
    });

    const maxTotal = Math.max(...buckets.map((b) => b.total), 1);
    return buckets.map((bucket) => ({
      ...bucket,
      height: Math.round((bucket.total / maxTotal) * 100)
    }));
  }, [filteredExpenses, selectedRange]);

  const linePath = useMemo(() => {
    if (!chartData.length) return "";
    return chartData
      .map((point, index) => {
        const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100;
        const y = 100 - point.height;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [chartData]);

  if (!user) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <p className="subtitle">
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to view your budget and profile.
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">
            {profile?.name
              ? `Good day, ${profile.name}. Here’s how your month looks.`
              : "Welcome to SmartSpend. Set up your profile to personalize your dashboard."}
          </p>
        </div>

        <div className="dashboard-filter-panel">
          <label>Show:</label>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BudgetAlert 
        spent={totalSpent} 
        budget={monthlyBudget} 
        showDetails={true}
      />

      <div className="dashboard-summary-grid">
        <div className="summary-card filter-summary">
          <h3>Current filter</h3>
          <p className="summary-value">{filterOptions.find((opt) => opt.value === selectedRange)?.label}</p>
          <p className="summary-subtext">Total expense in selected window</p>
        </div>
        <div className="summary-card filter-summary">
          <h3>Total expense</h3>
          <p className="summary-value">₹ {totalSpent}</p>
          <p className="summary-subtext">Filtered expenses only</p>
        </div>
        <div className="summary-card filter-summary">
          <h3>Monthly Budget</h3>
          <p className="summary-value">₹ {monthlyBudget.toLocaleString('en-IN')}</p>
          <p className="summary-subtext">Latest saved budget</p>
        </div>
      </div>

      <InsightsPanel expenses={expenses} budget={monthlyBudget} />

      <div className="chart-card">
        <div className="chart-title">Expense trend</div>
        <div className="line-chart">
          <div className="line-chart-inner">
            <svg viewBox="0 0 100 110" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-hover)" />
                </linearGradient>
              </defs>
              {[20, 40, 60, 80].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="var(--border-color)"
                  strokeDasharray="2 4"
                  opacity="0.3"
                />
              ))}
              <path d={linePath} fill="none" stroke="url(#lineGradient)" strokeWidth="2.5" />
              {chartData.map((point, index) => {
                const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100;
                const y = 100 - point.height;
                return (
                  <circle
                    key={`${point.key}-dot`}
                    cx={x}
                    cy={y}
                    r="2.8"
                    fill="var(--accent)"
                    stroke="var(--bg-primary)"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>
          <div className="line-chart-labels">
            {chartData.map((point) => (
              <div key={`${point.key}-label`} className="line-chart-label">
                <span className="line-chart-label-text">{point.label}</span>
                <span className="line-chart-label-value">₹ {point.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-grid">
        <div className="summary-card">
          <h3>Monthly Budget</h3>
          <p className="summary-value">₹ {monthlyBudget || 0}</p>
        </div>
        <div className="summary-card">
          <h3>Spent So Far</h3>
          <p className="summary-value">₹ {totalSpent}</p>
          <p className="summary-subtext">{percentUsed}% of your budget</p>
        </div>
        <div className="summary-card">
          <h3>Remaining</h3>
          <p className="summary-value">₹ {remaining >= 0 ? remaining : 0}</p>
        </div>
        <div className="summary-card">
          <h3>Predicted Spend</h3>
          <p className="summary-value">
            ₹ {Math.max(totalSpent, Math.round(totalSpent * 1.05))}
          </p>
          <p className="summary-subtext">Simple projection based on current pace</p>
        </div>
      </div>

      <div className="info-box">
        <h2>Smart Suggestions</h2>
        {monthlyBudget > 0 ? (
          <>
            <p>
              You have used <strong>{percentUsed}%</strong> of your monthly budget.
            </p>
            {percentUsed > 80 ? (
              <p className="warning-text">
                You are close to your limit. Try to reduce optional spending for
                the remaining days.
              </p>
            ) : (
              <p>
                You are <strong>on track</strong>. Keep logging your expenses daily to
                stay in control.
              </p>
            )}
          </>
        ) : (
          <p>Set your monthly budget in the Profile or Budget page to see insights.</p>
        )}
      </div>

      <div className="charts-grid">
        <div className="charts-grid-item">
          <CategoryPieChart expenses={expenses} isDarkMode={isDarkMode} />
        </div>
        <div className="charts-grid-item">
          <MonthlyBarChart expenses={expenses} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;