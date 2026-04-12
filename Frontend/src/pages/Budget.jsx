import React, { useEffect, useState } from "react";
import api from "../api/axios";
import SavingGoals from "../components/SavingGoals";
import "../styles/BudgetNew.css";

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [budgetForm, setBudgetForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalBudget: ""
  });
  const [passiveIncomeForm, setPassiveIncomeForm] = useState({
    source: "",
    amount: "",
    description: ""
  });
  const [showPassiveIncomeForm, setShowPassiveIncomeForm] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await api.get("/budget");
        if (res.data) {
          setBudget(res.data);
          setBudgetForm({
            month: res.data.month,
            year: res.data.year,
            totalBudget: res.data.totalBudget
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
  }, []);

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setBudgetForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePassiveIncomeChange = (e) => {
    const { name, value } = e.target;
    setPassiveIncomeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBudget = async () => {
    const totalBudgetValue = Number(budgetForm.totalBudget);
    if (!totalBudgetValue || totalBudgetValue <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }
    if (totalBudgetValue > 500000) {
      alert("Budget cannot exceed ₹500,000.");
      return;
    }

    try {
      const body = {
        month: Number(budgetForm.month),
        year: Number(budgetForm.year),
        totalBudget: totalBudgetValue
      };
      const res = await api.post("/budget", body);
      setBudget(res.data);
      alert("Budget saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving budget");
    }
  };

  const handleAddPassiveIncome = async (e) => {
    e.preventDefault();

    if (!passiveIncomeForm.source || !passiveIncomeForm.amount) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const res = await api.post("/budget/passive-income", {
        source: passiveIncomeForm.source,
        amount: Number(passiveIncomeForm.amount),
        description: passiveIncomeForm.description
      });

      setBudget(res.data);
      setPassiveIncomeForm({
        source: "",
        amount: "",
        description: ""
      });
      setShowPassiveIncomeForm(false);
      alert("Passive income added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding passive income");
    }
  };

  const handleDeletePassiveIncome = async (incomeId) => {
    if (!window.confirm("Delete this passive income source?")) return;

    try {
      const res = await api.delete(`/budget/passive-income/${incomeId}`);
      setBudget(res.data);
      alert("Passive income deleted!");
    } catch (err) {
      console.error(err);
      alert("Error deleting passive income");
    }
  };

  const getTotalPassiveIncome = () => {
    if (!budget || !budget.passiveIncomes) return 0;
    return budget.passiveIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  };

  const getTotalBudgetWithPassive = () => {
    if (!budget) return 0;
    return (budget.totalBudget || 0) + getTotalPassiveIncome();
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page budget-page">
      {/* Header Section */}
      <div className="budget-header">
        <div className="header-content">
          <h1>💰 Budget Management</h1>
          <p className="subtitle">
            Track your monthly budget and passive income streams
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="budget-grid">
        {/* Left Column - Budget Settings */}
        <div className="budget-column">
          {/* Monthly Budget Card */}
          <div className="budget-card monthly-budget-card">
            <div className="card-header">
              <h2 className="card-title">📅 Monthly Budget</h2>
              <span className="card-icon">💵</span>
            </div>

            <div className="budget-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Month</label>
                  <select
                    name="month"
                    value={budgetForm.month}
                    onChange={handleBudgetChange}
                    className="form-input"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleString("default", {
                          month: "long"
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={budgetForm.year}
                    onChange={handleBudgetChange}
                    min="2020"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Total Monthly Budget (₹)</label>
                <div className="input-with-icon">
                  <span className="currency-icon">₹</span>
                  <input
                    type="number"
                    name="totalBudget"
                    value={budgetForm.totalBudget}
                    onChange={handleBudgetChange}
                    placeholder="Enter your budget amount"
                    min="0"
                    max="500000"
                    className="form-input large-input"
                  />
                </div>
              </div>

              <button
                className="btn-save-budget"
                onClick={handleSaveBudget}
              >
                ✓ Save Budget
              </button>
            </div>

            {/* Budget Summary */}
            {budget && (
              <div className="budget-summary">
                <div className="summary-item">
                  <span className="summary-label">Current Month</span>
                  <span className="summary-value">
                    {budgetForm.month}/
                    {budgetForm.year}
                  </span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item">
                  <span className="summary-label">Monthly Budget</span>
                  <span className="summary-value highlight">
                    ₹{budget.totalBudget?.toLocaleString("en-IN") || "0"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Passive Income Card */}
          <div className="budget-card passive-income-card">
            <div className="card-header">
              <h2 className="card-title">💸 Passive Income</h2>
              <button
                className="btn-add-income"
                onClick={() =>
                  setShowPassiveIncomeForm(!showPassiveIncomeForm)
                }
              >
                {showPassiveIncomeForm ? "✕" : "+ Add"}
              </button>
            </div>

            {/* Passive Income Form */}
            {showPassiveIncomeForm && (
              <form onSubmit={handleAddPassiveIncome} className="passive-form">
                <div className="form-group">
                  <label>Income Source</label>
                  <input
                    type="text"
                    name="source"
                    value={passiveIncomeForm.source}
                    onChange={handlePassiveIncomeChange}
                    placeholder="e.g., Freelance, Part-time, Dividends"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <div className="input-with-icon">
                    <span className="currency-icon">₹</span>
                    <input
                      type="number"
                      name="amount"
                      value={passiveIncomeForm.amount}
                      onChange={handlePassiveIncomeChange}
                      placeholder="0"
                      min="0"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    name="description"
                    value={passiveIncomeForm.description}
                    onChange={handlePassiveIncomeChange}
                    placeholder="Add details about this income..."
                    className="form-input textarea"
                    rows="3"
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-income">
                  ✓ Add Income
                </button>
              </form>
            )}

            {/* Passive Income List */}
            {budget && budget.passiveIncomes && budget.passiveIncomes.length > 0 ? (
              <div className="income-list">
                {budget.passiveIncomes.map((income) => (
                  <div key={income._id} className="income-item">
                    <div className="income-info">
                      <h4 className="income-source">{income.source}</h4>
                      {income.description && (
                        <p className="income-desc">{income.description}</p>
                      )}
                      <span className="income-date">
                        Added on{" "}
                        {new Date(income.addedDate).toLocaleDateString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                    <div className="income-amount-container">
                      <span className="income-amount">
                        ₹{income.amount.toLocaleString("en-IN")}
                      </span>
                      <button
                        className="btn-delete-income"
                        onClick={() => handleDeletePassiveIncome(income._id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

                <div className="income-total">
                  <span className="total-label">Total Passive Income</span>
                  <span className="total-amount">
                    ₹{getTotalPassiveIncome().toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="empty-state-income">
                <p>No passive income sources yet</p>
                <small>Add income streams to boost your savings!</small>
              </div>
            )}
          </div>

          {/* Total Overview Card */}
          {budget && (
            <div className="budget-card total-overview-card">
              <h3 className="overview-title">📊 Total Monthly Income</h3>
              <div className="overview-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Base Budget</span>
                  <span className="breakdown-value">
                    ₹{budget.totalBudget?.toLocaleString("en-IN") || "0"}
                  </span>
                </div>
                <div className="breakdown-operator">+</div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Passive Income</span>
                  <span className="breakdown-value">
                    ₹{getTotalPassiveIncome().toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="overview-total">
                <span>Total Available</span>
                <span className="total-big-number">
                  ₹{getTotalBudgetWithPassive().toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Statistics and Info */}
        <div className="budget-column">
          {/* Quick Stats */}
          <div className="stats-container">
            <div className="stat-card income-stat">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <span className="stat-label">Monthly Budget</span>
                <h3 className="stat-amount">
                  ₹{budget?.totalBudget?.toLocaleString("en-IN") || "0"}
                </h3>
              </div>
            </div>

            <div className="stat-card passive-stat">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <span className="stat-label">Passive Income</span>
                <h3 className="stat-amount">
                  ₹{getTotalPassiveIncome().toLocaleString("en-IN")}
                </h3>
              </div>
            </div>

            <div className="stat-card total-stat">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <span className="stat-label">Total Income</span>
                <h3 className="stat-amount">
                  ₹{getTotalBudgetWithPassive().toLocaleString("en-IN")}
                </h3>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="info-card">
            <h3 className="info-title">💡 Tips</h3>
            <ul className="tips-list">
              <li>Set a realistic monthly budget for your needs</li>
              <li>Track all passive income sources</li>
              <li>Use the difference for savings goals</li>
              <li>Review and adjust monthly</li>
            </ul>
          </div>

          {/* Month/Year Overview */}
          {budget && (
            <div className="date-overview-card">
              <h3>Current Period</h3>
              <div className="date-display">
                <span className="month-name">
                  {new Date(2024, budgetForm.month - 1).toLocaleString(
                    "default",
                    { month: "long" }
                  )}
                </span>
                <span className="year-value">{budgetForm.year}</span>
              </div>
              <p className="date-note">Budget for this month is active</p>
            </div>
          )}
        </div>
      </div>

      {/* Saving Goals Section */}
      {budget && <SavingGoals budget={budget} />}
    </div>
  );
};

export default Budget;
