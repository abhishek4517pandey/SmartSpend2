import React, { useState } from "react";
import Tesseract from "tesseract.js";
import api from "../api/axios";

const AddExpenseModal = ({ onClose }) => {
  const [form, setForm] = useState({
    amount: "",
    category: "Food & Dining",
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: "Cash",
    description: "",
    tags: ""
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [receiptError, setReceiptError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const parseReceiptText = (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const lower = text.toLowerCase();
    const keywordPattern = /(?:total(?: amount)?|grand total|amount due|amount payable|balance due|payable|net total|amount paid|total paid|subtotal|sale|bill total|invoice total|paid amount)/i;
    const excludedContext = /(?:volume|qty|quantity|litre|liter|kg|g|ml|oz|pcs|item|phone|tel|date|time|gst|tax|mrp|order|cashier|table|receipt)/i;
    // Improved regex to better capture decimal amounts (handles 876.76, 876,76, etc.)
    const amountRegex = /(?:rs\.?|inr|₹)?\s*(\d{1,3}(?:[,]\d{3})*(?:[.]\d{1,2})?|\d+[.]\d{1,2}|\d+)(?!\s*(?:l|litre|liter|kg|g|ml|oz|pcs|qty|x|item|no|#))/gi;

    const formatAmount = (num) => {
      if (num === null || num === undefined || Number.isNaN(num)) return "";
      return Number.isInteger(num) ? String(num) : num.toFixed(2);
    };

    const parseAmount = (raw) => {
      // Handle both comma and dot separators for decimals
      let normalized = raw.trim().replace(/,/g, ""); // Remove commas used for thousands
      // Handle European style (876,76) - convert comma to dot
      if (normalized.includes(",") && !normalized.includes(".")) {
        normalized = normalized.replace(",", ".");
      }
      const value = parseFloat(normalized);
      return Number.isFinite(value) && value > 0 ? value : null;
    };

    const isRealistic = (value) => value !== null && value >= 5 && value <= 1000000; // Increased max limit for Indian rupees

    const extractAmounts = (line) => {
      const results = [];
      let match;
      while ((match = amountRegex.exec(line)) !== null) {
        const value = parseAmount(match[1]);
        if (isRealistic(value)) {
          results.push({ value, raw: match[1] });
        }
      }
      return results;
    };

    const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const highlightDetectedAmount = (rawText, selectedRaw) => {
      if (!selectedRaw) return rawText;
      const escaped = escapeRegExp(selectedRaw);
      return rawText.replace(new RegExp(`\\b${escaped}\\b`, "g"), `>>${selectedRaw}<<`);
    };

    const chooseBestCandidate = (candidates) => {
      if (!candidates.length) return null;
      return candidates.reduce((max, current) => (current.value > max.value ? current : max), candidates[0]);
    };

    const keywordLines = lines.filter((line) => keywordPattern.test(line));
    const lineMatches = keywordLines.map((line) => ({
      line,
      amounts: extractAmounts(line)
    })).filter((entry) => entry.amounts.length > 0);

    console.log("OCR parser: keyword lines", lineMatches);

    if (lineMatches.length > 0) {
      const bestLine = lineMatches[0];
      const selected = chooseBestCandidate(bestLine.amounts);
      const highlighted = highlightDetectedAmount(text, selected.raw);
      console.log("OCR parser: selected keyword line amount", selected.value, "from line", bestLine.line);
      return {
        amount: formatAmount(selected.value),
        description: lines.find((l) => !excludedContext.test(l)) || "Receipt expense",
        paymentMethod: /upi|gpay|phonepe|paytm|bhim/.test(lower)
          ? "UPI/GPay"
          : /visa|mastercard|maestro|rupay|card|debit|credit/.test(lower)
          ? "Card"
          : /cash/.test(lower)
          ? "Cash"
          : "Other",
        debug: {
          allNumbers: lines.flatMap((line) => extractAmounts(line).map((item) => item.value)),
          selectedLine: bestLine.line,
          selectedRaw: selected.raw,
          highlightedText: highlighted
        }
      };
    }

    const allCandidates = lines
      .filter((line) => !excludedContext.test(line))
      .flatMap((line) => extractAmounts(line))
      .filter((item) => item.value !== null);

    const selectedFallback = allCandidates.length > 0 ? chooseBestCandidate(allCandidates) : null;
    console.log("OCR parser: fallback numbers", allCandidates.map((item) => item.value));

    const highlightedFallback = selectedFallback
      ? highlightDetectedAmount(text, selectedFallback.raw)
      : text;

    return {
      amount: selectedFallback ? formatAmount(selectedFallback.value) : "",
      description: lines.find((l) => !excludedContext.test(l)) || "Receipt expense",
      paymentMethod: /upi|gpay|phonepe|paytm|bhim/.test(lower)
        ? "UPI/GPay"
        : /visa|mastercard|maestro|rupay|card|debit|credit/.test(lower)
        ? "Card"
        : /cash/.test(lower)
        ? "Cash"
        : "Other",
      debug: {
        allNumbers: allCandidates.map((item) => item.value),
        selectedLine: selectedFallback ? lines.find((line) => line.includes(selectedFallback.raw)) : null,
        selectedRaw: selectedFallback ? selectedFallback.raw : null,
        highlightedText: highlightedFallback
      }
    };
  };
  const scanReceipt = async (file) => {
    setReceiptError("");
    setOcrText("");
    setOcrProgress(0);
    setIsScanning(true);

    try {
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (message?.progress != null) {
            setOcrProgress(Math.round(message.progress * 100));
          }
        }
      });
      const text = data.text || "";
      const parsed = parseReceiptText(text);
      console.log("Receipt parser debug:", parsed.debug);

      setOcrText(parsed.debug?.highlightedText || text);

      if (parsed.amount) {
        setForm((prev) => ({ ...prev, amount: parsed.amount }));
      }
      if (parsed.description) {
        setForm((prev) => ({ ...prev, description: parsed.description }));
      }
      if (parsed.paymentMethod) {
        setForm((prev) => ({ ...prev, paymentMethod: parsed.paymentMethod }));
      }
    } catch (err) {
      console.error("Receipt OCR error", err);
      setReceiptError(
        `Unable to scan receipt. ${err?.message ? err.message : "Try a clearer photo or a different image format."}`
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleReceiptChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceiptFile(file);
    await scanReceipt(file);
  };

  const handleSave = async () => {
    if (!form.amount || !form.category) {
      alert("Please enter amount and category");
      return;
    }
    try {
      await api.post("/expenses", {
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        paymentMethod: form.paymentMethod,
        description: form.description,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : []
      });
      window.dispatchEvent(new Event("expenseAdded"));
      alert("Expense saved");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error saving expense");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Expense</h2>

        <div className="form-group">
          <label>Upload Receipt</label>
          <div className="receipt-upload">
            <input type="file" accept="image/*" onChange={handleReceiptChange} />
            <span className="receipt-hint">Use a clear PNG/JPEG receipt photo with readable text for best results.</span>
            {receiptFile && (
              <div className="receipt-summary">
                <span>{receiptFile.name}</span>
                <span>{isScanning ? `Scanning: ${ocrProgress}%` : ocrText ? "Scan complete" : "Ready to scan"}</span>
              </div>
            )}
            {receiptError && <div className="error-text">{receiptError}</div>}
            {ocrText && <pre className="receipt-preview">{ocrText.trim().slice(0, 400)}</pre>}
          </div>
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g., 876.76"
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

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g., Lunch near college"
          />
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="friends, exam, birthday"
          />
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" onClick={handleSave}>
            Save Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
