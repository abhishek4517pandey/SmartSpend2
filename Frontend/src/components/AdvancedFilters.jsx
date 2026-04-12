import React, { useState, useEffect } from "react";
import "../styles/AdvancedFiltersModal.css";

const AdvancedFilters = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  categories,
  paymentMethods,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field, value) => {
    setLocalFilters({
      ...localFilters,
      [field]: value,
    });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      dateFrom: "",
      dateTo: "",
      category: "",
      paymentMethod: "",
      minAmount: "",
      maxAmount: "",
      description: "",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFiltersCount = Object.values(localFilters).filter(
    (v) => v !== ""
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="filters-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="filters-modal">
        {/* Header */}
        <div className="filters-modal-header">
          <div className="header-title">
            <h2>🎯 Advanced Filters</h2>
            {hasActiveFilters && (
              <span className="badge-count-header">{activeFiltersCount} active</span>
            )}
          </div>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="filters-modal-content">
          {/* Date Range Section */}
          <div className="filter-section">
            <div className="section-header">
              <span className="section-icon">📅</span>
              <h3>Date Range</h3>
            </div>
            <div className="filter-grid-2">
              <div className="filter-item">
                <label>From Date</label>
                <input
                  type="date"
                  value={localFilters.dateFrom}
                  onChange={(e) =>
                    handleInputChange("dateFrom", e.target.value)
                  }
                  className="filter-input"
                />
              </div>

              <div className="filter-item">
                <label>To Date</label>
                <input
                  type="date"
                  value={localFilters.dateTo}
                  onChange={(e) => handleInputChange("dateTo", e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div className="filter-section">
            <div className="section-header">
              <span className="section-icon">📂</span>
              <h3>Category</h3>
            </div>
            <select
              value={localFilters.category}
              onChange={(e) =>
                handleInputChange("category", e.target.value)
              }
              className="filter-select-large"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Section */}
          <div className="filter-section">
            <div className="section-header">
              <span className="section-icon">💳</span>
              <h3>Payment Method</h3>
            </div>
            <div className="payment-buttons">
              {["All", ...paymentMethods].map((method) => (
                <button
                  key={method}
                  className={`payment-btn ${
                    (method === "All" && !localFilters.paymentMethod) ||
                    localFilters.paymentMethod === method
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleInputChange(
                      "paymentMethod",
                      method === "All" ? "" : method
                    )
                  }
                >
                  {method === "Cash" && "💰"}
                  {method === "UPI/GPay" && "📱"}
                  {method === "Card" && "💳"}
                  {method === "Other" && "🔄"}
                  {method === "All" && "✓"}
                  <span>{method}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Range Section */}
          <div className="filter-section">
            <div className="section-header">
              <span className="section-icon">💰</span>
              <h3>Amount Range</h3>
            </div>
            <div className="filter-grid-2">
              <div className="filter-item">
                <label>Min Amount (₹)</label>
                <div className="input-with-currency">
                  <span className="currency">₹</span>
                  <input
                    type="number"
                    value={localFilters.minAmount}
                    onChange={(e) =>
                      handleInputChange("minAmount", e.target.value)
                    }
                    placeholder="0"
                    className="filter-input"
                    min="0"
                  />
                </div>
              </div>

              <div className="filter-item">
                <label>Max Amount (₹)</label>
                <div className="input-with-currency">
                  <span className="currency">₹</span>
                  <input
                    type="number"
                    value={localFilters.maxAmount}
                    onChange={(e) =>
                      handleInputChange("maxAmount", e.target.value)
                    }
                    placeholder="999999"
                    className="filter-input"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="filter-section">
            <div className="section-header">
              <span className="section-icon">🔍</span>
              <h3>Search Description</h3>
            </div>
            <input
              type="text"
              value={localFilters.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
              placeholder="Search by description..."
              className="filter-input-large"
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="active-filters-display">
              <div className="filters-label">Active Filters:</div>
              <div className="filter-tags">
                {localFilters.dateFrom && (
                  <div className="filter-tag">
                    📅 From: {localFilters.dateFrom}
                    <button
                      onClick={() => handleInputChange("dateFrom", "")}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {localFilters.dateTo && (
                  <div className="filter-tag">
                    📅 To: {localFilters.dateTo}
                    <button
                      onClick={() => handleInputChange("dateTo", "")}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {localFilters.category && (
                  <div className="filter-tag">
                    📂 {localFilters.category}
                    <button
                      onClick={() => handleInputChange("category", "")}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {localFilters.paymentMethod && (
                  <div className="filter-tag">
                    💳 {localFilters.paymentMethod}
                    <button
                      onClick={() => handleInputChange("paymentMethod", "")}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {localFilters.minAmount && (
                  <div className="filter-tag">
                    ₹ Min: {localFilters.minAmount}
                    <button
                      onClick={() => handleInputChange("minAmount", "")}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {localFilters.maxAmount && (
                  <div className="filter-tag">
                    ₹ Max: {localFilters.maxAmount}
                    <button
                      onClick={() => handleInputChange("maxAmount", "")}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {localFilters.description && (
                  <div className="filter-tag">
                    🔍 {localFilters.description}
                    <button
                      onClick={() => handleInputChange("description", "")}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="filters-modal-footer">
          {hasActiveFilters && (
            <button className="btn-reset" onClick={handleReset}>
              🔄 Reset All
            </button>
          )}
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-apply" onClick={handleApplyFilters}>
            ✓ Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvancedFilters;
