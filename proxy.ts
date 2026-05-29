/**
 * Clerk Authentication Proxy (Next.js 16+)
 * 
 * IMPORTANT: Next.js 16+ uses proxy.ts instead of middleware.ts
 * 
 * This file handles:
 * - Authentication with Clerk
 * - Route protection
 * - Custom redirects based on auth state
 * 
 * CRITICAL: Always add public routes to isPublicRoute matcher to avoid redirect loops
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Define public routes that don't require authentication
 * CRITICAL: Include '/' (root) and all sign-in/sign-up routes
 * 
 * Add any other public routes here (e.g., '/about', '/pricing', '/blog')
 */
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/rain-drop-cleanse(.*)',
  '/gratitude-tree(.*)',
  '/cloud-drift(.*)',
  '/lantern-release(.*)',
  '/firefly-catcher(.*)',
])

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // Redirect unauthenticated users away from dashboard
  if (!userId && isDashboardRoute(request)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

/**
 * Matcher Configuration
 * 
 * Defines which routes this proxy should run on
 * Default configuration covers most use cases
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/(.*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
