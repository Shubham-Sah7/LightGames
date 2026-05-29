import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './dashboard-client'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  // Ensure user exists in database
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    // Create user if doesn't exist
    const clerkUser = await auth()
    await prisma.user.create({
      data: {
        id: userId,
        email: clerkUser.sessionClaims?.email as string || '',
        name: clerkUser.sessionClaims?.name as string || null,
      },
    })
  }

  // Fetch todos
  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return <DashboardClient initialTodos={todos} />
}
