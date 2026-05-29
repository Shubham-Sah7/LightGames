# Next.js 16 + Clerk + Prisma Template

A production-ready Next.js template with authentication, database, and UI components pre-configured.

## 🚀 What's Included

### Core Stack
- **Next.js 16.2.6** - Latest Next.js with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first CSS framework

### Authentication
- **Clerk** - Complete authentication solution
  - Google OAuth (and other providers)
  - User management
  - Session handling
  - Protected routes

### Database
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Production database (Neon hosted)
- **Migrations** - Database version control

### UI Components
- **Shadcn/UI** - 55+ pre-built components
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library
- **Dark Mode** - Built-in theme switching

### Developer Experience
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Hot Reload** - Fast development

---

## 📋 Prerequisites

Before using this template, you need:

1. **Node.js 20+** installed
2. **PostgreSQL database** (we recommend [Neon](https://neon.tech) for free hosting)
3. **Clerk account** (free tier available at [clerk.com](https://clerk.com))

---

## 🛠️ Setup Instructions

### 1. Clone/Copy This Template

```bash
# Copy this entire directory to your new project
cp -r /path/to/this/template /path/to/your/new-project
cd /path/to/your/new-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create or update `.env` file:

```env
# Database (Get from Neon or your PostgreSQL provider)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Clerk Authentication (Get from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk Redirect URLs (Customize for your app)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

### 4. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Configure Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application (or use existing)
3. Copy your API keys to `.env`
4. Enable authentication providers:
   - Go to **User & Authentication** → **Social Connections**
   - Enable **Google** (or other providers)
   - Follow setup wizard

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (ClerkProvider here)
│   ├── page.tsx                 # Home page
│   ├── dashboard/               # Protected dashboard example
│   └── api/                     # API routes
├── components/
│   ├── ui/                      # Shadcn UI components (55+)
│   └── theme-provider.tsx       # Dark mode provider
├── lib/
│   ├── prisma.ts                # Prisma client instance
│   ├── utils.ts                 # Utility functions
│   └── generated/prisma/        # Generated Prisma client
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── proxy.ts                      # Clerk auth & route protection
├── .env                         # Environment variables
├── CLAUDE.md                    # AI assistant guidelines
└── package.json                 # Dependencies
```

---

## 🔐 Authentication Setup

### Basic Authentication Flow

1. **Home Page (`app/page.tsx`)**
   - Shows sign-in component for unauthenticated users
   - Redirects authenticated users to dashboard

2. **Dashboard (`app/dashboard/page.tsx`)**
   - Protected route (requires authentication)
   - Shows user-specific content

3. **Proxy (`proxy.ts`)**
   - Handles authentication checks
   - Manages redirects
   - Protects routes

### Customizing Authentication

**Add Public Routes:**
Edit `proxy.ts`:
```tsx
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',        // Add your public routes
  '/pricing',
])
```

**Change Redirect Behavior:**
Edit `proxy.ts`:
```tsx
// Example: Redirect to /app instead of /dashboard
if (userId && request.nextUrl.pathname === '/') {
  return NextResponse.redirect(new URL('/app', request.url))
}
```

**Get User Info in Server Components:**
```tsx
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId } = await auth()
  // Use userId for database queries
}
```

**Get User Info in Client Components:**
```tsx
'use client'
import { useUser } from '@clerk/nextjs'

export default function Component() {
  const { user } = useUser()
  return <div>Hello {user?.firstName}</div>
}
```

---

## 🗄️ Database Usage

### Prisma Schema

Edit `prisma/schema.prisma` to define your data models:

```prisma
model User {
  id        String   @id // Use Clerk userId
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

### Running Migrations

After changing schema:
```bash
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

### Using Prisma Client

```tsx
import { prisma } from '@/lib/prisma'

// Create
const user = await prisma.user.create({
  data: { id: userId, email: 'user@example.com' }
})

// Read
const users = await prisma.user.findMany()

// Update
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: 'New Name' }
})

// Delete
await prisma.user.delete({ where: { id: userId } })
```

---

## 🎨 UI Components

### Using Shadcn Components

All components are in `components/ui/`:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
```

### Adding New Components

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

### Dark Mode

Dark mode is pre-configured. Users can toggle with `d` key or add a toggle button:

```tsx
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables

Make sure to set all environment variables in your hosting platform:
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- All `NEXT_PUBLIC_CLERK_*` redirect URLs

### Recommended Hosting

- **Vercel** - Best for Next.js (zero config)
- **Netlify** - Great alternative
- **Railway** - Good for full-stack apps
- **Render** - Free tier available

---

## 🐛 Troubleshooting

### Redirect Loop (ERR_TOO_MANY_REDIRECTS)

**Problem:** Browser shows "too many redirects" error

**Solution:** Add your public routes to `proxy.ts`:
```tsx
const isPublicRoute = createRouteMatcher([
  '/',  // Make sure root is included!
  '/sign-in(.*)',
  '/sign-up(.*)',
])
```

### Database Connection Error

**Problem:** Can't connect to database

**Solution:**
1. Check `DATABASE_URL` in `.env`
2. Ensure database is running
3. Run `npx prisma migrate dev`

### Clerk Not Working

**Problem:** Authentication not working

**Solution:**
1. Check Clerk keys in `.env`
2. Verify `ClerkProvider` wraps your app in `app/layout.tsx`
3. Enable authentication providers in Clerk Dashboard

### Type Errors

**Problem:** TypeScript errors after schema changes

**Solution:**
```bash
npx prisma generate
npm run typecheck
```

### Build Errors

**Problem:** `npm run build` fails

**Solution:**
1. Fix all TypeScript errors: `npm run typecheck`
2. Fix all lint errors: `npm run lint`
3. Check for missing environment variables

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run typecheck        # Check TypeScript

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create & apply migration
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema (no migration)

# Components
npx shadcn@latest add <component>  # Add Shadcn component
```

---

## 📖 Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Shadcn/UI Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🤝 Working with AI Assistants

This template includes `CLAUDE.md` with comprehensive guidelines for AI assistants (like Claude, ChatGPT, etc.).

**Key points for AI:**
- Take full autonomy - run commands automatically
- Always verify changes with `npm run build`
- Fix issues immediately without asking
- Follow Clerk authentication patterns
- Use Prisma for all database operations
- Use Shadcn components for UI

---

## 📝 License

This template is free to use for any project (personal or commercial).

---

## 🎉 You're Ready!

This template is production-ready. Start building your app:

1. Customize `app/page.tsx` for your home page
2. Build features in `app/` directory
3. Add database models in `prisma/schema.prisma`
4. Use Shadcn components from `components/ui/`
5. Deploy when ready!

**Happy coding! 🚀**
