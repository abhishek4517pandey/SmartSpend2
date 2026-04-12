import User from "../models/User.js";

/**
 * Updates user's daily streak when they add/update an expense
 * @param {string} userId - The user's ID
 * @returns {object} - Updated streak data
 */
export const updateDailyStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Check if user already updated streak today
    const lastUpdateDate = user.lastStreakUpdateDate 
      ? new Date(user.lastStreakUpdateDate) 
      : null;
    
    if (lastUpdateDate) {
      lastUpdateDate.setHours(0, 0, 0, 0);
      // If already updated today, return current streak
      if (lastUpdateDate.getTime() === today.getTime()) {
        return {
          currentStreak: user.currentStreak,
          maxStreak: user.maxStreak,
          lastStreakUpdateDate: user.lastStreakUpdateDate,
          isNewStreakDay: false
        };
      }
    }

    // Calculate streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = user.currentStreak;

    // Check if last update was yesterday (maintain streak) or older (reset streak)
    if (lastUpdateDate && lastUpdateDate.getTime() === yesterday.getTime()) {
      // Continue the streak
      newStreak = user.currentStreak + 1;
    } else {
      // Start new streak or first time
      newStreak = 1;
    }

    // Update max streak if needed
    const newMaxStreak = Math.max(user.maxStreak || 0, newStreak);

    // Add today's date to streak dates
    const updatedStreakDates = user.streakDates || [];
    updatedStreakDates.push(new Date(today));

    // Update user
    user.currentStreak = newStreak;
    user.maxStreak = newMaxStreak;
    user.lastStreakUpdateDate = new Date();
    user.streakDates = updatedStreakDates;

    const updatedUser = await user.save();

    return {
      currentStreak: updatedUser.currentStreak,
      maxStreak: updatedUser.maxStreak,
      lastStreakUpdateDate: updatedUser.lastStreakUpdateDate,
      isNewStreakDay: true,
      message: getStreakMessage(newStreak)
    };
  } catch (error) {
    console.error("Error updating daily streak:", error);
    throw error;
  }
};

/**
 * Get user's streak data
 * @param {string} userId - The user's ID
 * @returns {object} - Streak data with motivational message
 */
export const getStreakData = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get last 30 days of activity
    const last30Days = getLast30Days();
    const activeDates = (user.streakDates || []).map(date => 
      new Date(date).toDateString()
    );

    const calendar = last30Days.map(date => ({
      date,
      isActive: activeDates.includes(date.toDateString())
    }));

    return {
      currentStreak: user.currentStreak || 0,
      maxStreak: user.maxStreak || 0,
      lastStreakUpdateDate: user.lastStreakUpdateDate,
      calendar,
      message: getStreakMessage(user.currentStreak || 0)
    };
  } catch (error) {
    console.error("Error getting streak data:", error);
    throw error;
  }
};

/**
 * Get motivational message based on streak count
 * @param {number} streak - Current streak count
 * @returns {string} - Motivational message
 */
const getStreakMessage = (streak) => {
  if (streak === 0) return "Start your streak by adding an expense today!";
  if (streak === 1) return "Great start! Keep it up! 🔥";
  if (streak <= 3) return "You're on fire! 🔥";
  if (streak <= 7) return "Amazing dedication! A whole week! 🎉";
  if (streak <= 14) return "Incredible! Two weeks of consistency! 💪";
  if (streak <= 30) return "Outstanding! A month of dedication! ⭐";
  return "You're a legend! Keep breaking records! 👑";
};

/**
 * Get last 30 days as Date objects
 * @returns {Date[]} - Array of last 30 days
 */
const getLast30Days = () => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(new Date(date));
  }

  return days;
};
