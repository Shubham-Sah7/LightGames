'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { LogOut, Plus, Trash2 } from 'lucide-react'

type TodoProgress = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'

interface Todo {
  id: string
  task: string
  description: string | null
  progress: TodoProgress
  createdAt: Date
  updatedAt: Date
}

interface DashboardClientProps {
  initialTodos: Todo[]
}

export function DashboardClient({ initialTodos }: DashboardClientProps) {
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [task, setTask] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, description }),
      })

      if (response.ok) {
        const newTodo = await response.json()
        setTodos([newTodo, ...todos])
        setTask('')
        setDescription('')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProgress = async (id: string, progress: TodoProgress) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      })

      if (response.ok) {
        const updatedTodo = await response.json()
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id))
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const getProgressColor = (progress: TodoProgress) => {
    switch (progress) {
      case 'TODO':
        return 'bg-gray-500'
      case 'IN_PROGRESS':
        return 'bg-blue-500'
      case 'COMPLETED':
        return 'bg-green-500'
    }
  }

  const getProgressLabel = (progress: TodoProgress) => {
    switch (progress) {
      case 'TODO':
        return 'To Do'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'COMPLETED':
        return 'Completed'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Todo Dashboard</h1>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Add Todo Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create a new todo item to track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTodo} className="space-y-4">
                <div>
                  <Input
                    placeholder="What needs to be done?"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Add a description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  {isLoading ? 'Adding...' : 'Add Todo'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Todo List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Tasks ({todos.length})
            </h2>
            {todos.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No todos yet. Add your first task above!
                  </p>
                </CardContent>
              </Card>
            ) : (
              todos.map((todo) => (
                <Card key={todo.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {todo.task}
                        </h3>
                        {todo.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge className={getProgressColor(todo.progress)}>
                            {getProgressLabel(todo.progress)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={todo.progress}
                          onValueChange={(value) =>
                            handleUpdateProgress(todo.id, value as TodoProgress)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
