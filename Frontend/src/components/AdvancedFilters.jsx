import React from "react";

const AdvancedFilters = ({
  filters,
  onFiltersChange,
  categories,
  paymentMethods,
}) => {
  const handleInputChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      dateFrom: "",
      dateTo: "",
      category: "",
      paymentMethod: "",
      minAmount: "",
      maxAmount: "",
      description: "",
    });
  };

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.category ||
    filters.paymentMethod ||
    filters.minAmount ||
    filters.maxAmount ||
    filters.description;

  return (
    <div className="advanced-filters-container">
      <div className="filters-header">
        <h3>Advanced Filters</h3>
        {hasActiveFilters && (
          <button className="reset-filters-btn" onClick={handleReset}>
            Reset All
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Date Range */}
        <div className="filter-item">
          <label>From Date</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleInputChange("dateFrom", e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-item">
          <label>To Date</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleInputChange("dateTo", e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Category */}
        <div className="filter-item">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="filter-input"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="filter-item">
          <label>Payment Method</label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
            className="filter-input"
          >
            <option value="">All Methods</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Range */}
        <div className="filter-item">
          <label>Min Amount (₹)</label>
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => handleInputChange("minAmount", e.target.value)}
            placeholder="0"
            className="filter-input"
            min="0"
          />
        </div>

        <div className="filter-item">
          <label>Max Amount (₹)</label>
          <input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => handleInputChange("maxAmount", e.target.value)}
            placeholder="999999"
            className="filter-input"
            min="0"
          />
        </div>

        {/* Search Description */}
        <div className="filter-item filter-item-full">
          <label>Search Description</label>
          <input
            type="text"
            value={filters.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Search by description..."
            className="filter-input"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filters-summary">
          <span className="filters-active-count">
            {Object.values(filters).filter((v) => v !== "").length} filter
            {Object.values(filters).filter((v) => v !== "").length === 1
              ? ""
              : "s"}{" "}
            applied
          </span>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
