import React, { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { calculateBalances, getIndividualSummaries, formatCurrency } from "../utils/splitUtils";

const SplitView = () => {
  const [splits, setSplits] = useState([]);
  const [form, setForm] = useState({
    description: "",
    totalAmount: "",
    date: new Date().toISOString().slice(0, 10),
    paidBy: "",
    participants: ["", ""],
    newParticipant: "",
  });

  const fetchSplits = async () => {
    try {
      const res = await api.get("/split-expenses");
      setSplits(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setSplits([]);
    }
  };

  useEffect(() => {
    fetchSplits();
  }, []);

  const balanceData = useMemo(() => calculateBalances(splits), [splits]);
  const individualSummaries = useMemo(
    () => getIndividualSummaries(balanceData?.balances || {}),
    [balanceData]
  );

  const safeParticipants = Array.isArray(form.participants) ? form.participants : [];
  const validParticipants = safeParticipants.filter((p) => p?.trim());
  const shareCount = validParticipants.length;
  const shareAmount = shareCount > 0 && Number(form.totalAmount) > 0
    ? Number(form.totalAmount) / shareCount
    : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (index, value) => {
    setForm((prev) => {
      const participants = Array.isArray(prev.participants) ? [...prev.participants] : [];
      participants[index] = value;
      return { ...prev, participants };
    });
  };

  const addParticipant = () => {
    if (form.newParticipant?.trim()) {
      setForm((prev) => {
        const participants = Array.isArray(prev.participants) ? [...prev.participants] : [];
        return {
          ...prev,
          participants: [...participants, prev.newParticipant.trim()],
          newParticipant: "",
        };
      });
    }
  };

  const removeParticipant = (index) => {
    setForm((prev) => {
      const participants = Array.isArray(prev.participants) ? prev.participants.filter((_, i) => i !== index) : [];
      const removedParticipant = Array.isArray(prev.participants) ? prev.participants[index] : "";
      return {
        ...prev,
        participants,
        paidBy: prev.paidBy === removedParticipant ? "" : prev.paidBy,
      };
    });
  };

  const handleSave = async () => {
    if (!form.description.trim() || !form.totalAmount) {
      alert("Please enter description and amount");
      return;
    }

    const validParticipantsList = validParticipants;
    if (validParticipantsList.length < 2) {
      alert("Please add at least 2 participants");
      return;
    }

    if (!form.paidBy || !validParticipantsList.includes(form.paidBy)) {
      alert("Please select who paid from the participants");
      return;
    }

    const totalAmount = Number(form.totalAmount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      alert("Please enter a valid amount greater than zero");
      return;
    }

    try {
      const payload = {
        description: form.description.trim(),
        totalAmount,
        date: form.date,
        paidBy: String(form.paidBy).trim(),
        participants: validParticipantsList,
      };

      console.log("Saving split expense:", payload);

      await api.post("/split-expenses", payload);

      alert("Shared expense saved successfully!");
      setForm({
        description: "",
        totalAmount: "",
        date: new Date().toISOString().slice(0, 10),
        paidBy: "",
        participants: ["", ""],
        newParticipant: "",
      });
      fetchSplits();
    } catch (err) {
      console.error(err);
      alert("Error saving split expense");
    }
  };

  const summaryParticipants = Array.isArray(balanceData.participants) ? balanceData.participants : [];
  const simplifiedBalances = Array.isArray(balanceData.simplifiedBalances) ? balanceData.simplifiedBalances : [];
  const totalExpenses = Number(balanceData.totalExpenses) || 0;
  const totalAmount = Number(balanceData.totalAmount) || 0;

  const getSummary = (person) => individualSummaries[person] || { owes: 0, owed: 0, net: 0, status: "settled" };

  return (
    <div className="page">
      <h1>Split Expenses</h1>
      <p className="subtitle">
        Split bills and track who owes what - just like Splitwise.
      </p>

      <div className="balance-summary-section">
        <h2>Group Balances</h2>

        {summaryParticipants.length === 0 ? (
          <div className="info-box">
            <p>No expenses yet. Add your first shared expense below!</p>
          </div>
        ) : (
          <>
            <div className="balance-cards">
              {summaryParticipants.map((person) => {
                const summary = getSummary(person);
                return (
                  <div key={person} className={`balance-card balance-${summary.status}`}>
                    <h3>{person}</h3>
                    <div className="balance-amount">
                      {summary.net > 0 ? (
                        <span className="owed-amount">+{formatCurrency(summary.net)}</span>
                      ) : summary.net < 0 ? (
                        <span className="owes-amount">{formatCurrency(summary.net)}</span>
                      ) : (
                        <span className="settled-amount">0</span>
                      )}
                    </div>
                    <div className="balance-details">
                      <small>
                        Owes: {formatCurrency(summary.owes)} | Owed: {formatCurrency(summary.owed)}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>

            {simplifiedBalances.length > 0 && (
              <div className="settlement-section">
                <h3>💰 Settlement Summary</h3>
                <div className="settlement-list">
                  {simplifiedBalances.map((transaction, index) => (
                    <div key={index} className="settlement-item">
                      <span className="settlement-text">
                        <strong>{transaction.from}</strong> owes <strong>{transaction.to}</strong>
                      </span>
                      <span className="settlement-amount">{formatCurrency(transaction.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="group-stats">
              <div className="stat-item">
                <span className="stat-label">Total Expenses</span>
                <span className="stat-value">{totalExpenses}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Amount</span>
                <span className="stat-value">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Participants</span>
                <span className="stat-value">{summaryParticipants.length}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="split-form-section">
        <h2>Add Shared Expense</h2>

        <div className="form-grid">
          <div className="form-group full-width">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g., Dinner at restaurant, Movie tickets"
            />
          </div>

          <div className="form-group">
            <label>Total Amount ()</label>
            <input
              type="number"
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleChange}
              placeholder="e.g., 1200"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="participants-section">
          <h3>Participants</h3>

          <div className="participants-list">
            {safeParticipants.map((participant, index) => (
              <div key={index} className="participant-item">
                <input
                  type="text"
                  value={participant}
                  onChange={(e) => handleParticipantChange(index, e.target.value)}
                  placeholder={`Person ${index + 1}`}
                  className="participant-input"
                />
                {safeParticipants.length > 2 && (
                  <button
                    type="button"
                    className="remove-participant-btn"
                    onClick={() => removeParticipant(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="add-participant-row">
            <input
              type="text"
              value={form.newParticipant}
              onChange={(e) => setForm((prev) => ({ ...prev, newParticipant: e.target.value }))}
              placeholder="Add another person..."
              className="add-participant-input"
            />
            <button
              type="button"
              className="add-participant-btn"
              onClick={addParticipant}
              disabled={!form.newParticipant?.trim()}
            >
              + Add
            </button>
          </div>

          <div className="paid-by-section">
            <label>Who paid?</label>
            <select name="paidBy" value={form.paidBy} onChange={handleChange}>
              <option value="">Select who paid</option>
              {validParticipants.map((participant, index) => (
                <option key={index} value={participant}>
                  {participant}
                </option>
              ))}
            </select>
          </div>

          {shareAmount > 0 && (
            <div className="share-preview">
              <p>
                <strong>Each person pays:</strong> {formatCurrency(shareAmount)}
              </p>
              <small>
                Split equally among {shareCount} people
              </small>
            </div>
          )}
        </div>

        <button className="primary-button" onClick={handleSave}>
          Save Shared Expense
        </button>
      </div>

      <h2 style={{ marginTop: "2rem" }}>All Shared Expenses</h2>
      {splits.length === 0 ? (
        <p>No shared expenses yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Paid By</th>
              <th>Total Amount</th>
              <th>Participants</th>
              <th>Share per Person</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((s) => (
              <tr key={s._id || `${s.description}-${s.date}-${Math.random()}`}>
                <td>{s.date?.slice(0, 10) || "-"}</td>
                <td>{s.description || "-"}</td>
                <td>{s.paidBy || "-"}</td>
                <td>{formatCurrency(s.totalAmount || 0)}</td>
                <td>{Array.isArray(s.participants) ? s.participants.filter((p) => p?.trim()).join(", ") : "-"}</td>
                <td>{formatCurrency(s.sharePerPerson || s.sharePerStudent || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SplitView;
