import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import ExpenseModal from "../components/ExpenseModal.jsx";
import AdvancedFilters from "../components/AdvancedFilters.jsx";
import SendReportModal from "../components/SendReportModal.jsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [updatingExpenseId, setUpdatingExpenseId] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    paymentMethod: "",
    minAmount: "",
    maxAmount: "",
    description: "",
  });

  const categories = [
    "Food & Dining",
    "Travel & Transport",
    "Books & Stationery",
    "Rent & Utilities",
    "Subscriptions",
    "Shopping",
    "Others",
  ];

  const paymentMethods = ["Cash", "UPI/GPay", "Card", "Other"];

  const filterOptions = [
    { label: "All expenses", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "last7" },
    { label: "Last 30 days", value: "last30" },
    { label: "This year", value: "year" }
  ];

  const getStartDate = (filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "today":
        return today;
      case "last7": {
        const date = new Date(today);
        date.setDate(date.getDate() - 6);
        return date;
      }
      case "last30": {
        const date = new Date(today);
        date.setDate(date.getDate() - 29);
        return date;
      }
      case "year": {
        return new Date(today.getFullYear(), 0, 1);
      }
      default:
        return null;
    }
  };

  const filteredExpenses = useMemo(() => {
    let result = expenses;

    // Apply quick date filter
    const startDate = getStartDate(selectedFilter);
    if (startDate) {
      result = result.filter((expense) => {
        const expenseDate = new Date(expense.date);
        expenseDate.setHours(0, 0, 0, 0);

        if (selectedFilter === "year") {
          return expenseDate.getFullYear() === startDate.getFullYear();
        }

        return expenseDate >= startDate;
      });
    }

    // Apply advanced filters
    result = result.filter((expense) => {
      // Date range filter
      if (advancedFilters.dateFrom) {
        const expenseDate = new Date(expense.date);
        const filterDate = new Date(advancedFilters.dateFrom);
        if (expenseDate < filterDate) return false;
      }

      if (advancedFilters.dateTo) {
        const expenseDate = new Date(expense.date);
        const filterDate = new Date(advancedFilters.dateTo);
        // Set end date to end of day
        filterDate.setHours(23, 59, 59, 999);
        if (expenseDate > filterDate) return false;
      }

      // Category filter
      if (advancedFilters.category && expense.category !== advancedFilters.category) {
        return false;
      }

      // Payment method filter
      if (
        advancedFilters.paymentMethod &&
        expense.paymentMethod !== advancedFilters.paymentMethod
      ) {
        return false;
      }

      // Amount range filter
      if (advancedFilters.minAmount) {
        const minAmount = parseFloat(advancedFilters.minAmount);
        if (expense.amount < minAmount) return false;
      }

      if (advancedFilters.maxAmount) {
        const maxAmount = parseFloat(advancedFilters.maxAmount);
        if (expense.amount > maxAmount) return false;
      }

      // Description search filter (case-insensitive)
      if (advancedFilters.description) {
        const searchTerm = advancedFilters.description.toLowerCase();
        const description = (expense.description || "").toLowerCase();
        if (!description.includes(searchTerm)) return false;
      }

      return true;
    });

    return result;
  }, [expenses, selectedFilter, advancedFilters]);

  const handleDownload = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const title = `Expense History - ${
      filterOptions.find((option) => option.value === selectedFilter)?.label || "All"
    }`;

    doc.setFontSize(16);
    doc.text(title, 40, 40);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 58);

    const tableBody = filteredExpenses.map((exp) => [
      exp.date?.slice(0, 10) || "-",
      exp.category || "-",
      exp.description || "-",
      exp.paymentMethod || "-",
      `INR ${Number(exp.amount).toLocaleString()}`
    ]);

    doc.autoTable({
      startY: 75,
      head: [["Date", "Category", "Description", "Payment", "Amount"]],
      body: tableBody,
      theme: "striped",
      headStyles: {
        fillColor: [14, 165, 233],
        textColor: 255,
        fontStyle: "bold"
      },
      styles: {
        fontSize: 9,
        cellPadding: 6,
        textColor: 30
      },
      alternateRowStyles: {
        fillColor: [245, 248, 255]
      },
      margin: { left: 40, right: 40 }
    });

    const fileName = `expense-history-${selectedFilter}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmed) return;

    const expenseToDelete = expenses.find((exp) => exp._id === expenseId);
    if (!expenseToDelete) return;

    // Optimistic update: remove from state immediately
    setExpenses((prev) => prev.filter((expense) => expense._id !== expenseId));
    setDeletingExpenseId(expenseId);

    try {
      await api.delete(`/expenses/${expenseId}`);
      // Success: already removed from state
    } catch (error) {
      console.error(error);
      // Revert optimistic update on failure
      setExpenses((prev) => [...prev, expenseToDelete]);
      alert("Unable to delete expense. Please try again.");
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const handleSave = async (updatedData) => {
    if (!selectedExpense) return;

    // Optimistic update: update state immediately
    const optimisticExpense = { ...selectedExpense, ...updatedData };
    setExpenses((prev) =>
      prev.map((expense) => (expense._id === selectedExpense._id ? optimisticExpense : expense))
    );
    setUpdatingExpenseId(selectedExpense._id);
    setIsModalOpen(false);
    setSelectedExpense(null);

    try {
      const res = await api.put(`/expenses/${selectedExpense._id}`, updatedData);
      // Update with server response
      setExpenses((prev) =>
        prev.map((expense) => (expense._id === selectedExpense._id ? res.data : expense))
      );
    } catch (error) {
      console.error(error);
      // Revert optimistic update on failure
      setExpenses((prev) =>
        prev.map((expense) => (expense._id === selectedExpense._id ? selectedExpense : expense))
      );
      alert("Unable to update expense. Please try again.");
      // Reopen modal on failure
      setSelectedExpense(selectedExpense);
      setIsModalOpen(true);
    } finally {
      setUpdatingExpenseId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

    const handleExpenseAdded = () => {
      fetchExpenses();
    };

    window.addEventListener("expenseAdded", handleExpenseAdded);

    return () => {
      window.removeEventListener("expenseAdded", handleExpenseAdded);
    };
  }, []);

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Expenses</h1>
          <p className="subtitle">View and manage your daily expenses.</p>
        </div>
        <div className="download-summary">
          <span>{filteredExpenses.length} record{filteredExpenses.length === 1 ? "" : "s"} available</span>
          <button className="primary-button download-button" onClick={() => setIsReportModalOpen(true)} disabled={filteredExpenses.length === 0}>
            📧 Send Report
          </button>
          <button className="primary-button download-button" onClick={handleDownload} disabled={filteredExpenses.length === 0}>
            Download PDF
          </button>
        </div>
      </div>

      <div className="expense-toolbar">
        <div className="filter-group">
          <label htmlFor="expense-filter">Quick Filter</label>
          <select
            id="expense-filter"
            className="filter-select"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AdvancedFilters
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        categories={categories}
        paymentMethods={paymentMethods}
      />

      {loading ? (
        <p>Loading expenses...</p>
      ) : filteredExpenses.length === 0 ? (
        <p>No expenses found for the selected filter.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Payment</th>
              <th>Amount (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.date?.slice(0, 10)}</td>
                <td>{exp.category}</td>
                <td>{exp.description}</td>
                <td>{exp.paymentMethod}</td>
                <td>{exp.amount}</td>
                <td>
                  <button
                    className="small-button"
                    onClick={() => handleEdit(exp)}
                    disabled={updatingExpenseId === exp._id || deletingExpenseId === exp._id}
                  >
                    {updatingExpenseId === exp._id ? "Updating..." : "Edit"}
                  </button>
                  <button
                    className="small-button danger"
                    onClick={() => handleDelete(exp._id)}
                    disabled={updatingExpenseId === exp._id || deletingExpenseId === exp._id}
                  >
                    {deletingExpenseId === exp._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        expense={selectedExpense}
      />
      
      <SendReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => setIsReportModalOpen(false)}
        expenses={filteredExpenses}
      />
    </div>
  );
};

export default Expenses;