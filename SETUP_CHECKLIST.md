# SmartSpend Google OAuth - Setup Checklist

## Pre-Setup Requirements
- [ ] Google account (for Google Cloud Console)
- [ ] Node.js installed
- [ ] npm installed
- [ ] Terminal/Command prompt access

---

## Step 1: Google Cloud Setup (5 mins)

### 1.1 Create Google Cloud Project
- [ ] Go to https://console.cloud.google.com/
- [ ] Click "Select a Project"
- [ ] Click "New Project"
- [ ] Enter name: "SmartSpend"
- [ ] Click "Create"
- [ ] Wait for project to be created

### 1.2 Enable Google+ API
- [ ] In sidebar, click "APIs & Services" → "Library"
- [ ] Search for "Google+ API"
- [ ] Click and select it
- [ ] Click "Enable"
- [ ] Wait for it to enable

### 1.3 Create OAuth 2.0 Credentials
- [ ] Go to "APIs & Services" → "Credentials"
- [ ] Click "Create Credentials" → "OAuth 2.0 Client ID"
- [ ] If prompted for Consent Screen:
  - [ ] Select "External" user type
  - [ ] Click "Configure Consent Screen"
  - [ ] Fill in:
    - [ ] App name: "SmartSpend"
    - [ ] User support email: your-email@gmail.com
    - [ ] Developer contact: your-email@gmail.com
  - [ ] Click "Save and Continue"
  - [ ] Click "Save and Continue" (skip optional scopes)
  - [ ] Click "Back to Dashboard"

### 1.4 Configure OAuth Credentials
- [ ] Click "Create Credentials" → "OAuth 2.0 Client ID"
- [ ] Select "Web application"
- [ ] Name: "SmartSpend Web Client"
- [ ] Add Authorized JavaScript origins:
  - [ ] http://localhost:5173
  - [ ] http://localhost:3000
- [ ] Add Authorized redirect URIs:
  - [ ] http://localhost:5173
  - [ ] http://localhost:5000
- [ ] Click "Create"
- [ ] Copy the "Client ID" (LONG string of numbers and hyphens)
- [ ] **Important**: Close dialog when done (don't need Client Secret)

---

## Step 2: Frontend Setup (2 mins)

### 2.1 Create Environment File
- [ ] Open `SmartSpend/Frontend` folder
- [ ] Create new file named `.env` (starts with dot)
- [ ] Paste this content:
```
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_API_URL=http://localhost:5000/api
```
- [ ] Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID from Step 1.4
- [ ] Save the file

### 2.2 Verify Dependencies
- [ ] Check that npm packages are installed:
  - [ ] @react-oauth/google
  - [ ] jwt-decode

---

## Step 3: Start Applications (2 mins)

### 3.1 Terminal 1 - Start Backend
- [ ] Open New Terminal
- [ ] Navigate: `cd SmartSpend/backend`
- [ ] Run: `npm run dev`
- [ ] Wait for: "Server running on port 5000"
- [ ] Keep terminal open

### 3.2 Terminal 2 - Start Frontend
- [ ] Open Another Terminal
- [ ] Navigate: `cd SmartSpend/Frontend`
- [ ] Run: `npm run dev`
- [ ] Wait for: "Local: http://localhost:5173"
- [ ] Keep terminal open

---

## Step 4: Test Google Login (3 mins)

### 4.1 Open Application
- [ ] Open browser to http://localhost:5173
- [ ] You should see SmartSpend homepage
- [ ] Click "Login" button

### 4.2 Test Google Login Button
- [ ] You should see:
  - [ ] "Sign in with Google" button at top
  - [ ] "Or continue with email" text
  - [ ] Traditional email/password form below
- [ ] Click "Sign in with Google"
- [ ] Google consent window should open
- [ ] Click "Allow" (permit SmartSpend to access your profile)
- [ ] You should be redirected back to SmartSpend
- [ ] Check if you're logged in:
  - [ ] Your Google profile picture appears in navbar (top right)
  - [ ] Your name appears next to the avatar
  - [ ] "Logout" button appears

### 4.3 Test Google Registration
- [ ] Click "Logout"
- [ ] Click "Register" button
- [ ] Click "Sign up with Google"
- [ ] Google consent window opens (if not already authorized)
- [ ] Click "Allow"
- [ ] You should be logged in again
- [ ] Profile picture should show in navbar

### 4.4 Test Email/Password Still Works
- [ ] Click "Logout"
- [ ] Click "Login"
- [ ] Enter email and password
- [ ] Click "Login" button
- [ ] You should be logged in via email/password
- [ ] No profile picture (unless uploaded separately)
- [ ] This confirms both methods work!

---

## Step 5: Verify Features

### 5.1 Avatar Display
- [ ] Profile picture is circular (32px)
- [ ] Picture is clear and visible
- [ ] Picture matches your Google profile picture
- [ ] Picture shows on all pages when logged in

### 5.2 Navigation Links
- [ ] All navbar links work (Home, Dashboard, Expenses, etc.)
- [ ] Logout button works
- [ ] User name shows correctly in navbar

### 5.3 Session Persistence
- [ ] Refresh the page (Ctrl+R or Cmd+R)
- [ ] You should still be logged in
- [ ] Profile picture should still show
- [ ] This confirms localStorage is working

---

## Troubleshooting

### ❌ Problem: "clientId is not set" Error
**Solution:**
- [ ] Check if `.env` file exists in `/Frontend` folder
- [ ] Check `.env` file has: `VITE_GOOGLE_CLIENT_ID=...`
- [ ] Check Client ID is correct (copy from Google Cloud Console again)
- [ ] Restart frontend: Stop and `npm run dev` again

### ❌ Problem: Google Button Not Showing
**Solution:**
- [ ] Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Clear browser cache
- [ ] Check browser console for errors (F12 → Console)
- [ ] Verify `.env` file is in `/Frontend` root (not in `/src`)

### ❌ Problem: Profile Picture Not Showing
**Solution:**
- [ ] Clear browser localStorage:
  - [ ] Open Developer Tools (F12)
  - [ ] Go to Application → Storage → Local Storage
  - [ ] Find localhost:5173 and delete it
  - [ ] Refresh and login again
- [ ] Make sure your Google account has a profile picture set

### ❌ Problem: CORS Error in Browser Console
**Solution:**
- [ ] Verify backend running on `http://localhost:5000`
- [ ] Verify frontend running on `http://localhost:5173`
- [ ] Check backend server.js has CORS enabled
- [ ] Restart both servers

### ❌ Problem: Google Popup Blocked
**Solution:**
- [ ] Browser may have popup blocker enabled
- [ ] Allow popups for `localhost:5173`
- [ ] Click lock icon in address bar → allow popups

---

## Success Indicators ✅

You're done when you can:
- ✅ Click "Sign in with Google" button
- ✅ See Google consent screen
- ✅ Get redirected back to SmartSpend
- ✅ See your Google profile picture in navbar
- ✅ See your name next to profile picture
- ✅ Click "Logout" and be logged out
- ✅ Login again with email/password
- ✅ Profile picture persists after page refresh

---

## Next Steps

### Immediate:
- [ ] Test all features above
- [ ] Verify profile picture displays correctly
- [ ] Test on mobile device (different browser)

### Later - For Production:
- [ ] Get a real domain (www.yoursite.com)
- [ ] Update Google OAuth credentials for your domain
- [ ] Update CORS in backend for your domain
- [ ] Deploy backend to hosting (Heroku, Railway, AWS)
- [ ] Deploy frontend to CDN (Vercel, Netlify)
- [ ] Update environment variables on hosting

### Optional:
- [ ] Add OAuth for GitHub/Microsoft
- [ ] Implement profile picture upload option
- [ ] Add "Link Account" feature
- [ ] Implement refresh token handling

---

## Files Ready for Review

### Documentation:
- `QUICK_START.md` - Quick reference
- `GOOGLE_OAUTH_SETUP.md` - Detailed guide
- `IMPLEMENTATION.md` - Technical details
- `README_GOOGLE_OAUTH.md` - Summary
- `ARCHITECTURE.md` - Visual diagrams

### Code Changes:
- `backend/models/User.js` - Database schema
- `backend/routes/authRoutes.js` - API endpoint
- `Frontend/src/pages/Login.jsx` - Google login
- `Frontend/src/pages/Register.jsx` - Google registration
- `Frontend/src/components/Navbar.jsx` - Avatar display
- `Frontend/src/context/AuthContext.jsx` - State management
- `Frontend/src/styles.css` - Button styling

---

## Support

If you get stuck:

1. **Check `QUICK_START.md`** - Most common issues
2. **Review `GOOGLE_OAUTH_SETUP.md`** - Step-by-step help
3. **Look at `ARCHITECTURE.md`** - Visual flows
4. **Check console errors** (F12 → Console tab)
5. **Check terminal output** - Backend errors

---

**🎉 You're all set! Happy coding!**
