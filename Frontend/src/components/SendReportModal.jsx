import React, { useState } from "react";
import api from "../api/axios";

const SendReportModal = ({ isOpen, onClose, onSuccess, expenses }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendReport = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      let payload = { period: "Current Expenses" };

      if (selectedPeriod === "custom" && customDateFrom && customDateTo) {
        payload = {
          period: `From ${customDateFrom} to ${customDateTo}`,
          dateFrom: customDateFrom,
          dateTo: customDateTo
        };
      } else if (selectedPeriod !== "current") {
        payload.period = selectedPeriod;
      }

      const response = await api.post("/emails/send-report", payload);

      setSuccessMessage(response.data.message || "Report sent successfully!");
      setTimeout(() => {
        onClose();
        onSuccess && onSuccess();
      }, 2000);
    } catch (err) {
      console.error("Error sending report:", err);
      setError(err.response?.data?.message || "Failed to send report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content send-report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📧 Send Expense Report</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Choose which period you'd like to send in your expense report:
          </p>

          <div className="period-options">
            <label className="radio-option">
              <input
                type="radio"
                name="period"
                value="current"
                checked={selectedPeriod === "current"}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
              <span>Current Expenses (All)</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="period"
                value="today"
                checked={selectedPeriod === "today"}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
              <span>Today's Expenses</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="period"
                value="last7"
                checked={selectedPeriod === "last7"}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
              <span>Last 7 Days</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="period"
                value="last30"
                checked={selectedPeriod === "last30"}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
              <span>Last 30 Days</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="period"
                value="month"
                checked={selectedPeriod === "month"}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
              <span>This Month</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="period"
                value="custom"
                checked={selectedPeriod === "custom"}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              />
              <span>Custom Date Range</span>
            </label>
          </div>

          {selectedPeriod === "custom" && (
            <div className="custom-date-range">
              <div className="date-input-group">
                <label htmlFor="dateFrom">From:</label>
                <input
                  type="date"
                  id="dateFrom"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="dateTo">To:</label>
                <input
                  type="date"
                  id="dateTo"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="date-input"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              <span>✅ {successMessage}</span>
            </div>
          )}

          <p className="modal-note">
            💡 The report will be sent to your registered email address with a summary of your expenses, category breakdown, and insights.
          </p>
        </div>

        <div className="modal-footer">
          <button
            className="secondary-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="primary-button"
            onClick={handleSendReport}
            disabled={loading || (selectedPeriod === "custom" && (!customDateFrom || !customDateTo))}
          >
            {loading ? "Sending..." : "Send Report"}
          </button>
        </div>
      </div>

      <style>{`
        .send-report-modal {
          max-width: 520px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(15, 23, 42, 0.18);
          background: white;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 16px;
          background: linear-gradient(135deg, #0ea5e9, #22d3ee);
          color: white;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 22px;
          letter-spacing: -0.02em;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 22px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .modal-description {
          color: #334155;
          margin: 0;
          font-size: 15px;
        }

        .period-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 12px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }

        .radio-option:hover {
          transform: translateY(-1px);
          border-color: #38bdf8;
          background: #eff6ff;
        }

        .radio-option input[type="radio"] {
          width: 20px;
          height: 20px;
          accent-color: #0284c7;
        }

        .radio-option span {
          font-size: 14px;
          color: #0f172a;
          font-weight: 500;
        }

        .radio-option input[type="radio"]:checked + span {
          color: #0369a1;
        }

        .custom-date-range {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 10px;
          padding: 18px;
          background: #f8fafc;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
        }

        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .date-input-group label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .date-input {
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          font-size: 14px;
          color: #0f172a;
          background: #f8fafc;
        }

        .date-input:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.16);
        }

        .modal-note {
          font-size: 14px;
          color: #475569;
          background: linear-gradient(180deg, rgba(236, 253, 245, 0.9), rgba(255, 255, 255, 0.9));
          padding: 16px;
          border-radius: 18px;
          border: 1px solid #d1fae5;
          line-height: 1.6;
        }

        .error-message {
          color: #991b1b;
          background: #fef2f2;
          padding: 12px 14px;
          border-radius: 14px;
          margin-bottom: 12px;
          font-size: 14px;
          border: 1px solid #fecaca;
        }

        .success-message {
          color: #166534;
          background: #dcfce7;
          padding: 12px 14px;
          border-radius: 14px;
          margin-bottom: 12px;
          font-size: 14px;
          border: 1px solid #bbf7d0;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          align-items: center;
          padding: 0 24px 20px;
        }

        .primary-button,
        .secondary-button {
          min-width: 130px;
          border-radius: 999px;
          padding: 12px 22px;
          font-weight: 700;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .primary-button {
          background: #0ea5e9;
          color: white;
          border: none;
        }

        .secondary-button {
          background: #f8fafc;
          color: #334155;
          border: 1px solid #cbd5e1;
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          opacity: 0.64;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default SendReportModal;
