#!/bin/bash

echo "🔍 Checking Deployment Readiness..."
echo ""

# Check if build works
echo "1️⃣ Testing build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed"
    exit 1
fi

# Check if .env exists
echo ""
echo "2️⃣ Checking environment variables..."
if [ -f .env ]; then
    echo "   ✅ .env file exists"
    
    # Check for required variables
    if grep -q "DATABASE_URL" .env; then
        echo "   ✅ DATABASE_URL found"
    else
        echo "   ❌ DATABASE_URL missing"
    fi
    
    if grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env; then
        echo "   ✅ Clerk keys found"
    else
        echo "   ❌ Clerk keys missing"
    fi
else
    echo "   ❌ .env file not found"
fi

# Check if git is up to date
echo ""
echo "3️⃣ Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
    echo "   ✅ All changes committed"
else
    echo "   ⚠️  Uncommitted changes found"
fi

# Check if pushed to remote
echo ""
echo "4️⃣ Checking remote sync..."
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
if [ $LOCAL = $REMOTE ]; then
    echo "   ✅ Pushed to GitHub"
else
    echo "   ⚠️  Not pushed to GitHub"
fi

# Check package.json scripts
echo ""
echo "5️⃣ Checking package.json..."
if grep -q "prisma generate" package.json; then
    echo "   ✅ Prisma generate in build script"
else
    echo "   ❌ Prisma generate missing from build script"
fi

if grep -q "postinstall" package.json; then
    echo "   ✅ Postinstall script exists"
else
    echo "   ❌ Postinstall script missing"
fi

# Check vercel.json
echo ""
echo "6️⃣ Checking Vercel configuration..."
if [ -f vercel.json ]; then
    echo "   ✅ vercel.json exists"
else
    echo "   ⚠️  vercel.json not found (optional)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Find your project 'app'"
echo "3. Settings → Git → Connect to GitHub"
echo "4. Select: Shubham-Sah7/LightGames"
echo "5. Settings → Environment Variables → Add:"
echo "   - DATABASE_URL"
echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
echo "   - CLERK_SECRET_KEY"
echo "   - All NEXT_PUBLIC_CLERK_* variables"
echo "6. Deployments → Redeploy"
echo "7. Wait 2-3 minutes"
echo "8. Test: https://app-topaz-seven-83.vercel.app/rain-drop-cleanse"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
