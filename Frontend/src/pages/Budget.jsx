import React, { useEffect, useState } from "react";
import api from "../api/axios";

const CATEGORIES = [
  "Food & Dining",
  "Travel & Transport",
  "Books & Stationery",
  "Rent & Utilities",
  "Subscriptions",
  "Shopping",
  "Others"
];

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [form, setForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalBudget: "",
    categoryBudgets: []
  });
  const [categoryForm, setCategoryForm] = useState({
    category: CATEGORIES[0],
    amount: ""
  });

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await api.get("/budget");
        if (res.data) {
          setBudget(res.data);
          setForm({
            month: res.data.month,
            year: res.data.year,
            totalBudget: res.data.totalBudget,
            categoryBudgets: res.data.categoryBudgets || []
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBudget();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const addCategoryBudget = () => {
    if (!categoryForm.category || !categoryForm.amount) {
      alert("Please select a category and enter an amount");
      return;
    }

    // Check if category already exists
    const exists = form.categoryBudgets.some(cb => cb.category === categoryForm.category);
    if (exists) {
      alert(`${categoryForm.category} already added`);
      return;
    }

    setForm((prev) => ({
      ...prev,
      categoryBudgets: [
        ...prev.categoryBudgets,
        {
          category: categoryForm.category,
          amount: Number(categoryForm.amount)
        }
      ]
    }));

    // Reset category form
    setCategoryForm({
      category: CATEGORIES[0],
      amount: ""
    });
  };

  const removeCategoryBudget = (category) => {
    setForm((prev) => ({
      ...prev,
      categoryBudgets: prev.categoryBudgets.filter(cb => cb.category !== category)
    }));
  };

  const handleSave = async () => {
    const totalBudgetValue = Number(form.totalBudget);
    if (!totalBudgetValue || totalBudgetValue <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }
    if (totalBudgetValue > 100000) {
      alert("Total monthly budget cannot exceed ₹100000.");
      return;
    }

    try {
      const body = {
        month: Number(form.month),
        year: Number(form.year),
        totalBudget: totalBudgetValue,
        categoryBudgets: form.categoryBudgets
      };
      const res = await api.post("/budget", body);
      setBudget(res.data);
      alert("Budget saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving budget");
    }
  };


  return (
    <div className="page">
      <h1>Budget</h1>
      <p className="subtitle">
        Set your monthly budget and optional category-wise limits.
      </p>

      {budget && (
        <div className="info-box">
          <h2>Current Budget</h2>
          <p>
            <strong>
              {budget.month}/{budget.year}
            </strong>{" "}
            – Total Budget: <strong>₹ {budget.totalBudget}</strong>
          </p>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label>Month (1–12)</label>
          <input
            type="number"
            name="month"
            value={form.month}
            onChange={handleChange}
            min="1"
            max="12"
          />
        </div>

        <div className="form-group">
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            min="2020"
          />
        </div>

        <div className="form-group">
          <label>Total Monthly Budget (₹)</label>
          <input
            type="number"
            name="totalBudget"
            value={form.totalBudget}
            onChange={handleChange}
            placeholder="e.g., 50000"
          min="0"
          max="100000"
          />
          </div>
        <div className="category-budget-form">
          <div className="form-group">
            <label>Select Category</label>
            <select
              value={categoryForm.category}
              onChange={handleCategoryFormChange}
              name="category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={categoryForm.amount}
              onChange={handleCategoryFormChange}
              placeholder="e.g., 5000"
              min="0"
            />
          </div>

          <button
            type="button"
            className="add-category-button"
            onClick={addCategoryBudget}
          >
            + Add Category
          </button>
        </div>

        {/* List of Added Categories */}
        {form.categoryBudgets.length > 0 && (
          <div className="category-budget-list">
            <h3>Added Categories</h3>
            <div className="category-items">
              {form.categoryBudgets.map((cb) => (
                <div key={cb.category} className="category-budget-item">
                  <div className="category-budget-info">
                    <span className="category-budget-name">{cb.category}</span>
                    <span className="category-budget-amount">₹ {cb.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    type="button"
                    className="remove-category-button"
                    onClick={() => removeCategoryBudget(cb.category)}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="category-budget-summary">
              <strong>Total Category Budgets:</strong>
              <span>₹ {form.categoryBudgets.reduce((sum, cb) => sum + cb.amount, 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      <button className="primary-button" onClick={handleSave}>
        Save Budget
      </button>
    </div>
  );
};


export default Budget;