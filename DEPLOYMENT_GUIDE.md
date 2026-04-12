# SmartSpend Vercel Deployment Guide

Complete instructions for deploying SmartSpend to Vercel (Backend + Frontend).

---

## 📋 Prerequisites

Before you begin, make sure you have:

1. **GitHub Account** - For version control
2. **Vercel Account** - Free at https://vercel.com
3. **MongoDB Atlas Account** - Free tier at https://www.mongodb.com/cloud/atlas
4. **Google Cloud Console Account** - For OAuth setup at https://console.cloud.google.com
5. **Git installed** on your machine

---

## 🚀 Step 1: Prepare Your Code for Deployment

### 1.1 Push Code to GitHub

```bash
cd c:\Users\Abhishek Pandey\OneDrive\Desktop\SmartSpend

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - SmartSpend deployment ready"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/smartspend.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Environment Files

Ensure these files exist in your project:
- `backend/.env.example` ✓
- `Frontend/.env.example` ✓

**Never commit actual `.env` files to GitHub!**

---

## 🗄️ Step 2: Set Up MongoDB Atlas (Database)

### 2.1 Create MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create free account
3. Create a new **Free Tier** project
4. Click "Create a Database"
   - Provider: AWS
   - Region: Choose closest to you
   - Cluster Name: `smartspend` (or any name)
5. Click "Create Cluster"

### 2.2 Set Up Database Access

1. Go to **Database Access** in sidebar
2. Click "Add New Database User"
3. **Choose Password** authentication
4. Username: `smartspend_user` (or any)
5. Auto-generate strong password
6. **Copy the password** and save it securely
7. Database Privileges: **Built-in Roles** → Select "Read and write to any database"
8. Click "Add User"

### 2.3 Set Up Network Access

1. Go to **Network Access** in sidebar
2. Click "Add IP Address"
3. Select "Allow access from anywhere"
   - IP Address: `0.0.0.0/0` (for Vercel compatibility)
4. Click "Confirm"

### 2.4 Get Connection String

1. Go back to **Clusters** → Click "Connect"
2. Choose "Drivers"
3. Select **Node.js** version
4. Copy the connection string
5. Replace:
   - `<PASSWORD>` with your database password
   - `<DATABASE_NAME>` with your database name (e.g., `smartspend`)

**Example:**
```
mongodb+srv://smartspend_user:YOUR_PASSWORD@cluster0.abc123.mongodb.net/smartspend?retryWrites=true&w=majority
```

Save this for later!

---

## 🔐 Step 3: Set Up Google OAuth

### 3.1 Create Google OAuth Credentials

1. Go to https://console.cloud.google.com
2. Click "Select a Project" → "NEW PROJECT"
3. Project name: `SmartSpend`
4. Click "Create"

### 3.2 Enable Google+ API

1. Search for "Google+ API" in the search bar
2. Click on it and select "Enable"

### 3.3 Create OAuth Consent Screen

1. Go to **Credentials** in the sidebar
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. If asked to configure consent screen first:
   - Click **"Configure Consent Screen"**
   - Choose **"External"** user type
   - Click "Create"

### 3.4 Fill Out OAuth Consent Screen

**OAuth Consent Screen Page:**
- App name: `SmartSpend`
- User support email: Your email
- Developer contact: Your email
- Click "Save and Continue"

**Scopes Page:**
- Click "Add or Remove Scopes"
- Search and add:
  - `https://www.googleapis.com/auth/userinfo.profile`
  - `https://www.googleapis.com/auth/userinfo.email`
- Click "Update"
- Click "Save and Continue"

**Test Users Page:**
- Skip or add your test email
- Click "Save and Continue"

### 3.5 Create OAuth Credentials

1. Go back to **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Application type: **Web application**
4. Name: `SmartSpend Web`
5. **Authorized JavaScript origins:**
   - `http://localhost:5173` (local dev)
   - `http://localhost:3000` (alternative)
   - `https://your-frontend-domain.vercel.app` (production - add later)

6. **Authorized redirect URIs:**
   - `http://localhost:5173/login` (local dev)
   - `http://localhost:5173/dashboard` (local dev)
   - `https://your-frontend-domain.vercel.app/login` (production)
   - `https://your-frontend-domain.vercel.app/dashboard` (production)

7. Click "Create"
8. **Copy your Client ID and Client Secret**

Save these for the next steps!

---

## 📮 Step 4: Set Up Gmail App Password (Optional - for Emails)

If you want email notifications:

1. Go to https://myaccount.google.com
2. Go to **Security** → **App passwords**
   - Requires 2FA enabled
   - Select App: "Mail", Device: "Windows Computer"
3. Google generates a 16-character password
4. **Copy this password** (you'll need it)

---

## 🚀 Step 5: Deploy Backend to Vercel

### 5.1 Create Vercel Project

1. Go to https://vercel.com/new
2. Select **"Other"** (since we have vercel.json)
3. Or import from GitHub:
   - Click "Import Git Repository"
   - Search for your `smartspend` repo
   - Click "Import"

### 5.2 Configure Backend Deployment

1. **Root Directory:** Select `backend` folder
2. **Build Command:** Leave blank (Node.js auto-detected)
3. **Output Directory:** Leave blank
4. Click "Environment Variables" and add all these:

```
MONGO_URI = mongodb+srv://smartspend_user:YOUR_PASSWORD@cluster.mongodb.net/smartspend?retryWrites=true&w=majority
JWT_SECRET = generate_random_secret_min_32_chars
GMAIL_USER = your_gmail@gmail.com
GMAIL_PASSWORD = your_16_char_app_password
GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
FRONTEND_URL = https://your-frontend-domain.vercel.app
NODE_ENV = production
```

5. Click "Deploy"
6. Wait for deployment to complete
7. **Copy the backend URL** (e.g., `https://smartspend-backend.vercel.app`)

### 5.3 Update Google OAuth (Add Backend Domain)

1. Go back to Google Cloud Console
2. Go to **Credentials** → Your OAuth app
3. **Authorized redirect URIs** - Add:
   - `https://your-backend-url.vercel.app/api/auth/google/callback`
4. Click "Save"

---

## 🎨 Step 6: Deploy Frontend to Vercel

### 6.1 Create Frontend Project on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository (same one as backend)
3. **Root Directory:** Select `Frontend` folder
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Click "Environment Variables" and add:

```
VITE_API_URL = https://your-backend-url.vercel.app/api
VITE_GOOGLE_CLIENT_ID = your_google_client_id
VITE_APP_NAME = SmartSpend
VITE_APP_VERSION = 1.0.0
```

7. Click "Deploy"
8. Wait for deployment
9. **Copy the frontend URL** (e.g., `https://smartspend.vercel.app`)

### 6.2 Update Google OAuth (Add Frontend Domain)

1. Go back to Google Cloud Console
2. Go to **Credentials** → Your OAuth app
3. **Authorized JavaScript origins** - Add:
   - Your Vercel frontend domain
4. **Authorized redirect URIs** - Add:
   - `https://your-frontend-domain.vercel.app/login`
   - `https://your-frontend-domain.vercel.app/dashboard`
5. Click "Save"

---

## 🔧 Step 7: Update Environment Variables

### 7.1 Update Backend .env on Vercel

1. Go to your **Backend Vercel Project**
2. Go to **Settings** → **Environment Variables**
3. Update `FRONTEND_URL` to your official frontend domain:
   ```
   FRONTEND_URL = https://your-final-frontend-domain.vercel.app
   ```
4. Redeploy (push to GitHub) to apply changes

### 7.2 Update Frontend .env on Vercel

1. Go to your **Frontend Vercel Project**
2. Go to **Settings** → **Environment Variables**
3. Verify all variables point to correct URLs
4. Redeploy if changes made

---

## ✅ Step 8: Test Your Deployment

### 8.1 Test Frontend

1. Open `https://your-frontend-domain.vercel.app`
2. Check that page loads properly
3. Test Light/Dark mode toggle
4. Verify all animations work smoothly

### 8.2 Test Authentication

1. Click "Get Started" or "Create Account"
2. Try Google OAuth login
3. Verify it redirects properly
4. Check dashboard loads with data

### 8.3 Test API Connectivity

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try adding an expense
4. Check that API calls go to correct backend URL
5. Verify data saves to MongoDB

### 8.4 Test Email (if configured)

1. Go to Profile
2. Update any field that triggers email
3. Check your email inbox for notifications

---

## 🐛 Troubleshooting

### "CORS Error"
- Check `FRONTEND_URL` in backend environment variables
- Verify both frontend and backend URLs are correct
- Redeploy after updating

### "Cannot connect to MongoDB"
- Verify `MONGO_URI` is correct (with password)
- Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- Test connection string directly

### "Google OAuth fails"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that redirect URIs in Google Console match actual domains
- Clear browser cookies and try again

### "Vercel Build Fails"
- Check build logs in Vercel dashboard
- Ensure `package.json` has all dependencies
- Verify Node.js version is compatible
- Check for any hardcoded localhost URLs

### "Frontend shows API errors"
- Open DevTools Network tab
- Check if API requests are going to correct URL
- Verify `VITE_API_URL` environment variable
- Check backend Vercel logs for errors

---

## 📊 Monitoring & Maintenance

### 7.1 Monitor Backend Health

```bash
# Add a health check endpoint to your backend
# Already added to server.js as GET /api/health

# You can test it:
curl https://your-backend-url.vercel.app/api/health
```

### 7.2 View Logs

**Vercel Logs:**
1. Go to Vercel Project
2. Click "Deployments"
3. Select a deployment
4. Click "Logs" to see real-time logs

### 7.3 Track MongoDB Usage

1. Go to MongoDB Atlas Dashboard
2. View your cluster statistics
3. Free tier allows 512MB storage

---

## 🔄 Updating Your Deployment

### To update your app:

1. Make changes locally
2. Test locally (`npm run dev`)
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
4. Vercel automatically redeploys on push
5. Check Vercel dashboard for build status

---

## 📱 Domain Management (Optional)

To use a custom domain instead of `vercel.app`:

1. **Buy a domain** from:
   - GoDaddy
   - Namecheap
   - CloudFlare
   - Google Domains

2. **Connect to Vercel:**
   1. Go to Vercel Project Settings
   2. Go to "Domains"
   3. Add your domain
   4. Follow instructions to update DNS
   5. Wait 24-48 hours for propagation

3. **Update Google OAuth:**
   - Add your custom domain to allowed origins/redirects

---

## 🎯 Quick Reference

| Component | URL Pattern |
|-----------|------------|
| Frontend | `https://<your-frontend-name>.vercel.app` |
| Backend | `https://<your-backend-name>.vercel.app` |
| MongoDB | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>` |
| API Calls | `https://<backend>.vercel.app/api/...` |

---

## 📚 Useful Resources

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Guide:** https://docs.atlas.mongodb.com
- **Google OAuth Setup:** https://developers.google.com/identity/protocols/oauth2
- **Node.js Best Practices:** https://nodejs.org/en/docs/guides/

---

## ✨ You're All Set!

Your SmartSpend app is now live on Vercel with full production deployment! 🎉

If you have any issues, check the troubleshooting section or consult the official documentation links above.

**Happy coding!** 🚀
