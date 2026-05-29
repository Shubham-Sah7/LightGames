import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { progress } = body

    // Verify todo belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })

    if (!existingTodo || existingTodo.userId !== userId) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: { progress },
    })

    return NextResponse.json(todo)
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify todo belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    })

    if (!existingTodo || existingTodo.userId !== userId) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    await prisma.todo.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
