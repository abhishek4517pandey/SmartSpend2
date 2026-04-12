# Daily Streak Feature Documentation

## Overview
The Daily Streak feature tracks how consistently users update their expenses, similar to LeetCode's streak counter. It motivates users to maintain a habit of recording their spending regularly.

## Features

### 1. **Streak Counter**
- **Current Streak**: Increments by 1 for each consecutive day the user adds/updates an expense
- **Max Streak**: Records the highest streak achieved
- **Motivational Messages**: Changes based on streak count
  - 0 days: "Start your streak by adding an expense today!"
  - 1 day: "Great start! Keep it up! 🔥"
  - 2-3 days: "You're on fire! 🔥"
  - 4-7 days: "Amazing dedication! A whole week! 🎉"
  - 8-14 days: "Incredible! Two weeks of consistency! 💪"
  - 15-30 days: "Outstanding! A month of dedication! ⭐"
  - 30+ days: "You're a legend! Keep breaking records! 👑"

### 2. **Weekly Calendar View**
- Visual representation of the current week's activity
- Days with expense updates are highlighted in orange/gold
- Current day is outlined in blue
- Quick visualization of weekly consistency

### 3. **Animated UI**
- Flaming fire icon with flickering animation
- Floating emojis for visual appeal
- Smooth hover animations on stat boxes
- Check mark animation when day shows activity
- Responsive design for mobile and desktop

## How It Works

### Backend Logic

**User Model Schema Updates** (`backend/models/User.js`):
```javascript
currentStreak: { type: Number, default: 0 }        // Current consecutive days
maxStreak: { type: Number, default: 0 }            // Best streak ever
lastStreakUpdateDate: { type: Date, default: null } // Last update date
streakDates: [{ type: Date }]                      // Array of all activity dates
```

**Streak Service** (`backend/services/streakService.js`):

1. **updateDailyStreak(userId)**
   - Called when user adds/updates an expense
   - Checks if user already updated streak today
   - If today ≠ last update date:
     - If yesterday = last update date → increment streak
     - Otherwise → reset streak to 1
   - Updates maxStreak if current > max
   - Records date in streakDates array
   - Returns streak data with motivational message

2. **getStreakData(userId)**
   - Fetches user's complete streak information
   - Returns last 30 days of activity
   - Includes calendar view data
   - Returns motivational message

### Frontend Integration

**StreakComponent** (`Frontend/src/components/StreakComponent.jsx`):
- Displays streak statistics and weekly calendar
- Fetches data from `/expenses/streak/data` endpoint
- Auto-refreshes when user adds expenses
- Shows animated flame icon and motivational text

**Profile Page Integration** (`Frontend/src/pages/Profile.jsx`):
- Added `<StreakComponent />` in the profile section
- Located between notification preferences and save button
- Visible to all authenticated users

## API Endpoints

### 1. Create Expense (POST `/api/expenses`)
**Automatically triggers streak update**
```json
Response includes:
{
  "expense": { ... },
  "streak": {
    "currentStreak": 3,
    "maxStreak": 5,
    "lastStreakUpdateDate": "2024-04-12T..."
    "isNewStreakDay": true,
    "message": "You're on fire! 🔥"
  },
  "budgetCheck": { ... },
  "categoryCheck": { ... }
}
```

### 2. Get Streak Data (GET `/api/expenses/streak/data`)
```json
Response:
{
  "currentStreak": 3,
  "maxStreak": 5,
  "lastStreakUpdateDate": "2024-04-12T...",
  "calendar": [
    { "date": "2024-04-11T...", "isActive": true },
    { "date": "2024-04-12T...", "isActive": true },
    ...
  ],
  "message": "You're on fire! 🔥"
}
```

## Testing the Streak Feature

### Step 1: Navigate to Profile
1. Log in to the application
2. Go to the Profile page

### Step 2: Add an Expense
1. Go to Expenses page
2. Click "Add Expense" button
3. Fill in expense details
4. Click Save

### Step 3: Check Streak Update
1. Return to Profile page
2. Scroll to Daily Streak section
3. Verify:
   - Current streak has incremented (or shows 1 if first time)
   - Week calendar shows today as active
   - Motivational message appears

### Step 4: Next Day Test
1. Wait until next calendar day (or modify system time for testing)
2. Add another expense
3. Streak counter should increment by 1

### Step 5: Break Streak Test
1. Skip a day without adding any expenses
2. On the 3rd day, add an expense
3. Streak counter should reset to 1
4. Max streak should remain at previous value

## Data Persistence

- Streak data is stored in MongoDB
- Updates occur automatically when expenses are added
- Historical data (last 30 days) is maintained for calendar view
- Max streak is never decreased (permanent achievement record)

## Styling Details

**Colors:**
- Primary: Deep dark blue (#1a1a2e, #16213e) background
- Accent: Orange/Gold (#ff6b35, #f7931e) for active elements
- Secondary: Light blue (#4a90e2) for today's date
- Text: White (#fff) and light gray (#b0b0b0)

**Responsive Design:**
- Desktop: Full layout with side-by-side stats
- Tablet (768px): Adjusted padding and font sizes
- Mobile (480px): Optimized column sizes and touch-friendly buttons

## Future Enhancements

Possible extensions to the streak feature:
1. Streak badges/achievements (7-day, 30-day, 100-day badges)
2. Streak milestones with rewards
3. Social sharing of streak achievements
4. Email reminders for streak maintenance
5. Streak leaderboard
6. Time zone aware streak calculations
7. Makeup days (catch up missed days)

## Troubleshooting

### Streak not incrementing?
- Verify expense was saved successfully
- Check browser console for API errors
- Ensure user is logged in
- Try refreshing the Profile page

### Calendar not showing activity?
- Clear browser cache and reload
- Check MongoDB connection
- Verify streakDates array in user document

### Motivational message not changing?
- Check if streak count is correct
- Verify getStreakMessage() logic in streakService.js
- A refresh is needed after adding new expense

## File Structure

```
Backend Changes:
- models/User.js (Added streak fields)
- services/streakService.js (NEW)
- routes/expenseRoutes.js (Updated POST to call updateDailyStreak)

Frontend Changes:
- components/StreakComponent.jsx (NEW)
- styles/StreakComponent.css (NEW)
- pages/Profile.jsx (Added StreakComponent import and usage)
```

## Database Query Examples

### Get user with streak data:
```javascript
User.findById(userId).select('currentStreak maxStreak lastStreakUpdateDate streakDates')
```

### Get active dates in last 30 days:
```javascript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
User.findById(userId).select('streakDates where createdAt > thirtyDaysAgo')
```

## Performance Considerations

- Streak updates happen once per day per user (minimal overhead)
- streakDates array cleaned periodically (keep last 90 days)
- Calendar calculations happen client-side (minimal server load)
- GET streak data endpoint is lightweight

