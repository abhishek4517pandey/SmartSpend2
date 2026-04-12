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
    participants: [{ name: "", email: "" }, { name: "", email: "" }],
    newParticipant: { name: "", email: "" },
  });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, person: null, amount: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, person: null, email: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, splitId: null, splitDesc: "" });
  const [participantsData, setParticipantsData] = useState({});

  const fetchSplits = async () => {
    try {
      const res = await api.get("/split-expenses");
      setSplits(Array.isArray(res.data) ? res.data : []);
      
      const participantMap = {};
      res.data?.forEach(split => {
        if (Array.isArray(split.participantsData)) {
          split.participantsData.forEach(p => {
            participantMap[p.name] = p.email;
          });
        }
      });
      setParticipantsData(participantMap);
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
  const validParticipants = safeParticipants.filter((p) => p?.name?.trim()).map(p => p.name);
  const shareCount = validParticipants.length;
  const shareAmount = shareCount > 0 && Number(form.totalAmount) > 0
    ? Number(form.totalAmount) / shareCount
    : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (index, field, value) => {
    setForm((prev) => {
      const participants = Array.isArray(prev.participants) ? [...prev.participants] : [];
      if (participants[index]) {
        participants[index][field] = value;
      }
      return { ...prev, participants };
    });
  };

  const addParticipant = () => {
    if (form.newParticipant?.name?.trim() && form.newParticipant?.email?.trim()) {
      setForm((prev) => {
        const participants = Array.isArray(prev.participants) ? [...prev.participants] : [];
        return {
          ...prev,
          participants: [...participants, { ...form.newParticipant }],
          newParticipant: { name: "", email: "" },
        };
      });
    }
  };

  const removeParticipant = (index) => {
    setForm((prev) => {
      const participants = Array.isArray(prev.participants) ? prev.participants.filter((_, i) => i !== index) : [];
      const removedName = Array.isArray(prev.participants) ? prev.participants[index]?.name : "";
      return {
        ...prev,
        participants,
        paidBy: prev.paidBy === removedName ? "" : prev.paidBy,
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
      const participantsData = safeParticipants.filter(p => p?.name?.trim());
      const payload = {
        description: form.description.trim(),
        totalAmount,
        date: form.date,
        paidBy: String(form.paidBy).trim(),
        participants: validParticipantsList,
        participantsData: participantsData,
      };

      console.log("Saving split expense:", payload);

      await api.post("/split-expenses", payload);

      alert("Shared expense saved successfully!");
      setForm({
        description: "",
        totalAmount: "",
        date: new Date().toISOString().slice(0, 10),
        paidBy: "",
        participants: [{ name: "", email: "" }, { name: "", email: "" }],
        newParticipant: { name: "", email: "" },
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

  const openPaymentModal = (person, owedAmount) => {
    setPaymentModal({ isOpen: true, person, amount: "", owedAmount });
  };

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, person: null, amount: "", owedAmount: 0 });
  };

  const handlePayment = async () => {
    const paidAmount = Number(paymentModal.amount);
    if (isNaN(paidAmount) || paidAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      // Find the split where the person owes money
      // Typically, the person owes to the one who paid
      const relevantSplits = splits.filter(s => 
        s.participants.includes(paymentModal.person) && s.participants.length > 0
      );

      if (relevantSplits.length === 0) {
        alert("No splits found for this person");
        return;
      }

      // Record payment in the first relevant split
      const splitId = relevantSplits[0]._id;
      const paidByPerson = relevantSplits[0].paidBy;

      await api.post(`/split-expenses/${splitId}/payment`, {
        from: paymentModal.person,
        to: paidByPerson,
        amount: paidAmount
      });

      alert(`Payment of ${formatCurrency(paidAmount)} recorded successfully!`);
      closePaymentModal();
      fetchSplits(); // Refresh data to update balances
    } catch (err) {
      console.error(err);
      alert("Error recording payment: " + (err.response?.data?.message || err.message));
    }
  };

  const openNotifyModal = (person) => {
    const email = participantsData[person] || "";
    const summary = getSummary(person);
    setNotifyModal({ isOpen: true, person, email, summary });
  };

  const closeNotifyModal = () => {
    setNotifyModal({ isOpen: false, person: null, email: "", summary: null });
  };

  const openDeleteModal = (splitId, splitDesc) => {
    setDeleteModal({ isOpen: true, splitId, splitDesc });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, splitId: null, splitDesc: "" });
  };

  const handleDeleteSplit = async () => {
    if (!deleteModal.splitId) return;

    try {
      await api.delete(`/split-expenses/${deleteModal.splitId}`);
      alert(`Split expense "${deleteModal.splitDesc}" deleted successfully!`);
      closeDeleteModal();
      fetchSplits();
    } catch (err) {
      console.error(err);
      alert("Error deleting split expense");
    }
  };

  const handleSendNotification = async () => {
    if (!notifyModal.email?.trim()) {
      alert("Email address not found for this person");
      return;
    }

    try {
      const summary = getSummary(notifyModal.person);
      const payload = {
        personName: notifyModal.person,
        email: notifyModal.email,
        owedAmount: Math.abs(summary.owes),
        oweAmount: Math.abs(summary.owed),
        net: summary.net,
        status: summary.status,
      };

      await api.post("/emails/send-split-notification", payload);
      alert(`Notification sent to ${notifyModal.email}!`);
      closeNotifyModal();
    } catch (err) {
      console.error(err);
      alert("Error sending notification");
    }
  };

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
                const email = participantsData[person] || "No email";
                return (
                  <div key={person} className={`balance-card balance-${summary.status} interactive-card`}>
                    <div className="card-header">
                      <h3 className="person-name">{person}</h3>
                      <span className="email-tag">{email}</span>
                    </div>
                    
                    <div className="balance-amount">
                      {summary.net > 0 ? (
                        <span className="owed-amount">➕ {formatCurrency(summary.net)}</span>
                      ) : summary.net < 0 ? (
                        <span className="owes-amount">➖ {formatCurrency(Math.abs(summary.net))}</span>
                      ) : (
                        <span className="settled-amount">✓ Settled</span>
                      )}
                    </div>
                    
                    <div className="balance-details">
                      <small>
                        Owes: {formatCurrency(summary.owes)} | Owed: {formatCurrency(summary.owed)}
                      </small>
                    </div>

                    <div className="card-actions">
                      {summary.net < 0 && (
                        <button 
                          className="action-btn paid-btn"
                          onClick={() => openPaymentModal(person, Math.abs(summary.net))}
                          title="Mark amount as paid"
                        >
                          💳 Mark Paid
                        </button>
                      )}
                      <button 
                        className="action-btn notify-btn"
                        onClick={() => openNotifyModal(person)}
                        title="Send notification email"
                      >
                        📧 Notify
                      </button>
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
          <h3>👥 Participants</h3>

          <div className="participants-list">
            {safeParticipants.map((participant, index) => (
              <div key={index} className="participant-item participant-with-email">
                <div className="participant-inputs">
                  <input
                    type="text"
                    value={participant?.name || ""}
                    onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                    placeholder={`Person ${index + 1}`}
                    className="participant-input name-input"
                  />
                  <input
                    type="email"
                    value={participant?.email || ""}
                    onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                    placeholder="Email address"
                    className="participant-input email-input"
                  />
                </div>
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
            <div className="add-participant-inputs">
              <input
                type="text"
                value={form.newParticipant?.name || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, newParticipant: { ...prev.newParticipant, name: e.target.value } }))}
                placeholder="Person name..."
                className="add-participant-input name-input"
              />
              <input
                type="email"
                value={form.newParticipant?.email || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, newParticipant: { ...prev.newParticipant, email: e.target.value } }))}
                placeholder="Email address..."
                className="add-participant-input email-input"
              />
            </div>
            <button
              type="button"
              className="add-participant-btn"
              onClick={addParticipant}
              disabled={!form.newParticipant?.name?.trim() || !form.newParticipant?.email?.trim()}
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
              <th>Actions</th>
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
                <td>
                  <button 
                    className="delete-split-btn"
                    onClick={() => openDeleteModal(s._id, s.description)}
                    title="Delete this split"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {paymentModal.isOpen && (
        <div className="modal-overlay" onClick={closePaymentModal}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💳 Mark Payment</h2>
              <button className="close-btn" onClick={closePaymentModal}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-subtitle">{paymentModal.person} owes:</p>
              <p className="big-amount">{formatCurrency(paymentModal.owedAmount)}</p>
              
              <div className="form-group">
                <label>Amount Paid:</label>
                <div className="amount-input-group">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    value={paymentModal.amount}
                    onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                    placeholder="Enter amount paid"
                    min="0"
                    className="amount-input"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closePaymentModal}>Cancel</button>
              <button className="btn-confirm" onClick={handlePayment}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}

      {notifyModal.isOpen && (
        <div className="modal-overlay" onClick={closeNotifyModal}>
          <div className="modal-content notify-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📧 Send Notification</h2>
              <button className="close-btn" onClick={closeNotifyModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="person-info-section">
                <h3>{notifyModal.person}</h3>
                <p className="email-display">✉️ {notifyModal.email}</p>
              </div>

              <div className="balance-info-section">
                <div className="info-row owes">
                  <span className="label">Owes:</span>
                  <span className="value">{formatCurrency(notifyModal.summary?.owes || 0)}</span>
                </div>
                <div className="info-row owed">
                  <span className="label">Owed:</span>
                  <span className="value">{formatCurrency(notifyModal.summary?.owed || 0)}</span>
                </div>
              </div>

              <p className="notification-info">
                A notification email will be sent to {notifyModal.person} with their balance details.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeNotifyModal}>Cancel</button>
              <button className="btn-send" onClick={handleSendNotification}>Send Notification</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
              <h2>🗑️ Delete Split</h2>
              <button className="close-btn" onClick={closeDeleteModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                Are you sure you want to delete this shared expense?
              </p>
              <div style={{ 
                background: "var(--bg-tertiary)", 
                padding: "1rem", 
                borderRadius: "0.75rem", 
                border: "1px solid var(--border-color)",
                marginBottom: "1.5rem"
              }}>
                <p style={{ margin: "0.5rem 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  <strong>Description:</strong> {deleteModal.splitDesc}
                </p>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                This action cannot be undone. All participants' balances will be recalculated.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeDeleteModal}>Cancel</button>
              <button 
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.6rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "none";
                }}
                onClick={handleDeleteSplit}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitView;
