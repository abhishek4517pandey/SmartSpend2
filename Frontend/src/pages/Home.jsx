import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const featureCards = [
  {
    title: "Instant expense tracking",
    description: "Add and categorize your spending with one click and stay clear on where money goes.",
    icon: "💸"
  },
  {
    title: "Smart budgets & alerts",
    description: "Set monthly goals, monitor progress, and receive visual alerts before you overspend.",
    icon: "📊"
  },
  {
    title: "Export financial reports",
    description: "Download PDF reports for any date range with clean filters and professional formatting.",
    icon: "📄"
  }
];

const workflowSteps = [
  {
    number: "1",
    title: "Log your expenses",
    description: "Add new transactions simply and track every rupee across categories."
  },
  {
    number: "2",
    title: "Set your budget",
    description: "Create monthly limits and compare your actual spending instantly."
  },
  {
    number: "3",
    title: "Download reports",
    description: "Export filtered spending summaries as PDF for accounting or planning."
  }
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Expense Tracking Reimagined</span>
          <h1>
            Keep every rupee in check with a modern, intuitive finance dashboard.
          </h1>
          <p className="hero-description">
            SmartSpend gives you clean expense reports, budget control, split payments, and PDF exports—all wrapped in a beautiful interface.
          </p>

          <div className="hero-actions">
            <Link to={user ? "/dashboard" : "/register"} className="primary-button hero-cta">
              Start tracking for free
            </Link>
            <Link to="/login" className="secondary-button hero-secondary">
              Log in to your account
            </Link>
          </div>

          <div className="hero-trust-row">
            <div className="trust-pill">Trusted by 1.2k+ users</div>
            <div className="trust-pill">AI chat help built in</div>
            <div className="trust-pill">Instant PDF exports</div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="visual-topbar">
              <span className="visual-dot dot-red" />
              <span className="visual-dot dot-yellow" />
              <span className="visual-dot dot-green" />
            </div>
            <div className="visual-balance">
              <div>
                <p>Today</p>
                <h2>₹ 4,280</h2>
              </div>
              <span className="status-pill">Safe</span>
            </div>

            <div className="visual-chart">
              <div className="chart-bar high" />
              <div className="chart-bar medium" />
              <div className="chart-bar low" />
              <div className="chart-bar medium-light" />
              <div className="chart-bar high-light" />
            </div>

            <div className="visual-stats">
              <div>
                <span>Income</span>
                <strong>₹ 32,400</strong>
              </div>
              <div>
                <span>Expense</span>
                <strong>₹ 18,720</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-title">Ease of use</span>
            <h3>Fast setup</h3>
            <p>Go from signup to your first expense in less than a minute.</p>
          </div>
          <div className="stat-card">
            <span className="stat-title">Powerful insights</span>
            <h3>Smart summaries</h3>
            <p>Track spending by category, time, and payment method instantly.</p>
          </div>
          <div className="stat-card">
            <span className="stat-title">Professional reports</span>
            <h3>PDF export</h3>
            <p>Download clean reports for accounting, sharing, or review.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Feature spotlight</p>
            <h2>Designed for modern money management</h2>
          </div>
          <p className="section-copy">
            From daily expense entry to budget tracking and split expense collaboration, SmartSpend delivers a complete finance experience.
          </p>
        </div>
        <div className="features-grid">
          {featureCards.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">How it works</p>
            <h2>Track smarter with three simple steps</h2>
          </div>
          <p className="section-copy">
            Every step is built around clarity, speed, and control so your finances feel easier, not harder.
          </p>
        </div>

        <div className="workflow-grid">
          {workflowSteps.map((step) => (
            <div key={step.number} className="workflow-card">
              <div className="workflow-badge">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bottom-cta-section">
        <div className="bottom-cta-card">
          <div>
            <p className="eyebrow">Ready to take control?</p>
            <h2>Start your expense journey today</h2>
          </div>
          <Link to={user ? "/dashboard" : "/register"} className="primary-button hero-cta">
            Create account now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
