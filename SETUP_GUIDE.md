# 🚀 Quick Setup Guide

Follow these steps to get your project running in 5 minutes.

---

## Step 1: Install Dependencies

```bash
npm install
```

**Expected output:** All packages installed successfully

---

## Step 2: Set Up Environment Variables

### Option A: Copy from example
```bash
cp .env.example .env
```

### Option B: Create manually
Create a `.env` file in the root directory with:

```env
DATABASE_URL=your_database_url_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

---

## Step 3: Get Database URL

### Recommended: Neon (Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free)
3. Create a new project
4. Copy the connection string
5. Paste it as `DATABASE_URL` in `.env`

**Example:**
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## Step 4: Get Clerk Keys

### Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com)
2. Sign up (free)
3. Create a new application
4. Go to **API Keys** in the sidebar
5. Copy both keys:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`
6. Paste them in `.env`

**Example:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZXF1YWwtbW90aC04Ny5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_BrePSHyV4fQypY7jzRlIjCohWbxz4hYOsXsmNLRINB
```

### Enable Google Sign-In (Important!)

1. In Clerk Dashboard, go to **User & Authentication**
2. Click **Social Connections**
3. Toggle **Google** to ON
4. Follow the setup wizard
5. Save changes

---

## Step 5: Set Up Database

Run these commands to create your database tables:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) View your database
npx prisma studio
```

**Expected output:**
- ✅ Prisma client generated
- ✅ Migration applied successfully
- ✅ Database is ready

---

## Step 6: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 16.2.6
- Local:        http://localhost:3002
- Ready in 2.3s
```

---

## Step 7: Test Your App

1. Open [http://localhost:3002](http://localhost:3002)
2. You should see the sign-in page
3. Click "Sign in with Google"
4. After signing in, you'll be redirected to the dashboard

---

## ✅ Verification Checklist

Make sure everything works:

- [ ] `npm install` completed without errors
- [ ] `.env` file exists with all required variables
- [ ] Database connection works (Prisma commands succeed)
- [ ] Clerk keys are valid (no auth errors)
- [ ] Google sign-in is enabled in Clerk
- [ ] Dev server starts without errors
- [ ] Can access home page
- [ ] Can sign in with Google
- [ ] Redirects to dashboard after sign-in
- [ ] Can sign out

---

## 🐛 Common Issues

### Issue: "Can't connect to database"

**Solution:**
- Check `DATABASE_URL` in `.env`
- Make sure database is running (if self-hosted)
- For Neon: Check if project is active

### Issue: "Clerk authentication not working"

**Solution:**
- Verify Clerk keys in `.env`
- Check if Google OAuth is enabled in Clerk Dashboard
- Clear browser cookies and try again

### Issue: "Redirect loop" (ERR_TOO_MANY_REDIRECTS)

**Solution:**
- This is already fixed in `proxy.ts`
- If it happens, check that `/` is in `isPublicRoute` matcher

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Prisma client not found"

**Solution:**
```bash
npx prisma generate
```

---

## 🎯 Next Steps

Now that your app is running:

1. **Customize the home page**: Edit `app/page.tsx`
2. **Add database models**: Edit `prisma/schema.prisma`
3. **Build features**: Create new pages in `app/` directory
4. **Add UI components**: Use components from `components/ui/`
5. **Read the docs**: Check `TEMPLATE_README.md` for detailed info

---

## 📚 Helpful Resources

- **Template Documentation**: `TEMPLATE_README.md`
- **AI Assistant Guide**: `CLAUDE.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Clerk Docs**: https://clerk.com/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## 🆘 Need Help?

If you're stuck:

1. Check the troubleshooting section above
2. Read `TEMPLATE_README.md` for detailed documentation
3. Check browser console for error messages
4. Check terminal for error messages
5. Verify all environment variables are set correctly

---

## 🎉 You're All Set!

Your development environment is ready. Start building your app!

```bash
npm run dev
```

**Happy coding! 🚀**
