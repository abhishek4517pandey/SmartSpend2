# SmartSpend Google OAuth - Visual Guide

## User Experience Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Journey                           │
└─────────────────────────────────────────────────────────────┘

                    [Visit SmartSpend]
                            ↓
                    [Click "Login"]
                            ↓
    ┌───────────────────────────────────────┐
    │  Login Page with Google Button        │
    │  ┌─────────────────────────────────┐  │
    │  │ [Sign in with Google]           │  │
    │  ├─────────────────────────────────┤  │
    │  │  Or continue with email         │  │
    │  │  ┌─────────────────────────────┐│  │
    │  │  │ Email: [______]             ││  │
    │  │  │ Password: [______]          ││  │
    │  │  │ [Login]                     ││  │
    │  │  └─────────────────────────────┘│  │
    │  └───────────────────────────────────┘  │
    └───────────────────────────────────────┘
                    ↓
        [User chooses method]
                    ↓
        ┌───────────────────┬──────────────────┐
        ↓                   ↓                  ↓
    [Google]          [Email/Password]    [Redirect to]
        ↓                   ↓                  [Google]
    [Accept                [Verify]           ↓
    permissions]           ↓                  [Google Auth
        ↓              [Authenticate]        ↓ Servers]
    [Send JWT           via Backend]     [Consent
    to Backend]             ↓            Screen]
        ↓              [Create JWT]          ↓
    [Backend          [Return to        [Allow]
    receives          Frontend]              ↓
    Google data]          ↓            [Return JWT]
        ↓          [Store in                 ↓
    [Check if      LocalStorage]        [Same flow
    user exists]        ↓               as Google
        ├─ YES   [Logged In]
        │             ↓
        │      ┌──────────────────┐
        │      │   Home Page      │
        │      │  ┌────────────┐  │
        │      │  │ [Profile   │  │
        │      │  │  Picture]  │  │
        │      │  │            │  │
        │      │  │ Name       │  │
        │      │  │ [Logout]   │  │
        │      │  └────────────┘  │
        │      └──────────────────┘
        │             ↓
        │      [Explore Dashboard]
        │
        └─ NO → [Create New User]
                  with Google data
                      ↓
                [Same as YES above]
```

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     GOOGLE CLOUD                             │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ Google OAuth 2.0 Server                             │   │
│   │ - User Authentication                              │   │
│   │ - JWT Token Generation                             │   │
│   │ - Profile Picture URL                              │   │
│   └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
        ↑                                    ↓
        │ (JWT Token)                   (1. Accept Permissions
        │                                2. Return JWT)
        │
┌───────────────────────────────────┐
│   Frontend (React/Vite)           │
│  ┌─────────────────────────────┐  │
│  │ Login/Register Page         │  │
│  │ ┌───────────────────────────┤  │
│  │ │ GoogleLogin Component     │  │
│  │ │ @react-oauth/google       │  │
│  │ └───────────────────────────┤  │
│  │                             │  │
│  │ ┌───────────────────────────┤  │
│  │ │ AuthContext               │  │
│  │ │ - Store user data         │  │
│  │ │ - Store JWT token         │  │
│  │ │ - Store profile picture   │  │
│  │ └───────────────────────────┤  │
│  │                             │  │
│  │ ┌───────────────────────────┤  │
│  │ │ Navbar                    │  │
│  │ │ - Display profile picture │  │
│  │ │ - Show user name          │  │
│  │ │ - Logout button           │  │
│  │ └───────────────────────────┤  │
│  └─────────────────────────────┘  │
│  (http://localhost:5173)          │
└───────────────────────────────────┘
        ↑                  ↓
        │ (JWT)         (3. POST to
        │              /api/auth/google)
        │
        │                ↓
        │    ┌────────────────────────────┐
        │    │  Backend (Node/Express)    │
        │    │  ┌──────────────────────┐  │
        │    │  │ authRoutes.js        │  │
        │    │  │ /api/auth/google     │  │
        │    │  ├──────────────────────┤  │
        │    │  │ 1. Verify Google JWT │  │
        │    │  │ 2. Extract user data │  │
        │    │  │ 3. Find/Create user  │  │
        │    │  │ 4. Generate app JWT  │  │
        │    │  └──────────────────────┤  │
        │    │                         │  │
        │    │  ┌──────────────────────┐  │
        │    │  │ MongoDB              │  │
        │    │  │ ┌────────────────┐   │  │
        │    │  │ │ User Model     │   │  │
        │    │  │ │ - name         │   │  │
        │    │  │ │ - email        │   │  │
        │    │  │ │ - googleId     │   │  │
        │    │  │ │ - profilePic   │   │  │
        │    │  │ │ - authProvider │   │  │
        │    │  │ └────────────────┘   │  │
        │    │  └──────────────────────┘  │
        │    └────────────────────────────┘
        │    (http://localhost:5000)
        │
        └────────────────(Return JWT + User)───────────────
```

## Data Flow Sequence

```
User                Frontend              Google            Backend
  │                   │                   │                  │
  │ Click "Sign in"   │                   │                  │
  ├──────────────────→│                   │                  │
  │                   │ Open Auth Window  │                  │
  │                   ├──────────────────→│                  │
  │                   │                   │ User Authenticates
  │                   │                   │                  │
  │                   │←──── JWT Token ────┤                 │
  │                   │                   │                  │
  │ Logged In         │ POST to /auth/google                │
  │←──────────────────┤───────────────────────────────────→│
  │                   │                   │ 1. Verify JWT   │
  │                   │                   │ 2. Extract Data │
  │                   │←─ JWT + User ─────────────────────┤
  │                   │                   │ 3. Save to DB   │
  │ Redirect Home     │                   │ 4. Create Token │
  │←──────────────────┤                   │                  │
  │                   │                   │                  │
```

## Component Tree

```
App
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   └── User Section
│       ├── Avatar (Google Profile Pic) ✨
│       ├── User Name
│       └── Logout Button
├── Login Page
│   ├── Hero Section
│   └── Login Card
│       ├── Google Login Button ✨
│       ├── "Or continue with email"
│       └── Email/Password Form
├── Register Page
│   ├── Hero Section
│   └── Register Card
│       ├── Google Register Button ✨
│       ├── "Or continue with email"
│       └── Registration Form
├── Dashboard
├── Expenses
├── Budget
├── Profile
└── Other Pages
```

## Database Schema

### User Collection (MongoDB)

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  name: String,                    // Required
  email: String,                   // Unique, Required
  
  // Authentication Methods
  authProvider: String,            // "local" or "google"
  passwordHash: String,            // Optional (null for Google users)
  googleId: String,                // Optional (only for Google users)
  
  // Profile
  profilePicture: String,          // URL to Google profile pic
  
  // Notifications
  notifications: {
    monthlyReport: Boolean,
    budgetAlerts: Boolean,
    budgetThreshold50: Boolean,
    budgetThreshold80: Boolean
  },
  
  lastMonthlyReportSent: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Setup

### Frontend (.env)
```
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
JWT_SECRET=your_secret_key_here
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Feature Matrix

| Feature | Email/Password | Google OAuth |
|---------|---|---|
| Login | ✅ | ✅ |
| Register | ✅ | ✅ |
| Profile Picture | Manual Upload | Auto from Google ✨ |
| Session Persistence | ✅ | ✅ |
| Account Linking | ❌ | ✅ (to email accounts) |
| Password Reset | ✅ | ❌ (use Google) |
| Two-Factor Auth | ❌ | ✅ (via Google) |
| Social Profile | ❌ | ✅ (auto-filled) |

---

**That's the complete flow! From user click to Google profile picture in navbar.** 🎉
