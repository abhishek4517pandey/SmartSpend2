import React, { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/StreakComponent.css";

const StreakComponent = () => {
  const { user } = useContext(AuthContext);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStreakData();
  }, [user]);

  const fetchStreakData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/expenses/streak/data");
      setStreakData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching streak data:", err);
      setError("Failed to load streak data");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <div className="streak-container">Loading streak...</div>;
  }

  if (error || !streakData) {
    return (
      <div className="streak-container">
        <div className="streak-error">{error || "No streak data"}</div>
      </div>
    );
  }

  // Get today's day of week (M, T, W, T, F, S, S)
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  // Check which days of the current week have activity
  const weekActivity = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    const dateStr = date.toDateString();
    const isActive = streakData.calendar.some(
      cal => new Date(cal.date).toDateString() === dateStr && cal.isActive
    );
    weekActivity.push({
      day: daysOfWeek[(i + today.getDay()) % 7],
      date: date.getDate(),
      isActive,
      isToday: dateStr === today.toDateString()
    });
  }

  const getFireEmojis = (streak) => {
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 3) return "🔥";
    return "";
  };

  return (
    <div className="streak-container">
      <div className="streak-header">
        <div className="flame-icon">🔥</div>
        <div className="streak-info">
          <h3 className="streak-title">Your Daily Streak</h3>
          <p className="streak-subtitle">{streakData.message}</p>
        </div>
      </div>

      <div className="streak-stats">
        <div className="stat-box">
          <div className="stat-value">{streakData.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{streakData.maxStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      <div className="week-calendar">
        <div className="calendar-title">This Week</div>
        <div className="days-grid">
          {weekActivity.map((day, index) => (
            <div key={index} className="day-cell">
              <div className="day-letter">{day.day}</div>
              <div
                className={`day-number ${day.isActive ? "active" : ""} ${
                  day.isToday ? "today" : ""
                }`}
              >
                {day.isActive && <span className="check-mark">✓</span>}
                {!day.isActive && <span>{day.date}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {streakData.currentStreak > 0 && (
        <div className="streak-message">
          <span className="fire-emojis">{getFireEmojis(streakData.currentStreak)}</span>
          <p>Amazing! Keep tracking your expenses daily!</p>
        </div>
      )}

      <button 
        className="refresh-streak-btn"
        onClick={fetchStreakData}
        title="Refresh streak data"
      >
        ↻ Refresh
      </button>
    </div>
  );
};

export default StreakComponent;
