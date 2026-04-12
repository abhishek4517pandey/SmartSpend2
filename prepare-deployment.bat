@echo off
REM SmartSpend Deployment Helper Script for Windows
REM This script helps you prepare your project for Vercel deployment

echo.
echo 🚀 SmartSpend Deployment Preparation
echo ====================================
echo.

REM Check if git is initialized
if not exist .git (
    echo ⚠️  Git not initialized. Initializing now...
    git init
    git config user.name "SmartSpend Developer"
    git config user.email "dev@smartspend.app"
) else (
    echo ✓ Git already initialized
)

REM Check if .gitignore exists
if not exist .gitignore (
    echo ✗ .gitignore not found. Please create one.
) else (
    echo ✓ .gitignore exists
)

REM Check backend .env.example
if not exist backend\.env.example (
    echo ✗ backend\.env.example not found
) else (
    echo ✓ backend\.env.example exists
)

REM Check frontend .env.example
if not exist Frontend\.env.example (
    echo ✗ Frontend\.env.example not found
) else (
    echo ✓ Frontend\.env.example exists
)

REM Check backend vercel.json
if not exist backend\vercel.json (
    echo ✗ backend\vercel.json not found
) else (
    echo ✓ backend\vercel.json exists
)

REM Check frontend vercel.json
if not exist Frontend\vercel.json (
    echo ✗ Frontend\vercel.json not found
) else (
    echo ✓ Frontend\vercel.json exists
)

echo.
echo Preparation Complete!
echo.
echo Next steps:
echo 1. Create actual .env files based on .env.example files
echo 2. Update environment variables in the files
echo 3. Test locally: npm run dev (in frontend and backend)
echo 4. Push to GitHub:
echo    git add .
echo    git commit -m "Ready for deployment"
echo    git push -u origin main
echo 5. Go to https://vercel.com and deploy!
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions ✨
echo.
pause
