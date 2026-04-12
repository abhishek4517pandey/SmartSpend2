# SmartSpend Deployment Checklist ✅

Use this checklist to ensure everything is ready for deployment to Vercel.

---

## 📋 Pre-Deployment Checklist

### Code & Repository
- [ ] All code is properly committed to GitHub
- [ ] No sensitive data in committed files
- [ ] `.env` files are in `.gitignore`
- [ ] `vercel.json` files created in both backend and frontend
- [ ] All dependencies are listed in `package.json`

### Frontend Preparation
- [ ] Build command works: `npm run build`
- [ ] No hardcoded `localhost` URLs (except in .env.example)
- [ ] All API calls use `VITE_API_URL` environment variable
- [ ] CSS and animations work in production mode
- [ ] Responsive design tested on mobile
- [ ] Light/Dark theme working properly

### Backend Preparation
- [ ] Server handles Vercel serverless environment
- [ ] CORS properly configured (not hardcoded to localhost)
- [ ] All routes tested and working
- [ ] Error handling in place
- [ ] Database connection works
- [ ] Environment variables properly loaded from `.env`

---

## 🔐 Secrets & Credentials

### Collect These Values

- [ ] **MongoDB Connection String:**
  ```
  mongodb+srv://user:password@cluster.mongodb.net/dbname
  ```
  
- [ ] **JWT Secret:**
  ```
  (32+ character random string)
  ```

- [ ] **Google OAuth Client ID:**
  ```
  (from Google Cloud Console)
  ```

- [ ] **Google OAuth Client Secret:**
  ```
  (from Google Cloud Console)
  ```

- [ ] **Gmail Account & App Password:**
  ```
  Email: 
  Password: (16-char app password)
  ```

- [ ] **Frontend Domain (will get after first deploy):**
  ```
  https://<your-frontend>.vercel.app
  ```

- [ ] **Backend Domain (will get after first deploy):**
  ```
  https://<your-backend>.vercel.app
  ```

**NEVER share or commit these values!**

---

## 🗄️ Database Setup

### MongoDB Atlas
- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Free cluster created
- [ ] Database user created with strong password
- [ ] Network access configured for `0.0.0.0/0`
- [ ] Connection string copied and saved securely
- [ ] Test database has at least one collection

### Database Collections (will be auto-created by Mongoose)
- [ ] users
- [ ] expenses
- [ ] budgets
- [ ] savinggoals
- [ ] profiles
- [ ] splitexpenses

---

## 🔐 Authentication Setup

### Google OAuth
- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created (Web Application)
- [ ] Authorized origins configured:
  - [ ] `http://localhost:5173`
  - [ ] `https://<frontend-domain>.vercel.app` (add after deployment)
- [ ] Authorized redirect URIs configured:
  - [ ] `http://localhost:5173/login`
  - [ ] `http://localhost:5173/dashboard`
  - [ ] `https://<frontend-domain>.vercel.app/login` (add after deployment)
  - [ ] `https://<backend-domain>.vercel.app/api/auth/google/callback`
- [ ] Client ID and Secret copied

### JWT
- [ ] Secret key generated (32+ characters)
- [ ] Stored securely in Vercel environment variables

---

## 🚀 Vercel Setup

### Backend Project
- [ ] Vercel account created
- [ ] Backend GitHub repository imported
- [ ] Root directory set to `backend`
- [ ] Environment variables configured:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `GMAIL_USER`
  - [ ] `GMAIL_PASSWORD`
  - [ ] `FRONTEND_URL` (update after frontend deployment)
  - [ ] `NODE_ENV` = `production`
- [ ] Deployment successful
- [ ] Backend URL copied

### Frontend Project
- [ ] Frontend GitHub repository imported
- [ ] Root directory set to `Frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables configured:
  - [ ] `VITE_API_URL` = backend URL
  - [ ] `VITE_GOOGLE_CLIENT_ID`
  - [ ] `VITE_APP_NAME` = `SmartSpend`
  - [ ] `VITE_APP_VERSION` = `1.0.0`
- [ ] Deployment successful
- [ ] Frontend URL copied

---

## 🔄 Post-Deployment Configuration

### Update Google OAuth (After Both Deployments)
- [ ] Add frontend domain to authorized origins
- [ ] Add frontend domain to authorized redirect URIs
- [ ] Add backend domain to authorized redirect URIs
- [ ] Update backend `FRONTEND_URL` environment variable with final domain

### Verify API Connectivity
- [ ] Visit backend health check: `https://<backend>.vercel.app/api/health`
- [ ] Should return: `{ "status": "healthy" }`

### Test Frontend
- [ ] Homepage loads
- [ ] Navigation works
- [ ] All pages are accessible
- [ ] Light/Dark mode toggles
- [ ] Animations are smooth

### Test Authentication
- [ ] Sign up with email works
- [ ] Google OAuth login works
- [ ] Logout works
- [ ] Protected routes redirect properly

### Test Features
- [ ] Add expense works
- [ ] View dashboard works
- [ ] Budget page works
- [ ] Split expenses work
- [ ] Profile updates work
- [ ] PDF export works

### Test Emails (if enabled)
- [ ] Email notifications send
- [ ] Format is correct
- [ ] Links in emails work

---

## 📱 Performance & Security

### Frontend Performance
- [ ] Page loads in under 3 seconds
- [ ] Images are optimized
- [ ] Bundle size is reasonable
- [ ] No console errors

### Backend Performance
- [ ] API responses under 1 second
- [ ] Database queries are optimized
- [ ] No memory leaks
- [ ] Handles concurrent requests

### Security
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] CORS properly configured
- [ ] Sensitive data not exposed
- [ ] JWT tokens valid
- [ ] Password hashing working
- [ ] No SQL injection vulnerabilities

---

## 📊 Monitoring

### Vercel Dashboard
- [ ] Build logs reviewed
- [ ] No deployment errors
- [ ] Analytics available
- [ ] Edge function usage acceptable

### MongoDB Atlas
- [ ] Storage within free tier limits (512MB)
- [ ] No connection issues
- [ ] Data is backing up properly
- [ ] Performance metrics acceptable

### Application Monitoring
- [ ] No errors in production
- [ ] API endpoints responding
- [ ] Database connections stable
- [ ] User authentication working

---

## 📚 Documentation

- [ ] Deployment guide (DEPLOYMENT_GUIDE.md) created
- [ ] README.md updated with production URLs
- [ ] API documentation available
- [ ] Environment variable examples provided

---

## ✅ Final Verification

- [ ] Frontend loads from production URL
- [ ] Backend API responds from production URL
- [ ] All integrations working
- [ ] User can complete full workflow:
  - [ ] Sign up
  - [ ] Log in
  - [ ] Add expenses
  - [ ] View dashboard
  - [ ] Create budget
  - [ ] Set saving goals
  - [ ] Log out

---

## 🎉 Deployment Complete!

Once all items are checked, your SmartSpend app is ready for production! 🚀

### Production URLs

**Frontend:** `https://<your-frontend>.vercel.app`

**Backend API:** `https://<your-backend>.vercel.app/api`

**Database:** MongoDB Atlas

---

## 📞 Support

If you encounter issues:
1. Check `DEPLOYMENT_GUIDE.md` troubleshooting section
2. Review Vercel build logs
3. Check MongoDB Atlas status
4. Verify environment variables
5. Check GitHub for unmerged changes

---

**Ready to launch? Go to Vercel and deploy!** ✨
