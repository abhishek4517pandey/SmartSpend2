#!/bin/bash
# SmartSpend Deployment Helper Script
# This script helps you prepare your project for Vercel deployment

echo "🚀 SmartSpend Deployment Preparation"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  Git not initialized. Initializing now...${NC}"
    git init
    git config user.name "SmartSpend Developer"
    git config user.email "dev@smartspend.app"
else
    echo -e "${GREEN}✓ Git already initialized${NC}"
fi

# Check if .gitignore exists
if [ ! -f .gitignore ]; then
    echo -e "${RED}✗ .gitignore not found. Please create one.${NC}"
else
    echo -e "${GREEN}✓ .gitignore exists${NC}"
fi

# Check backend .env.example
if [ ! -f backend/.env.example ]; then
    echo -e "${RED}✗ backend/.env.example not found${NC}"
else
    echo -e "${GREEN}✓ backend/.env.example exists${NC}"
fi

# Check frontend .env.example
if [ ! -f Frontend/.env.example ]; then
    echo -e "${RED}✗ Frontend/.env.example not found${NC}"
else
    echo -e "${GREEN}✓ Frontend/.env.example exists${NC}"
fi

# Check backend vercel.json
if [ ! -f backend/vercel.json ]; then
    echo -e "${RED}✗ backend/vercel.json not found${NC}"
else
    echo -e "${GREEN}✓ backend/vercel.json exists${NC}"
fi

# Check frontend vercel.json
if [ ! -f Frontend/vercel.json ]; then
    echo -e "${RED}✗ Frontend/vercel.json not found${NC}"
else
    echo -e "${GREEN}✓ Frontend/vercel.json exists${NC}"
fi

echo ""
echo -e "${GREEN}Preparation Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Create actual .env files based on .env.example files"
echo "2. Update environment variables in the files"
echo "3. Test locally: npm run dev (in frontend and backend)"
echo "4. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push -u origin main"
echo "5. Go to https://vercel.com and deploy!"
echo ""
echo "See DEPLOYMENT_GUIDE.md for detailed instructions ✨"
