import React, { useEffect, useState } from "react";

const ExpenseModal = ({ isOpen, onClose, onSave, expense }) => {
  const [form, setForm] = useState({
    amount: "",
    category: "Food & Dining",
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: "Cash",
    description: "",
    tags: ""
  });

  useEffect(() => {
    if (expense) {
      setForm({
        amount: expense.amount || "",
        category: expense.category || "Food & Dining",
        date: expense.date ? expense.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        paymentMethod: expense.paymentMethod || "Cash",
        description: expense.description || "",
        tags: expense.tags ? expense.tags.join(", ") : ""
      });
    } else {
      setForm({
        amount: "",
        category: "Food & Dining",
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: "Cash",
        description: "",
        tags: ""
      });
    }
  }, [expense]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.category) {
      alert("Please enter an amount and category.");
      return;
    }

    await onSave({
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
      description: form.description,
      tags: form.tags
        ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : []
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-large">
        <h2>{expense ? "Edit Expense" : "Add Expense"}</h2>
        <div className="expense-form-grid">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 876.76"
              step="0.01"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Food & Dining</option>
              <option>Travel & Transport</option>
              <option>Books & Stationery</option>
              <option>Rent & Utilities</option>
              <option>Subscriptions</option>
              <option>Shopping</option>
              <option>Others</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option>Cash</option>
              <option>UPI/GPay</option>
              <option>Card</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. lunch with friends"
            />
          </div>
          <div className="form-group full-width">
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. travel, food"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" onClick={handleSubmit}>
            {expense ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
