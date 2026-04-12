import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/SavingGoals.css";

const GOAL_ICONS = [
  { icon: "📱", label: "Phone" },
  { icon: "🏠", label: "Home" },
  { icon: "🚗", label: "Car" },
  { icon: "✈️", label: "Travel" },
  { icon: "📚", label: "Education" },
  { icon: "💍", label: "Wedding" },
  { icon: "🎮", label: "Gaming" },
  { icon: "⌚", label: "Watch" },
  { icon: "🎧", label: "Gadgets" },
  { icon: "💎", label: "Luxury" },
  { icon: "🎯", label: "Other" }
];

const SavingGoals = ({ budget }) => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    icon: "🎯",
    category: "Savings",
    priority: "Medium"
  });
  const [editingGoalId, setEditingGoalId] = useState(null);

  useEffect(() => {
    if (budget && budget.savingGoals) {
      setGoals(budget.savingGoals);
    }
  }, [budget]);

  const calculateProgress = (current, target) => {
    if (target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();

    if (!formData.goalName || !formData.targetAmount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await api.post("/budget/saving-goal", {
        goalName: formData.goalName,
        targetAmount: Number(formData.targetAmount),
        icon: formData.icon,
        category: formData.category,
        priority: formData.priority
      });

      setGoals(res.data.savingGoals || []);
      setFormData({
        goalName: "",
        targetAmount: "",
        icon: "🎯",
        category: "Savings",
        priority: "Medium"
      });
      setShowForm(false);
      alert("Goal added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding goal");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      const res = await api.delete(`/budget/saving-goal/${goalId}`);
      setGoals(res.data.savingGoals || []);
      alert("Goal deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting goal");
    }
  };

  const handleAddAmount = async (goalId, currentGoal) => {
    const amountStr = prompt(
      `Add amount to "${currentGoal.goalName}" (Current: ₹${currentGoal.currentAmount})`
    );

    if (!amountStr) return;

    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await api.put(`/budget/saving-goal/${goalId}/add-amount`, {
        amount
      });
      setGoals(res.data.savingGoals || []);
      alert(`Added ₹${amount} to your goal!`);
    } catch (err) {
      console.error(err);
      alert("Error updating goal");
    }
  };

  const getTotalProgress = () => {
    if (goals.length === 0) return 0;
    const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    return calculateProgress(totalCurrent, totalTarget);
  };

  const getTotalSaved = () => goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const getTotalTarget = () => goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="saving-goals-section">
      <div className="goals-header">
        <div className="goals-title-group">
          <h2 className="goals-title">💰 Saving Goals</h2>
          <p className="goals-subtitle">
            Track your financial dreams and watch them come true
          </p>
        </div>
        <button
          className="add-goal-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Cancel" : "+ Add Goal"}
        </button>
      </div>

      {/* Overall Progress Summary */}
      {goals.length > 0 && (
        <div className="goals-summary-card">
          <div className="summary-content">
            <div className="summary-stat">
              <span className="summary-label">Total Saved</span>
              <h3 className="summary-amount">₹{getTotalSaved().toLocaleString('en-IN')}</h3>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-stat">
              <span className="summary-label">Total Target</span>
              <h3 className="summary-amount">₹{getTotalTarget().toLocaleString('en-IN')}</h3>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-stat">
              <span className="summary-label">Overall Progress</span>
              <h3 className="summary-percentage">{Math.round(getTotalProgress())}%</h3>
            </div>
          </div>
          <div className="summary-progress-bar">
            <div
              className="summary-progress-fill"
              style={{ width: `${getTotalProgress()}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Add Goal Form */}
      {showForm && (
        <div className="goal-form-container">
          <form onSubmit={handleAddGoal} className="goal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Goal Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Buy iPhone"
                  value={formData.goalName}
                  onChange={(e) =>
                    setFormData({ ...formData, goalName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Target Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                  min="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Select Icon</label>
                <div className="icon-grid">
                  {GOAL_ICONS.map((g) => (
                    <button
                      key={g.icon}
                      type="button"
                      className={`icon-btn ${
                        formData.icon === g.icon ? "active" : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, icon: g.icon })
                      }
                      title={g.label}
                    >
                      {g.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option>Savings</option>
                  <option>Investment</option>
                  <option>Emergency</option>
                  <option>Personal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-goal-btn">
              Create Goal
            </button>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No Saving Goals Yet</h3>
          <p>Start by creating your first goal to begin your savings journey!</p>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <div key={goal._id} className="goal-card">
                <div className="goal-card-header">
                  <div className="goal-icon-large">{goal.icon}</div>
                  <div className="goal-actions">
                    <button
                      className="goal-action-btn edit-btn"
                      title="Add Amount"
                      onClick={() => handleAddAmount(goal._id, goal)}
                    >
                      ➕
                    </button>
                    <button
                      className="goal-action-btn delete-btn"
                      title="Delete"
                      onClick={() => handleDeleteGoal(goal._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="goal-info">
                  <h3 className="goal-name">{goal.goalName}</h3>
                  <p className="goal-category">{goal.category} • {goal.priority}</p>
                </div>

                <div className="goal-amount-display">
                  <div className="amount-box current">
                    <span className="amount-label">Saved</span>
                    <span className="amount-value">₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="amount-box remaining">
                    <span className="amount-label">Remaining</span>
                    <span className="amount-value">₹{Math.max(0, remaining).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="goal-progress-section">
                  <div className="progress-header">
                    <span className="progress-text">
                      ₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="progress-percentage">{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="goal-footer">
                  <div className="days-left">
                    {remaining > 0 ? (
                      <span>💪 Keep saving! {remaining > 0 ? `₹${remaining.toLocaleString('en-IN')} left` : "✅ Goal Achieved!"}</span>
                    ) : (
                      <span className="goal-achieved">✨ Goal Achieved! 🎉</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingGoals;
