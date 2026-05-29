# Next.js 16 + Clerk + Prisma Starter Template

A production-ready Next.js template with authentication, database, and 55+ UI components pre-configured. Perfect for building modern web applications quickly.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Clerk and database credentials

# 3. Set up database
npx prisma generate
npx prisma migrate dev

# 4. Start development server
npm run dev
```

**📖 For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## ✨ What's Included

- ✅ **Next.js 16** - Latest Next.js with App Router
- ✅ **Clerk Authentication** - Google OAuth ready
- ✅ **Prisma + PostgreSQL** - Type-safe database
- ✅ **55+ UI Components** - Shadcn/UI pre-installed
- ✅ **Dark Mode** - Built-in theme switching
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling

**📦 For complete feature list, see [WHATS_INCLUDED.md](WHATS_INCLUDED.md)**

---

## 📚 Documentation

### Getting Started
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup (5 minutes)
- **[TEMPLATE_README.md](TEMPLATE_README.md)** - Complete documentation
- **[TEMPLATE_CHECKLIST.md](TEMPLATE_CHECKLIST.md)** - Customization checklist

### For Developers
- **[CLAUDE.md](CLAUDE.md)** - AI assistant guidelines (comprehensive Clerk + Prisma patterns)
- **[WHATS_INCLUDED.md](WHATS_INCLUDED.md)** - Everything in this template
- **[.env.example](.env.example)** - Environment variable template

### Examples (can be deleted after setup)
- **[TODO_APP_SETUP.md](TODO_APP_SETUP.md)** - Todo app example
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Implementation details
- **[QUICK_START.md](QUICK_START.md)** - Todo app quick start

---

## 🔐 Authentication

Clerk is pre-configured with:
- ✅ Google OAuth (enable in Clerk dashboard)
- ✅ Protected routes via `proxy.ts`
- ✅ Sign-in/sign-up components
- ✅ User profile management
- ✅ Automatic redirects

**See [CLAUDE.md](CLAUDE.md) for complete Clerk integration guide**

---

## 🗄️ Database

Prisma is pre-configured with:
- ✅ PostgreSQL connection
- ✅ Type-safe queries
- ✅ Migration system
- ✅ Example models (User, Todo)
- ✅ Prisma Studio for data management

```bash
# Common commands
npx prisma generate      # Generate client
npx prisma migrate dev   # Create migration
npx prisma studio        # Open database GUI
```

---

## 🎨 UI Components

55+ Shadcn components ready to use:

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function Page() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  )
}
```

**Add more components:** `npx shadcn@latest add <component>`

---

## 🛠️ Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run typecheck    # Check TypeScript
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

---

## 📋 Prerequisites

- **Node.js 20+**
- **PostgreSQL database** (Neon recommended - free tier)
- **Clerk account** (free tier available)

---

## 🚀 Deployment

This template is ready to deploy to:
- **Vercel** (recommended - zero config)
- **Netlify**
- **Railway**
- **Render**

**Remember to set environment variables in your hosting platform!**

---

## 🐛 Troubleshooting

### Redirect Loop
Add public routes to `proxy.ts`:
```tsx
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])
```

### Database Connection Error
Check `DATABASE_URL` in `.env` and run:
```bash
npx prisma migrate dev
```

### Clerk Not Working
1. Verify keys in `.env`
2. Enable Google OAuth in Clerk Dashboard
3. Check `ClerkProvider` in `app/layout.tsx`

**For more help, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com)

---

## 🎯 Next Steps

1. ✅ Complete setup (see [SETUP_GUIDE.md](SETUP_GUIDE.md))
2. ✅ Customize `app/page.tsx` for your home page
3. ✅ Update `prisma/schema.prisma` with your models
4. ✅ Build your features in `app/` directory
5. ✅ Deploy when ready!

---

## 📝 License

Free to use for any project (personal or commercial).

---

## 🤝 Working with AI Assistants

This template includes comprehensive AI assistant guidelines in [CLAUDE.md](CLAUDE.md):
- Complete Clerk authentication patterns
- Prisma database patterns
- Common issues and solutions
- Best practices and conventions

**AI assistants: Read [CLAUDE.md](CLAUDE.md) first!**

---

## ✅ Template Status

- ✅ All dependencies installed
- ✅ TypeScript configured
- ✅ Clerk integrated
- ✅ Prisma configured
- ✅ UI components ready
- ✅ Dark mode working
- ✅ Build verified
- ✅ Production-ready

**Just add your API keys and start building!** 🚀

---

**Need help?** Check the documentation files or open an issue.
