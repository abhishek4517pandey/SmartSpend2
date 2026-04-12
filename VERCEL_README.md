# SmartSpend - Vercel Deployment Guide

## 🚀 Quick Start Deployment to Vercel

SmartSpend is ready to deploy to Vercel! Follow this guide to get your app live in minutes.

---

## 📋 What You Need

Before starting, gather these items:

1. **GitHub Account** - For code hosting
2. **Vercel Account** - Free at https://vercel.com
3. **MongoDB Atlas Account** - Free database at https://www.mongodb.com/cloud/atlas
4. **Google Cloud Account** - For OAuth at https://console.cloud.google.com
5. **Gmail Account** (optional) - For email notifications

---

## 🎯 Deployment Overview

SmartSpend consists of two separate Vercel projects:

```
SmartSpend Application
├── Frontend (React + Vite)
│   └── Deployed to: https://<your-frontend>.vercel.app
└── Backend (Node.js + Express)
    └── Deployed to: https://<your-backend>.vercel.app
```

---

## 📖 Complete Deployment Steps

### See `DEPLOYMENT_GUIDE.md` for detailed step-by-step instructions

This file includes:
- ✅ Step 1: Prepare code for GitHub
- ✅ Step 2: MongoDB Atlas setup
- ✅ Step 3: Google OAuth configuration
- ✅ Step 4: Backend deployment
- ✅ Step 5: Frontend deployment
- ✅ Step 6: Environment variables setup
- ✅ Step 7: Testing procedures
- ✅ Troubleshooting section

---

## ⚡ Quick Reference

### Essential Commands

```bash
# Prepare for deployment
./prepare-deployment.sh          # Linux/Mac
prepare-deployment.bat           # Windows

# Or manually:
git init
git add .
git commit -m "Ready for Vercel"
git push -u origin main
```

### Environment Variables

**Backend (Node.js):**
```
MONGO_URI = your-mongodb-connection-string
JWT_SECRET = your-jwt-secret
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
GMAIL_USER = your-email@gmail.com
GMAIL_PASSWORD = your-16-char-app-password
FRONTEND_URL = https://your-frontend.vercel.app
NODE_ENV = production
```

**Frontend (Vite):**
```
VITE_API_URL = https://your-backend.vercel.app/api
VITE_GOOGLE_CLIENT_ID = your-google-client-id
VITE_APP_NAME = SmartSpend
VITE_APP_VERSION = 1.0.0
```

---

## 📁 Project Structure

```
SmartSpend/
├── backend/
│   ├── server.js                 ← Main server file
│   ├── package.json
│   ├── vercel.json               ← Vercel config
│   ├── .env.example              ← Template env vars
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── services/
├── Frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json               ← Vercel config
│   ├── .env.example              ← Template env vars
│   └── dist/                      ← Built files
├── DEPLOYMENT_GUIDE.md            ← Detailed guide
├── DEPLOYMENT_CHECKLIST.md        ← Checklist
├── prepare-deployment.sh          ← Helper script
├── prepare-deployment.bat         ← Helper script (Windows)
└── .gitignore                     ← Security file
```

---

## ✅ Deployment Checklist

Use `DEPLOYMENT_CHECKLIST.md` to verify:
- Code is ready
- Secrets are configured
- Database is set up
- OAuth is configured
- All environment variables are set
- Tests pass
- Features work in production

---

## 🔐 Security Notes

⚠️ **NEVER commit `.env` files!**

Sensitive data (.env files) are automatically ignored by `.gitignore`. Only `.env.example` files should be in GitHub.

**Vercel Environment Variables:**
1. Go to Project Settings
2. Click "Environment Variables"
3. Add values here, NOT in code

---

## 🌐 Domain Setup (Optional)

To use a custom domain instead of vercel.app:

1. Register domain (GoDaddy, Namecheap, etc.)
2. Connect to Vercel in Project Settings
3. Update DNS records
4. Add domain to Google OAuth
5. Update environment variables

---

## 📊 File Summary

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete step-by-step deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Verification checklist for deployment |
| `backend/.env.example` | Backend environment variable template |
| `Frontend/.env.example` | Frontend environment variable template |
| `backend/vercel.json` | Backend Vercel configuration |
| `Frontend/vercel.json` | Frontend Vercel configuration |
| `prepare-deployment.sh` | Linux/Mac deployment helper |
| `prepare-deployment.bat` | Windows deployment helper |
| `.gitignore` | Git ignore configuration |

---

## 🚀 Start Deployment Now!

1. **Read** `DEPLOYMENT_GUIDE.md` completely
2. **Check** `DEPLOYMENT_CHECKLIST.md` to ensure everything is ready
3. **Set up** MongoDB, Google OAuth, and Gmail
4. **Deploy** both backend and frontend to Vercel
5. **Test** all features in production
6. **Celebrate** 🎉

---

## 💡 Tips for Success

✨ **Key Points:**

- Deploy **backend first**, get its URL
- Then deploy **frontend** with correct backend URL
- **Update Google OAuth** with final Vercel domains
- **Test API connectivity** before calling it production-ready
- **Monitor** error logs in Vercel dashboard
- **Keep .env files secure** - use Vercel environment variables

---

## 🆘 Need Help?

1. Check **Troubleshooting** section in `DEPLOYMENT_GUIDE.md`
2. Review **Vercel Build Logs** in dashboard
3. Check **MongoDB Atlas Status**
4. Verify **Environment Variables** are correct
5. Test **API endpoints** with curl or Postman

---

## 📚 Useful Resources

- **Vercel Documentation:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Google OAuth Guide:** https://developers.google.com/identity
- **Node.js Best Practices:** https://nodejs.org/en/docs

---

## 🎯 Common Issues & Solutions

### "Cannot connect to MongoDB"
→ Check MONGO_URI and Network Access settings

### "CORS blocking requests"
→ Update FRONTEND_URL in backend environment variables

### "Google OAuth fails"
→ Verify redirect URIs match Vercel domains

### "Build fails on Vercel"
→ Check build logs, ensure all dependencies are installed

---

## 📞 Production Support

Once deployed:

- **Monitor** error logs regularly
- **Backup** MongoDB regularly
- **Update** dependencies monthly
- **Test** new features before pushing to main

---

## 🎉 You're Ready!

Your SmartSpend app is production-ready. Follow the deployment guide and you'll be live in under an hour!

**Questions?** Open the deployment guide and follow the detailed instructions step by step.

Good luck! 🚀✨
