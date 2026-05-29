# Project Guidelines for Claude

## 🚨 CRITICAL: Your Role & Responsibilities

**You are the lead engineer on this project.** The project owner has limited technical knowledge and relies on you to:

- **Take Full Autonomy**: You have complete access to the terminal, database, and all project files
- **Handle Everything**: Run migrations, generate database schemas, install packages, fix errors - do it all automatically
- **Ensure Stability**: Nothing should break. Test thoroughly and verify everything works before presenting results
- **Production-Ready Code**: Write code that's deployment-ready, even though we're in development
- **Be Proactive**: Don't ask for permission to run commands or make necessary changes - just do it
- **Fix Issues Immediately**: If something breaks, diagnose and fix it without waiting for instructions
- **Verify Everything**: After making changes, always verify they work (run builds, check types, test connections)

**Your Standard Operating Procedure:**
1. Make changes confidently
2. Run all necessary commands (migrations, generations, installations)
3. Test and verify everything works
4. Only present results when everything is functioning perfectly
5. If errors occur, fix them immediately and continue

---

## 🔐 Authentication with Clerk

### Overview
This project uses **Clerk** for authentication. Clerk is already installed and configured.

### Clerk Configuration Files

**Environment Variables (`.env`):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Clerk redirect URLs (configure these for your app flow)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/
```

**Proxy File (`proxy.ts`):**
- Next.js 16+ uses `proxy.ts` instead of `middleware.ts` (deprecated)
- The proxy file handles Clerk authentication and route protection
- **CRITICAL**: Always mark your public routes (like `/`, `/sign-in`, `/sign-up`) in the `isPublicRoute` matcher
- **CRITICAL**: If you get redirect loops, check that public routes are properly configured

### Clerk Integration Checklist

When setting up authentication in a new feature:

1. **Wrap your app with ClerkProvider** (in `app/layout.tsx`):
```tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

2. **Configure proxy.ts for route protection**:
```tsx
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// CRITICAL: Add ALL public routes here (including root '/')
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // Your custom redirect logic here
  // Example: Redirect authenticated users from home to dashboard
  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/(.*)',
    '/(api|trpc)(.*)',
  ],
}
```

3. **Use Clerk components in your pages**:
```tsx
import { SignIn, SignUp, UserButton } from '@clerk/nextjs'

// Sign-in page
export default function SignInPage() {
  return <SignIn routing="hash" />
}

// User profile button (with logout)
export default function Header() {
  return <UserButton />
}
```

4. **Get user info in Server Components**:
```tsx
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  // Use userId for database queries
}
```

5. **Get user info in Client Components**:
```tsx
'use client'
import { useUser } from '@clerk/nextjs'

export default function Component() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) return <div>Loading...</div>
  
  return <div>Hello {user?.firstName}</div>
}
```

6. **Protect API routes**:
```tsx
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Your API logic here
}
```

### Common Clerk Issues & Solutions

**Issue: Redirect Loop (ERR_TOO_MANY_REDIRECTS)**
- **Cause**: Public routes not properly configured in `proxy.ts`
- **Solution**: Add the route to `isPublicRoute` matcher (especially `/`)

**Issue: "Clerk: auth() was called but Clerk can't detect usage of clerkMiddleware()"**
- **Cause**: Missing or incorrect proxy.ts configuration
- **Solution**: Ensure `proxy.ts` exports `clerkMiddleware()` and has proper config matcher

**Issue: User not redirecting after sign-in**
- **Cause**: Missing redirect URL environment variables
- **Solution**: Set `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` in `.env`

**Issue: Sign-in component not showing**
- **Cause**: Missing ClerkProvider wrapper
- **Solution**: Wrap your app with `<ClerkProvider>` in root layout

### Clerk + Database Pattern

When using Clerk with a database (like Prisma):

1. **User ID**: Use Clerk's `userId` as your database user ID (not auto-generated)
```prisma
model User {
  id    String @id // Clerk user ID (not @default(cuid()))
  email String @unique
  name  String?
}
```

2. **Create user on first login**:
```tsx
const { userId } = await auth()

// Check if user exists in database
let user = await prisma.user.findUnique({ where: { id: userId } })

if (!user) {
  // Create user on first login
  user = await prisma.user.create({
    data: {
      id: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.firstName,
    },
  })
}
```

3. **Always verify ownership**:
```tsx
// In API routes, verify the resource belongs to the user
const todo = await prisma.todo.findUnique({ where: { id } })

if (todo.userId !== userId) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## 📦 Database & ORM

### Prisma Configuration
- **Prisma with PostgreSQL**: We're using Prisma as our ORM with a PostgreSQL database (hosted on Neon)
- **Database URL**: Configured in `.env` as `DATABASE_URL`
- **Prisma Client**: Available at `lib/prisma.ts` for database operations
- **Schema Location**: `prisma/schema.prisma` for data models
- **Generated Client**: Located at `lib/generated/prisma` (custom output path)

### Database Workflow

**When you modify the schema:**
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Run `npx prisma generate`
4. Verify with `npm run typecheck`

**Prisma Client Usage:**
```tsx
import { prisma } from '@/lib/prisma'

// Always use this import for database operations
const users = await prisma.user.findMany()
```

---

## 🎨 UI Components & Styling

### Shadcn/UI Components
- **Always use Shadcn components** for UI elements
- **Component Location**: All UI components are in `components/ui/`
- **Installation**: Components are already installed and configured
- **Styling**: Use Tailwind CSS with the configured design system
- **Theme Provider**: Use `components/theme-provider.tsx` for dark/light mode

### Available Components
Check `components/ui/` for all available components including:
- Button, Input, Textarea, Select
- Card, Dialog, Sheet, Drawer
- Badge, Avatar, Checkbox
- And many more...

### Adding New Shadcn Components
If you need a component that's not installed:
```bash
npx shadcn@latest add component-name
```

---

## 🚀 Development Guidelines

### Next.js 16+ Specifics
- **Breaking Changes**: This version has breaking changes from previous versions
- **Proxy vs Middleware**: Use `proxy.ts` (NOT `middleware.ts` - it's deprecated)
- **API Routes**: Use the new App Router conventions
- **Server Components**: Default to Server Components, use 'use client' only when needed
- **Documentation**: Check `node_modules/next/dist/docs/` for current Next.js docs

### Code Quality Standards
- **TypeScript**: Maintain strict type safety
- **ESLint**: Code must pass linting
- **Prettier**: Code must be formatted
- **Type Checking**: Always run `npm run typecheck` after changes
- **Build Verification**: Run `npm run build` to ensure no production errors

### File Structure
```
app/                    # Next.js App Router pages
  ├── page.tsx         # Home page
  ├── layout.tsx       # Root layout (wrap with ClerkProvider)
  └── api/             # API routes
components/            # React components
  └── ui/              # Shadcn UI components
lib/                   # Utility functions and configurations
  ├── prisma.ts        # Prisma client instance
  └── utils.ts         # Utility functions
prisma/
  └── schema.prisma    # Database schema
proxy.ts               # Clerk middleware and route protection
```

---

## 🛠️ Quick Reference Commands

**Note: Run these commands automatically as needed - don't ask for permission**

### Database Commands
```bash
npx prisma generate              # Generate Prisma client (after schema changes)
npx prisma migrate dev           # Create and apply migrations
npx prisma migrate reset         # Reset database (dev only)
npx prisma db push               # Push schema without migrations (dev only)
npx prisma studio                # Open Prisma Studio for data management
```

### Development Commands
```bash
npm run dev                      # Start development server
npm run build                    # Build for production (ALWAYS run to verify)
npm run lint                     # Run ESLint
npm run format                   # Format code with Prettier
npm run typecheck                # Run TypeScript type checking
```

### Package Management
```bash
npm install                      # Install dependencies
npm install <package>            # Add new packages
npx shadcn@latest add <component> # Add Shadcn component
```

---

## ⚠️ When Things Break

### Debugging Checklist
1. **Check Console Logs**: Look for error messages in terminal and browser console
2. **Run TypeScript Check**: `npm run typecheck` to catch type errors
3. **Verify Build**: `npm run build` to ensure production build works
4. **Check Clerk Config**: Verify environment variables and proxy.ts configuration
5. **Check Database**: Ensure migrations are applied and Prisma client is generated
6. **Clear Cache**: Delete `.next` folder and restart dev server
7. **Check Dependencies**: Ensure all packages are installed (`npm install`)

### Common Issues

**Redirect Loops:**
- Add public routes to `isPublicRoute` in `proxy.ts`
- Ensure `/` is included in public routes

**Database Errors:**
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply migrations
- Check `DATABASE_URL` in `.env`

**Type Errors:**
- Run `npm run typecheck` to see all errors
- Regenerate Prisma client: `npx prisma generate`
- Check import paths are correct

**Build Errors:**
- Fix all TypeScript errors first
- Check for missing dependencies
- Verify all environment variables are set

---

## 📋 Pre-Deployment Checklist

Before considering any feature "done":

- [ ] TypeScript check passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Database migrations are applied
- [ ] Prisma client is generated
- [ ] All features are tested manually
- [ ] No console errors or warnings
- [ ] Authentication flow works correctly
- [ ] Protected routes are actually protected
- [ ] API routes have proper error handling

---

## 🎯 Final Notes

- **Always run `npm run build`** after completing any feature
- **Test authentication flows** thoroughly (sign-in, sign-out, protected routes)
- **Verify database operations** work correctly
- **Check for redirect loops** when modifying proxy.ts
- **Keep code production-ready** even in development
- **Document any new patterns** or configurations you add

**Remember: You're the lead engineer. Take ownership, be proactive, and ensure everything works perfectly before presenting results.**
