import React, { useEffect, useRef, useState } from "react";

const initialMessages = [
  {
    sender: "bot",
    text: "Hi there! I'm your SmartSpend assistant. Ask me about budgets, expenses, reports, profile settings, or how to use the website."
  }
];

const responseRules = [
  {
    keywords: ["budget", "save", "saving", "spending limit", "monthly budget"],
    reply:
      "To manage budgets, use the Budget page to set monthly and category limits. Track your actual spending in the Expenses page and adjust your budget when needed."
  },
  {
    keywords: ["expense", "expenses", "add expense", "delete expense", "edit expense"],
    reply:
      "Use the Expenses page to add, edit, and delete entries. I can also help you download filtered expense history in PDF format."
  },
  {
    keywords: ["download", "pdf", "report", "export"],
    reply:
      "The Expenses page has a download button and filter options. Choose the time range and click Download PDF to export clean history."
  },
  {
    keywords: ["profile", "name", "email", "phone", "college", "course"],
    reply:
      "Update your profile details on the Profile page. Your name and contact info are saved there for a polished experience."
  },
  {
    keywords: ["split", "split view", "shared expense", "split expense"],
    reply:
      "Use the Split View page to log shared expenses and compare who owes what. It works like a simple splitwise for student spending."
  },
  {
    keywords: ["dark", "light", "theme", "mode"],
    reply:
      "Use the theme button in the top navigation to switch between Dark and Light mode instantly. The app will remember your selection on the next visit."
  },
  {
    keywords: ["finance", "money", "saving tips", "investment", "debt"],
    reply:
      "For strong finances, track all your expenses, set monthly budgets, and review your spending categories weekly. Prioritize needs before wants."
  },
  {
    keywords: ["website", "site", "smartspend", "app", "navigation"],
    reply:
      "SmartSpend helps you track daily expenses, set budgets, manage split bills, and export PDF reports, all from one responsive dashboard."
  }
];

const generateBotReply = (message) => {
  const normalized = message.toLowerCase();
  for (const rule of responseRules) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.reply;
    }
  }

  return (
    "I can help with SmartSpend features like budgets, expense tracking, downloads, profile setup, and split expenses. " +
    "Please ask me about one of those topics."
  );
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: generateBotReply(trimmed)
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 300);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`chatbot ${open ? "chatbot-open" : ""}`}>
      <button
        className="chatbot-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-label="Toggle chat assistant"
      >
        <span>💬</span>
        <span>Help</span>
      </button>

      <div className="chatbot-panel">
        <div className="chatbot-header">
          <div>
            <p className="chatbot-title">SmartSpend Assistant</p>
            <p className="chatbot-subtitle">Ask me anything about your finances or the app.</p>
          </div>
          <button className="chatbot-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={`chatbot-message ${message.sender}`}
            >
              <div className="chatbot-bubble">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about budgets, expenses, downloads..."
            aria-label="Chat message"
          />
          <button className="chatbot-send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
