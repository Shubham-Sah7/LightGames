# 📋 Template Customization Checklist

Use this checklist when starting a new project from this template.

---

## 🎯 Before You Start

- [ ] Copy this entire directory to your new project location
- [ ] Initialize git (if not already): `git init`
- [ ] Create a new repository on GitHub/GitLab

---

## 🔧 Initial Setup

### 1. Dependencies
- [ ] Run `npm install`
- [ ] Verify installation completed without errors

### 2. Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Get PostgreSQL database URL (Neon recommended)
- [ ] Get Clerk API keys from dashboard
- [ ] Fill in all values in `.env`
- [ ] Verify `.env` is in `.gitignore` (it should be)

### 3. Database Setup
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify database connection works

### 4. Clerk Configuration
- [ ] Enable Google OAuth in Clerk Dashboard
- [ ] Configure allowed redirect URLs in Clerk
- [ ] Test sign-in flow works

### 5. Verification
- [ ] Run `npm run dev` - server starts without errors
- [ ] Run `npm run build` - build succeeds
- [ ] Run `npm run typecheck` - no type errors
- [ ] Test authentication flow (sign in/out)

---

## 🎨 Customization

### Project Identity
- [ ] Update `package.json` name and description
- [ ] Update `app/layout.tsx` metadata (title, description)
- [ ] Add your favicon to `app/favicon.ico`
- [ ] Update `README.md` with your project info

### Remove Example Code (if not needed)
- [ ] Delete `app/dashboard/` if you don't need it
- [ ] Delete `app/api/todos/` if you don't need it
- [ ] Update `prisma/schema.prisma` with your models
- [ ] Delete example documentation files:
  - [ ] `TODO_APP_SETUP.md`
  - [ ] `IMPLEMENTATION_SUMMARY.md`
  - [ ] `QUICK_START.md`
  - [ ] `TEMPLATE_CHECKLIST.md` (this file)

### Keep These Files
- [ ] Keep `CLAUDE.md` - helpful for AI assistants
- [ ] Keep `TEMPLATE_README.md` - reference documentation
- [ ] Keep `SETUP_GUIDE.md` - setup instructions
- [ ] Keep `.env.example` - for team members

---

## 🔐 Authentication Customization

### Redirect URLs
Edit `.env` to customize where users go:
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - after signing in
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - after signing up
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL` - after signing out

### Public Routes
Edit `proxy.ts` to add public routes:
- [ ] Add any public pages to `isPublicRoute` matcher
- [ ] Examples: `/about`, `/pricing`, `/blog`, etc.

### Protected Routes
Edit `proxy.ts` to customize protection:
- [ ] Update `isDashboardRoute` matcher for your protected routes
- [ ] Customize redirect logic if needed

---

## 🗄️ Database Customization

### Schema Design
- [ ] Plan your data models
- [ ] Edit `prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev --name your_migration_name`
- [ ] Run `npx prisma generate`

### User Model
- [ ] Decide if you need a User model in database
- [ ] If yes, use Clerk `userId` as the ID (not auto-generated)
- [ ] Add any custom user fields you need

---

## 🎨 UI Customization

### Theme & Colors
- [ ] Update Tailwind config if needed
- [ ] Customize color scheme in `app/globals.css`
- [ ] Test dark mode appearance

### Components
- [ ] Add any additional Shadcn components you need
- [ ] Create custom components in `components/`
- [ ] Remove unused UI components (optional)

### Layout
- [ ] Customize `app/layout.tsx` (header, footer, etc.)
- [ ] Add navigation components
- [ ] Add any global UI elements

---

## 📝 Content

### Home Page
- [ ] Customize `app/page.tsx` with your content
- [ ] Update sign-in page design if needed
- [ ] Add your branding/logo

### Dashboard/Protected Pages
- [ ] Create your main app pages
- [ ] Add navigation between pages
- [ ] Implement your core features

### API Routes
- [ ] Create API routes for your features
- [ ] Add proper error handling
- [ ] Add authentication checks

---

## 🚀 Deployment Preparation

### Code Quality
- [ ] Run `npm run lint` - fix all issues
- [ ] Run `npm run format` - format all code
- [ ] Run `npm run typecheck` - fix all type errors
- [ ] Run `npm run build` - ensure build succeeds

### Environment Variables
- [ ] Document all required env vars
- [ ] Set up env vars in hosting platform
- [ ] Test with production database

### Security
- [ ] Review all API routes for auth checks
- [ ] Verify protected routes are actually protected
- [ ] Check for any exposed secrets
- [ ] Review Clerk security settings

### Testing
- [ ] Test all authentication flows
- [ ] Test all main features
- [ ] Test on different browsers
- [ ] Test mobile responsiveness

---

## 📚 Documentation

### For Your Team
- [ ] Update README with project-specific info
- [ ] Document any custom setup steps
- [ ] Document environment variables
- [ ] Document deployment process

### For AI Assistants
- [ ] Update `CLAUDE.md` with project-specific guidelines
- [ ] Add any custom patterns or conventions
- [ ] Document any special requirements

---

## 🎯 Launch Checklist

### Pre-Launch
- [ ] All features implemented and tested
- [ ] No console errors or warnings
- [ ] Build succeeds without errors
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Authentication fully tested

### Deployment
- [ ] Choose hosting platform (Vercel recommended)
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Test production deployment
- [ ] Set up custom domain (if applicable)

### Post-Launch
- [ ] Monitor for errors
- [ ] Test all features in production
- [ ] Set up error tracking (optional)
- [ ] Set up analytics (optional)

---

## ✅ Final Verification

Before considering setup complete:

- [ ] `npm run dev` works without errors
- [ ] `npm run build` succeeds
- [ ] Can sign in with Google
- [ ] Protected routes are protected
- [ ] Database operations work
- [ ] All custom features work
- [ ] No TypeScript errors
- [ ] No console errors

---

## 🎉 You're Ready!

Once all items are checked, you're ready to start building your app!

**Delete this checklist file when you're done with setup.**

---

## 📞 Need Help?

- Check `TEMPLATE_README.md` for detailed documentation
- Check `SETUP_GUIDE.md` for setup instructions
- Check `CLAUDE.md` for AI assistant guidelines
- Check official docs (Next.js, Clerk, Prisma)

**Happy building! 🚀**
