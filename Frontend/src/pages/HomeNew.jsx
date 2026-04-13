import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/HomeNew.css";

const HomeNew = () => {
  const { user } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation variants - SIMPLIFIED to prevent jarring transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Mock data for demo
  const summaryCards = [
    { label: "Total Balance", value: "₹45,280", icon: "💰", color: "#22c55e", growthPercent: 12.5 },
    { label: "Monthly Income", value: "₹32,400", icon: "📈", color: "#3b82f6", growthPercent: 8.2 },
    { label: "Total Expense", value: "₹18,720", icon: "📉", color: "#ff6b6b", growthPercent: -3.5 },
    { label: "Savings Goal", value: "₹25,680", icon: "🎯", color: "#fbbf24", growthPercent: 15.3 }
  ];

  const recentTransactions = [
    { id: 1, name: "Grocery Shopping", amount: "₹1,250", category: "Food", time: "2 hours ago", icon: "🛒", color: "#FF6B6B" },
    { id: 2, name: "Electricity Bill", amount: "₹2,100", category: "Utilities", time: "5 hours ago", icon: "⚡", color: "#3B82F6" },
    { id: 3, name: "Uber Ride", amount: "₹320", category: "Transport", time: "1 day ago", icon: "🚗", color: "#4ECDC4" },
    { id: 4, name: "Netflix Subscription", amount: "₹649", category: "Entertainment", time: "3 days ago", icon: "🎬", color: "#A78BFA" },
    { id: 5, name: "Restaurant Dinner", amount: "₹1,850", category: "Food", time: "5 days ago", icon: "🍽️", color: "#FB923C" }
  ];

  const savingGoals = [
    { id: 1, name: "Vacation Fund", current: 35000, target: 100000, icon: "✈️", color: "#3B82F6" },
    { id: 2, name: "New Laptop", current: 62000, target: 150000, icon: "💻", color: "#8B5CF6" },
    { id: 3, name: "Emergency Fund", current: 85000, target: 100000, icon: "🚨", color: "#EF4444" }
  ];

  const insightMessages = [
    "You spent 20% more on dining out this month 🍽️",
    "Your savings rate improved by 5% compared to last month! 🎉",
    "You're on track to exceed your savings goal 🚀",
    "Budget alert: Food expenses are 15% above average 📊"
  ];

  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInsightIndex((prev) => (prev + 1) % insightMessages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-new">
      {/* Animated background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* HERO SECTION */}
      <motion.section
        className="hero-premium"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="hero-content" variants={slideVariants}>
          <motion.h1 className="hero-title text-gray-800 dark:text-white" variants={itemVariants}>
            Take Control of{" "}
            <span className="gradient-text">Your Money</span>
          </motion.h1>

          <motion.p className="hero-subtitle text-gray-700 dark:text-gray-200" variants={itemVariants}>
            Smart expense tracking with AI insights, beautiful dashboards, and real-time budget control. Your finances, simplified.
          </motion.p>

          <motion.div className="hero-buttons" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Link to={user ? "/dashboard" : "/register"} className="btn-accent btn-lg text-blue-500 dark:text-blue-400 font-semibold underline hover:text-blue-300">
                <span>Get Started</span>
                <span className="btn-icon text-blue-500 dark:text-blue-400">→</span>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link to="/login" className="btn-secondary btn-lg">
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="hero-trust-badges" variants={containerVariants}>
            <motion.div className="badge" variants={itemVariants}>
              ✓ 1.2k+ active users
            </motion.div>
            <motion.div className="badge" variants={itemVariants}>
              ✓ AI-powered insights
            </motion.div>
            <motion.div className="badge" variants={itemVariants}>
              ✓ Bank-level security
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" variants={scaleVariants}>
          <div className="floating-card card-top">
            <div className="card-header">
              <div className="card-dot"></div>
              <div className="card-dot"></div>
              <div className="card-dot"></div>
            </div>
            <div className="card-content">
              <p className="card-label">Today's Spending</p>
              <h3 className="card-amount">₹4,280</h3>
            </div>
          </div>

          <div className="floating-card card-middle">
            <div className="chart-preview">
              <div className="chart-bar" style={{ height: "60%" }}></div>
              <div className="chart-bar" style={{ height: "40%" }}></div>
              <div className="chart-bar" style={{ height: "75%" }}></div>
              <div className="chart-bar" style={{ height: "50%" }}></div>
              <div className="chart-bar" style={{ height: "65%" }}></div>
            </div>
          </div>

          <div className="floating-card card-bottom">
            <div className="stat-row">
              <div className="stat-item">
                <span className="stat-icon">📈</span>
                <div>
                  <p className="stat-label">Income</p>
                  <p className="stat-value">₹32,400</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📊</span>
                <div>
                  <p className="stat-label">Saved</p>
                  <p className="stat-value">₹13,680</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* SUMMARY CARDS SECTION */}
      <motion.section
        className="summary-section"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Your Financial Overview</h2>
          <p>Real-time insights into your money</p>
        </motion.div>

        <motion.div className="summary-grid" variants={containerVariants}>
          {summaryCards.map((card, idx) => (
            <motion.div
              key={idx}
              className="summary-card-item"
              variants={scaleVariants}
              whileHover={{ y: -8 }}
            >
              <div className="card-bg" style={{ background: `linear-gradient(135deg, ${card.color}15, ${card.color}08)` }}></div>

              <div className="card-header-summary">
                <span className="card-icon">{card.icon}</span>
                <span className="growth-badge" style={{ color: card.growthPercent > 0 ? "#22c55e" : "#ff6b6b" }}>
                  {card.growthPercent > 0 ? "+" : ""}{card.growthPercent}%
                </span>
              </div>

              <p className="card-label-summary">{card.label}</p>
              <h3 className="card-value">{card.value}</h3>
              <p className="card-subtext">vs last month</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CHARTS SECTION - Expense & Trends */}
      <motion.section
        className="charts-section"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Spending Insights</h2>
          <p>Visualize where your money goes</p>
        </motion.div>

        <div className="charts-grid">
          {/* Donut Chart */}
          <motion.div className="chart-container" variants={scaleVariants}>
            <h3>Category Breakdown</h3>
            <div className="donut-chart">
              <svg viewBox="0 0 200 200" className="donut-svg">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#FF6B6B" strokeWidth="30" strokeDasharray="141.3 360" strokeLinecap="round" className="donut-segment segment-1" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#3B82F6" strokeWidth="30" strokeDasharray="113 360" strokeLinecap="round" className="donut-segment segment-2" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#22c55e" strokeWidth="30" strokeDasharray="85.5 360" strokeLinecap="round" className="donut-segment segment-3" />
                <circle cx="100" cy="100" r="90" fill="none" stroke="#FBbf24" strokeWidth="30" strokeDasharray="56.7 360" strokeLinecap="round" className="donut-segment segment-4" />
              </svg>
              <div className="donut-center">
                <p className="donut-value">100%</p>
                <p className="donut-label">Total</p>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#FF6B6B" }}></span>
                Food & Dining
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#3B82F6" }}></span>
                Shopping
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#22c55e" }}></span>
                Travel
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#FBbf24" }}></span>
                Others
              </div>
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div className="chart-container" variants={scaleVariants}>
            <h3>Monthly Trend</h3>
            <div className="line-chart">
              <svg viewBox="0 0 400 250" className="trend-svg" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                
                {/* Income line */}
                <polyline points="20,180 70,120 120,140 170,90 220,80 270,110 320,70 370,85" fill="none" stroke="#22c55e" strokeWidth="3" className="trend-line income-line" />
                
                {/* Expense line */}
                <polyline points="20,210 70,160 120,170 170,140 220,130 270,160 320,120 370,135" fill="none" stroke="#ff6b6b" strokeWidth="3" className="trend-line expense-line" />

                {/* Interactive dots */}
                <circle cx="370" cy="85" r="5" fill="#22c55e" className="dot income-dot" />
                <circle cx="370" cy="135" r="5" fill="#ff6b6b" className="dot expense-dot" />
              </svg>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#22c55e" }}></span>
                Income
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: "#ff6b6b" }}></span>
                Expense
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SAVING GOALS SECTION */}
      <motion.section
        className="goals-section"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Your Saving Goals</h2>
          <p>Track progress towards your dreams</p>
        </motion.div>

        <motion.div className="goals-grid" variants={containerVariants}>
          {savingGoals.map((goal, idx) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <motion.div
                key={idx}
                className="goal-card"
                variants={slideVariants}
                whileHover={{ y: -6 }}
              >
                <div className="goal-header">
                  <span className="goal-icon">{goal.icon}</span>
                  <h3>{goal.name}</h3>
                </div>

                <div className="goal-progress">
                  <div className="progress-bar-bg">
                    <motion.div
                      className="progress-bar-fill"
                      style={{ background: `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                    ></motion.div>
                  </div>
                  <p className="progress-text">{Math.round(progress)}% complete</p>
                </div>

                <div className="goal-stats">
                  <div className="stat">
                    <span className="stat-label">Saved</span>
                    <span className="stat-amount">₹{goal.current.toLocaleString()}</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat">
                    <span className="stat-label">Target</span>
                    <span className="stat-amount">₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* RECENT TRANSACTIONS */}
      <motion.section
        className="transactions-section"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Recent Transactions</h2>
          <p>Your latest activity</p>
        </motion.div>

        <motion.div className="transactions-list" variants={containerVariants}>
          {recentTransactions.map((tx, idx) => (
            <motion.div
              key={idx}
              className="transaction-item"
              variants={slideVariants}
              whileHover={{ x: 8 }}
            >
              <div className="tx-icon-bg" style={{ backgroundColor: `${tx.color}15` }}>
                <span className="tx-icon">{tx.icon}</span>
              </div>

              <div className="tx-details">
                <p className="tx-name">{tx.name}</p>
                <p className="tx-category">{tx.category}</p>
              </div>

              <div className="tx-time">
                <p className="tx-amount">₹{tx.amount.split("₹")[1]}</p>
                <p className="tx-time-text">{tx.time}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* AI INSIGHTS SECTION */}
      <motion.section
        className="insights-section"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="insight-card" variants={scaleVariants}>
          <div className="insight-header">
            <span className="insight-icon">🤖</span>
            <h3>AI Money Assistant</h3>
          </div>

          <motion.div
            className="insight-message"
            key={currentInsightIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <p>{insightMessages[currentInsightIndex]}</p>
            <div className="message-dots">
              {insightMessages.map((_, idx) => (
                <motion.span
                  key={idx}
                  className={`dot ${idx === currentInsightIndex ? "active" : ""}`}
                  animate={{ scale: idx === currentInsightIndex ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              ))}
            </div>
          </motion.div>

          <div className="insight-features">
            <div className="feature-badge">💡 Smart advice</div>
            <div className="feature-badge">📊 Real-time alerts</div>
            <div className="feature-badge">🎯 Goal tracking</div>
          </div>
        </motion.div>
      </motion.section>

      {/* FINAL CTA SECTION */}
      <motion.section
        className="cta-final-section"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="cta-content" variants={containerVariants}>
          <motion.h2 variants={itemVariants}>Ready to master your finances?</motion.h2>
          <motion.p variants={itemVariants}>
            Join thousands of users who are taking control of their money with SmartSpend.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link to={user ? "/dashboard" : "/register"} className="btn-accent btn-large text-blue-500 dark:text-blue-400 font-semibold underline hover:text-blue-300">
              <span>Start Your Journey</span>
              <span className="btn-arrow text-blue-500 dark:text-blue-400">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomeNew;
