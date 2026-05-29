# Quick Start Guide 🚀

## Prerequisites

Before running the app, you need to enable Google OAuth in Clerk:

### Enable Google OAuth in Clerk Dashboard

1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Select your application (equal-moth-87)
3. Click **User & Authentication** in the sidebar
4. Click **Social Connections**
5. Find **Google** and toggle it ON
6. Follow the setup wizard to configure Google OAuth

## Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What You'll See

### 1. Home Page (/)
- Beautiful sign-in page with Clerk authentication
- "Sign in with Google" button
- After signing in, you'll be automatically redirected to the dashboard

### 2. Dashboard (/dashboard)
- **Add New Task** section at the top
  - Enter task name (required)
  - Add description (optional)
  - Click "Add Todo" button

- **Your Tasks** section below
  - See all your todos in card format
  - Each card shows:
    - Task name
    - Description (if provided)
    - Progress badge (color-coded)
    - Creation date
    - Progress dropdown (change status)
    - Delete button

- **User Menu** (top right)
  - Click your profile picture
  - Click "Sign out" to logout
  - You'll be redirected back to the home page

## Features to Try

1. **Create a Todo**
   - Add "Buy groceries" with description "Milk, eggs, bread"
   - Click Add Todo

2. **Update Progress**
   - Click the dropdown next to a todo
   - Change from "To Do" → "In Progress" → "Completed"
   - Watch the badge color change

3. **Delete a Todo**
   - Click the red trash icon
   - Todo is removed immediately

4. **Logout and Login**
   - Click your profile picture → Sign out
   - You'll be redirected to home page
   - Sign in again
   - All your todos are still there! (stored in database)

## Progress States

- 🔵 **To Do** (Gray badge) - Not started yet
- 🟡 **In Progress** (Blue badge) - Currently working on it
- 🟢 **Completed** (Green badge) - Done!

## Troubleshooting

### Can't sign in with Google?
- Make sure you enabled Google OAuth in Clerk dashboard (see Prerequisites above)
- Clear your browser cache and try again

### Not redirecting to dashboard?
- Check that you're signed in (look for profile picture in top right)
- Try manually navigating to `/dashboard`

### Todos not saving?
- Check browser console for errors
- Verify database connection in `.env` file

## That's It! 🎉

You now have a fully functional todo app with:
- ✅ Google authentication
- ✅ Protected routes
- ✅ Database persistence
- ✅ Real-time updates
- ✅ Beautiful UI

Enjoy managing your tasks!
