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

  const getMotivationMessage = (streak) => {
    if (streak === 0) return "Start tracking today 💪";
    if (streak <= 3) return "Good start! Keep going 🔥";
    if (streak <= 7) return "Great consistency! 🚀";
    return "You're unstoppable! 💯";
  };

  return (
    <div className="streak-container bg-slate-50 dark:bg-slate-900 shadow-lg border border-gray-200 rounded-xl p-6">
      <div className="streak-header">
        <div className="streak-info">
          <h3 className="streak-title">Your Daily Streak</h3>
          <p className="streak-subtitle">{getMotivationMessage(streakData.currentStreak)}</p>
        </div>
      </div>

      <div className="streak-stats">
        <div className="stat-box rounded-xl shadow-md">
          <div className="stat-value flex items-center justify-center gap-2 text-3xl font-bold">
            <span>🔥</span>
            <span>{streakData.currentStreak}</span>
          </div>
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
                className={`day-number w-12 h-12 rounded-md flex items-center justify-center text-sm font-semibold ${
                  day.isActive
                    ? "bg-green-500 text-white border border-transparent"
                    : "bg-gray-100 text-gray-700 border border-transparent"
                } ${day.isToday ? "border-2 border-green-500" : ""}`}
              >
                {day.isActive ? <span>✓</span> : <span>{day.date}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

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
