# Quick Deployment Commands Reference

## 🚀 Immediate Next Steps

Copy and paste these commands in order:

### 1. Initialize Git & Push to GitHub

```bash
# Navigate to project root
cd "c:\Users\Abhishek Pandey\OneDrive\Desktop\SmartSpend"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - SmartSpend ready for Vercel"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/smartspend.git
git branch -M main
git push -u origin main
```

### 2. Create Backend Vercel Project

```bash
# Go to https://vercel.com/new
# Select "Import Git Repository"
# Search for "smartspend" repository
# Select it and click "Import"

# In the import dialog:
# - Root Directory: select "backend"
# - Build Command: leave blank (auto-detected)
# - Output Directory: leave blank

# Click "Environment Variables" and add all these:
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-random-secret-32-chars>
GMAIL_USER=<your-email@gmail.com>
GMAIL_PASSWORD=<your-16-char-app-password>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FRONTEND_URL=<will-update-after-frontend-deploy>
NODE_ENV=production

# Click "Deploy"
# Wait for deployment (1-2 minutes)
# Copy the backend URL: https://<your-backend>.vercel.app
```

### 3. Create Frontend Vercel Project

```bash
# Go to https://vercel.com/new
# Select "Import Git Repository" (same repo)
# Click "Import"

# In the import dialog:
# - Root Directory: select "Frontend"
# - Build Command: npm run build
# - Output Directory: dist

# Click "Environment Variables" and add:
VITE_API_URL=https://<your-backend-url>.vercel.app/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_APP_NAME=SmartSpend
VITE_APP_VERSION=1.0.0

# Click "Deploy"
# Wait for deployment (2-3 minutes)
# Copy the frontend URL: https://<your-frontend>.vercel.app
```

### 4. Update Backend Environment Variables

```bash
# Go to backend Vercel project
# Settings → Environment Variables
# Update FRONTEND_URL with your frontend domain:
FRONTEND_URL=https://<your-frontend>.vercel.app

# Go to Deployments → Redeploy Latest
```

### 5. Update Google OAuth Redirect URIs

```
Go to: https://console.cloud.google.com
Project → Credentials → Your OAuth App

Add these to Authorized Redirect URIs:
- https://<your-backend>.vercel.app/api/auth/google/callback
- https://<your-frontend>.vercel.app/login
- https://<your-frontend>.vercel.app/dashboard

Add these to Authorized JavaScript Origins:
- https://<your-frontend>.vercel.app
```

---

## ✅ Verify Deployment

### Test Backend Health Check

```bash
curl https://<your-backend>.vercel.app/api/health
# Should return: {"status":"healthy","timestamp":"..."}
```

### Test Frontend

```
Open https://<your-frontend>.vercel.app in browser
Should load without errors
```

### Test API Connection

```bash
# Open DevTools (F12)
# Go to Network tab
# Click "Get Started" button
# Check that API calls go to correct backend URL
```

---

## 🔐 Secrets Quick Reference

**Keep these values secure!**

```
MongoDB Connection:
mongodb+srv://user:pass@cluster.mongodb.net/smartspend

JWT Secret:
[32+ character random string]

Google Client ID:
[from Google Cloud Console]

Google Client Secret:
[from Google Cloud Console]

Gmail Email:
your-email@gmail.com

Gmail App Password:
[16-character app password from Google Account]
```

---

## 📝 Environment Variable Templates

### Backend .env
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartspend?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here-32-chars-minimum
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000
```

### Frontend .env.local
```
VITE_API_URL=https://your-backend.vercel.app/api
VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
VITE_APP_NAME=SmartSpend
VITE_APP_VERSION=1.0.0
```

---

## 🆘 Quick Troubleshooting

### Build Fails
1. Check Vercel build logs
2. Ensure all dependencies are in package.json
3. Check for hardcoded localhost URLs

### API doesn't connect
1. Verify VITE_API_URL in frontend
2. Check FRONTEND_URL in backend
3. Check CORS configuration in server.js

### OAuth fails
1. Verify Google Client ID is correct
2. Check redirect URIs match your domains
3. Redeploy after updating OAuth settings

### MongoDB doesn't connect
1. Check MONGO_URI is correct with password
2. Verify Network Access is set to 0.0.0.0/0
3. Test connection string in MongoDB Atlas

---

## 📊 Deployment Status Checklist

- [ ] GitHub repository created and code pushed
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas cluster created
- [ ] Google OAuth credentials configured
- [ ] All environment variables set correctly
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Authentication works
- [ ] API calls return data
- [ ] All features tested in production

---

## 🔗 Important Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Google Cloud Console:** https://console.cloud.google.com
- **GitHub:** https://github.com/<your-username>/smartspend

---

## 📞 Need Help?

See these detailed guides:
- `DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- `DEPLOYMENT_CHECKLIST.md` - Full verification checklist
- `VERCEL_README.md` - Overview and tips

---

## ⏱️ Expected Timeline

- Setting up MongoDB: 5 minutes
- Configuring Google OAuth: 10 minutes
- Deploying backend: 5 minutes
- Deploying frontend: 5 minutes
- Testing: 10 minutes

**Total: ~35 minutes to production!** ✨

---

Good luck deploying! 🚀
