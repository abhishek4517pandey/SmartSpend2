# Google OAuth Setup Guide for SmartSpend

## Overview
This guide will help you set up Google OAuth authentication for your SmartSpend application, allowing users to login and register with their Google account, and automatically display their Google profile picture in the navbar.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name: `SmartSpend`
4. Click "Create"
5. Wait for project to be created (usually 1-2 minutes)

## Step 2: Enable Google+ API

1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"
4. Wait for it to enable

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. You may be prompted to create a consent screen first:
   - Click "Configure Consent Screen"
   - Select "External" user type
   - Fill in the required fields:
     - **App name**: SmartSpend
     - **User support email**: your-email@gmail.com
     - **Developer contact**: your-email@gmail.com
   - Click "Save and Continue"
   - Skip optional scopes (click "Save and Continue")
   - Review and click "Back to Dashboard"

4. Now create the OAuth credential:
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Select "Web application"
   - Name: `SmartSpend Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:5173`
     - `http://localhost:5000`
   - Click "Create"

5. Copy your **Client ID** (you'll need this next)

## Step 4: Configure Frontend Environment

1. In the `Frontend` folder, create a `.env` file:

```bash
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_API_URL=http://localhost:5000/api
```

2. Replace `YOUR_CLIENT_ID_HERE` with the Client ID from Step 3

## Step 5: Backend Configuration

The backend is already configured to handle Google OAuth. Just make sure your `.env` file has:

```
JWT_SECRET=ChangeThisToASecureSecret
MONGO_URI=your_mongodb_connection_string
```

## Step 6: Start the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000`

### Terminal 2 - Start Frontend
```bash
cd Frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## Step 7: Test Google OAuth

1. Open `http://localhost:5173` in your browser
2. Click "Login" or "Register"
3. You should see a "Sign in with Google" button
4. Click it and authenticate with your Google account
5. You should be logged in and see your Google profile picture in the navbar

## Features Implemented

✅ **Google Login** - Users can login using their Google account
✅ **Google Registration** - New users can create account via Google
✅ **Profile Picture Display** - Google profile picture shows in navbar
✅ **Email & Password Support** - Traditional login still works
✅ **Auto User Creation** - First-time Google users get auto-created
✅ **Seamless Auth** - Profile picture persists across sessions

## Troubleshooting

### "clientId is not set" error
- Make sure `.env` file exists in `Frontend` folder with `VITE_GOOGLE_CLIENT_ID`
- Restart the frontend dev server after creating `.env`

### Profile picture not showing
- Clear browser cache and localStorage
- Make sure Google account has a profile picture set
- Check browser console for errors

### "Invalid Client ID" error
- Verify Client ID is correct (copy it again from Google Cloud Console)
- Make sure authorized origins include `http://localhost:5173`

### CORS errors
- Backend CORS is set to accept `http://localhost:5173`
- Make sure backend is running on `http://localhost:5000`

## Database Changes

The User model now includes:
- `googleId` - Google OAuth ID
- `profilePicture` - URL to Google profile picture
- `authProvider` - "local" or "google"

Old existing users will need to be migrated or can update their profile.

## Security Notes

1. **JWT Secret** - Change the default JWT_SECRET to something secure
2. **Google Client Secret** - Never expose your Client Secret (we're using the Client ID only, which is safe)
3. **CORS** - Update CORS origin to your production domain when deploying

## Next Steps for Production

1. Get a real domain name
2. Update Google OAuth redirect URIs to your domain
3. Update CORS origin to your domain
4. Use environment variables for all secrets
5. Deploy backend to a server (Heroku, AWS, etc.)
6. Deploy frontend to a CDN (Vercel, Netlify, etc.)
