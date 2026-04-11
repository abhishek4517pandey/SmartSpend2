# Quick Start Guide - Google OAuth

## In 3 Simple Steps:

### Step 1: Get Google Client ID (2 minutes)
```
1. Visit: https://console.cloud.google.com/
2. Login with your Google account
3. Create new project "SmartSpend"
4. Enable Google+ API
5. Create OAuth credentials (select "Web application")
6. Add these authorized origins:
   - http://localhost:5173
   - http://localhost:3000
7. Copy the "Client ID" (not secret)
```

### Step 2: Add to Frontend (1 minute)
```bash
# In the SmartSpend/Frontend folder, create a file named .env
# Copy this and paste your Client ID:

VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start and Test (30 seconds)
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd Frontend
npm run dev
```

Visit `http://localhost:5173` → Click Login → Click "Sign in with Google" ✅

---

## What You'll See:

✅ **Login Page**
- Google Sign-In button at the top
- Traditional email/password login below

✅ **Register Page**
- Google Sign-Up button at the top
- Traditional registration form below

✅ **Navbar (After Login)**
- Your Google profile picture circle (32px)
- Your name next to it
- Logout button

---

## That's It! 🎉

Your SmartSpend app now has:
- ✅ Google login/signup
- ✅ Profile pictures from Google
- ✅ Both Google & email authentication options
- ✅ Automatic user creation on first login

---

## If Something Goes Wrong:

**"clientId is not set" error?**
→ Make sure `.env` file exists in `/Frontend` folder with your Client ID

**Profile picture not showing?**
→ Clear browser cookies and reload

**CORS error?**
→ Make sure backend is running on port 5000, frontend on 5173

---

## Files That Changed:

- `backend/models/User.js` - Added Google fields
- `backend/routes/authRoutes.js` - Added Google endpoint
- `Frontend/src/pages/Login.jsx` - Added Google button
- `Frontend/src/pages/Register.jsx` - Added Google button
- `Frontend/src/components/Navbar.jsx` - Show profile picture
- `Frontend/src/styles.css` - Google button styling

---

**Need detailed help?** → See `GOOGLE_OAUTH_SETUP.md`

**Want all details?** → See `IMPLEMENTATION.md`
