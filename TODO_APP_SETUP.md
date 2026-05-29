# Todo App with Clerk Authentication

A full-stack todo application built with Next.js, Clerk authentication, and Prisma ORM.

## Features

✅ **Google Authentication** - Sign in with Google via Clerk
✅ **Protected Routes** - Automatic redirect to dashboard after login
✅ **Todo Management** - Create, update, and delete todos
✅ **Progress Tracking** - Track todo status (To Do, In Progress, Completed)
✅ **Database Persistence** - All data stored in PostgreSQL via Prisma
✅ **Logout Functionality** - Sign out and redirect to home page

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Authentication**: Clerk
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **UI Components**: shadcn/ui

## Setup Complete ✅

The following has been configured:

1. ✅ Prisma schema updated with User and Todo models
2. ✅ Database migrated and synced
3. ✅ Clerk authentication integrated
4. ✅ Middleware configured for route protection
5. ✅ Home page with Google sign-in
6. ✅ Dashboard with todo functionality
7. ✅ API routes for CRUD operations
8. ✅ Environment variables configured

## How to Use

### 1. Configure Clerk (Important!)

Before running the app, you need to enable Google OAuth in your Clerk dashboard:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **User & Authentication** → **Social Connections**
4. Enable **Google** provider
5. Follow Clerk's instructions to set up Google OAuth credentials

### 2. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 3. Application Flow

1. **Home Page (/)**: 
   - Shows Clerk sign-in component
   - Sign in with Google
   - Automatically redirects to dashboard after authentication

2. **Dashboard (/dashboard)**:
   - Protected route (requires authentication)
   - Add new todos with task name and description
   - View all your todos
   - Update todo progress (To Do → In Progress → Completed)
   - Delete todos
   - Logout button (redirects to home page)

3. **Automatic Redirects**:
   - Logged-in users accessing `/` → redirected to `/dashboard`
   - Non-authenticated users accessing `/dashboard` → redirected to `/`

## Database Schema

### User Model
```prisma
model User {
  id        String   @id // Clerk user ID
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}
```

### Todo Model
```prisma
model Todo {
  id          String       @id @default(cuid())
  task        String
  description String?
  progress    TodoProgress @default(TODO)
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum TodoProgress {
  TODO
  IN_PROGRESS
  COMPLETED
}
```

## API Routes

- `POST /api/todos` - Create a new todo
- `GET /api/todos` - Get all todos for authenticated user
- `PATCH /api/todos/[id]` - Update todo progress
- `DELETE /api/todos/[id]` - Delete a todo

## Environment Variables

Already configured in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- Clerk redirect URLs configured

## Troubleshooting

### "Sign in with Google" not working
- Make sure you've enabled Google OAuth in Clerk dashboard
- Check that your Clerk keys are correct in `.env`

### Database connection issues
- Verify `DATABASE_URL` in `.env` is correct
- Run `npx prisma migrate dev` to sync schema

### User not redirecting to dashboard
- Clear browser cookies and try again
- Check middleware configuration in `middleware.ts`

## Next Steps

You can now:
- Customize the UI styling
- Add more todo fields (due date, priority, tags)
- Add filtering and sorting
- Add todo categories or projects
- Implement todo sharing between users
