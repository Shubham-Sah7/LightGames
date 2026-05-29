/**
 * Example usage of Prisma Client
 * 
 * This file demonstrates how to use the Prisma client in your application.
 * You can import `prisma` from './prisma' and use it to interact with your database.
 */

import { prisma } from './prisma'

// Example: Create a new user (with Clerk ID)
export async function createUser(id: string, email: string, name?: string) {
  const user = await prisma.user.create({
    data: {
      id, // Clerk user ID
      email,
      name,
    },
  })
  return user
}

// Example: Get all users
export async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      todos: true, // Include related todos
    },
  })
  return users
}

// Example: Get a user by email
export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      todos: true,
    },
  })
  return user
}

// Example: Create a todo for a user
export async function createTodo(
  userId: string,
  task: string,
  description?: string
) {
  const todo = await prisma.todo.create({
    data: {
      task,
      description,
      userId,
    },
  })
  return todo
}

// Example: Get all todos for a user
export async function getUserTodos(userId: string) {
  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return todos
}

// Example: Update a todo's progress
export async function updateTodoProgress(
  id: string,
  progress: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
) {
  const todo = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      progress,
    },
  })
  return todo
}

// Example: Delete a todo
export async function deleteTodo(id: string) {
  const todo = await prisma.todo.delete({
    where: {
      id,
    },
  })
  return todo
}

// Example: Update a user
export async function updateUser(id: string, data: { name?: string; email?: string }) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  })
  return user
}

// Example: Delete a user (will cascade delete their todos)
export async function deleteUser(id: string) {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  })
  return user
}
