# Daily Streak Feature - Quick Testing Guide

## 🚀 Quick Start

Your servers are running:
- **Frontend**: http://localhost:5173/
- **Backend**: http://localhost:5000/

## 📋 What Was Implemented

✅ **Backend (Node.js/Express)**
- Created `streakService.js` with streak logic
- Updated User model with streak fields
- Modified expense routes to auto-update streaks
- Added new endpoint: `GET /api/expenses/streak/data`

✅ **Frontend (React)**
- Created `StreakComponent.jsx` with LeetCode-style design
- Created `StreakComponent.css` with animations
- Integrated component into Profile page

✅ **Database (MongoDB)**
- New fields: `currentStreak`, `maxStreak`, `lastStreakUpdateDate`, `streakDates`

## 🧪 How to Test

### Test 1: Add First Expense & Start Streak
```
1. Open http://localhost:5173/
2. Navigate to Expenses page
3. Click "Add Expense" button
4. Fill in details:
   - Amount: 50
   - Category: Food
   - Date: Today
   - Description: Test expense
5. Click Save
6. Go to Profile page
7. Scroll to "Your Daily Streak" section
8. ✅ Verify: Current Streak = 1, Shows "Great start! Keep it up! 🔥"
```

### Test 2: Add Another Expense Same Day
```
1. Go back to Expenses page
2. Add another expense (same day)
3. Go to Profile page
4. Scroll to Daily Streak section
5. ✅ Verify: Current Streak still = 1 (no duplicate increment)
```

### Test 3: Next Day Streak Continue
```
1. Use browser DevTools to change system time to next day (or wait 24 hours)
2. Add an expense on the new day
3. Go to Profile page
4. ✅ Verify: Current Streak = 2
5. ✅ Check week calendar for 2 active days
```

### Test 4: Break & Reset Streak
```
1. Skip 1 day (don't add any expenses)
2. On day 3, add an expense
3. Go to Profile page
4. ✅ Verify: Current Streak = 1 (resets)
5. ✅ Verify: Max Streak still shows previous value (e.g., 2)
```

### Test 5: Week Calendar Display
```
1. Go to Profile page
2. Check "This Week" calendar in Daily Streak section
3. ✅ Verify:
   - Days with expenses show checkmark (✓) in orange
   - Days without expenses show number in gray
   - Today's date outlined in blue (if active)
   - Day letters (M, T, W, T, F, S, S) display correctly
```

### Test 6: Motivational Messages
```
Add expenses on consecutive days and verify messages:
- Day 1: "Great start! Keep it up! 🔥"
- Day 3: "You're on fire! 🔥"
- Day 7: "Amazing dedication! A whole week! 🎉"
- Day 14: "Incredible! Two weeks of consistency! 💪"
- Day 30: "Outstanding! A month of dedication! ⭐"
- Day 30+: "You're a legend! Keep breaking records! 👑"
```

## 🎨 Visual Elements to Check

### Streak Component Should Display:
- [ ] Flame icon (🔥) with flickering animation
- [ ] "Your Daily Streak" title in orange
- [ ] Motivational message in italic text
- [ ] Current Streak number (large, orange)
- [ ] Max Streak number (large, orange)
- [ ] "This Week" section header
- [ ] 7-day calendar grid
- [ ] Refresh button at bottom
- [ ] Responsive design (test on mobile view)

### Styling Check:
- [ ] Dark background (#1a1a2e)
- [ ] Orange accent color (#ff6b35)
- [ ] Smooth animations
- [ ] Proper spacing and padding
- [ ] Mobile responsive layout

## 📱 Test on Mobile

```
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select iPhone SE or Android device
4. Verify:
   - Layout is responsive
   - Touch interactions work
   - Text is readable
   - Images scale properly
```

## 🔍 Check API Responses

### Using Browser DevTools:

1. **Open Network tab** (DevTools > Network)
2. **Add an expense** and check POST request:
   ```
   Request: POST /api/expenses
   Response includes: streak { currentStreak, maxStreak, message }
   ```

3. **Check streak data** endpoint manually:
   ```
   Network > Type in: http://localhost:5173/api/expenses/streak/data
   Or refresh Profile page and find GET request to streak/data
   Response shows: { currentStreak, maxStreak, calendar, message }
   ```

## 🐛 Debugging Tips

### Check Backend Logs:
- Open backend terminal (npm run dev output)
- Look for console logs when expenses are added
- Verify streak update function is called

### Check Browser Console:
- Open DevTools Console
- Look for API errors or warnings
- Check for missing imports

### Check MongoDB:
```javascript
// In MongoDB Compass or shell:
db.users.findOne(
  { _id: ObjectId("your-user-id") },
  { currentStreak: 1, maxStreak: 1, lastStreakUpdateDate: 1 }
)
```

## ✅ Expected Behavior Summary

| Action | Expected Result |
|--------|-----------------|
| Add expense Day 1 | Streak = 1, Max = 1 |
| Add expense Day 1 again | Streak = 1 (no change) |
| Add expense Day 2 | Streak = 2, Max = 2 |
| Skip Day 3, add Day 4 | Streak = 1, Max = 2 |
| Refresh page | Streak data persists |
| View streak on Profile | All animations work |
| Week calendar | Shows active/inactive days |

## 📊 Data Model

User document should have:
```javascript
{
  _id: ObjectId,
  name: "User Name",
  email: "user@example.com",
  currentStreak: 3,      // Increments each day
  maxStreak: 5,          // Never decreases
  lastStreakUpdateDate: Date,  // Last update timestamp
  streakDates: [         // Array of all activity dates
    Date,
    Date,
    ...
  ],
  // ... other fields
}
```

## 🎯 Common Issues & Fixes

**Issue**: Streak not incrementing
- **Fix**: Ensure system time is past 00:00:00 of current day
- **Fix**: Check browser console for API errors
- **Fix**: Verify expense was actually saved

**Issue**: Calendar shows wrong days
- **Fix**: Check if lastStreakUpdateDate is in correct format
- **Fix**: Clear browser cache and reload

**Issue**: Animations not showing
- **Fix**: Check CSS file is imported correctly
- **Fix**: Verify no CSS conflicts in styles.css

**Issue**: Component showing "Failed to load streak data"
- **Fix**: Check backend /expenses/streak/data endpoint exists
- **Fix**: Verify user is authenticated (check localStorage for token)

## 📝 Notes

- Streak is tied to UTC timezone (server-based)
- Each user has independent streak counter
- Streak data is persistent and stored in MongoDB
- No streak data is lost on server restart
- Calendar shows last 30 days of activity

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ Expense added → Streak shows correctly
2. ✅ Week calendar displays days with checkmarks
3. ✅ Flame icon flickers
4. ✅ Motivational message appears
5. ✅ Max streak updates correctly
6. ✅ Streak resets after skipping a day
7. ✅ Profile page loads without errors
8. ✅ Mobile view is responsive

