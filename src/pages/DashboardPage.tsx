import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTodos, useAddTodo, useUpdateTodo } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Plus, CheckCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: todos, isLoading, error } = useTodos();
  const addTodoMutation = useAddTodo();
  const updateTodoMutation = useUpdateTodo();
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await addTodoMutation.mutateAsync({
        title: newTodoTitle.trim(),
        completed: false,
      });
      
      setNewTodoTitle('');
      toast({
        title: 'Todo added',
        description: 'Your new todo has been added successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to add todo',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    const todo = todos?.find(t => t.id === todoId);
    if (!todo) return;

    try {
      await updateTodoMutation.mutateAsync({
        ...todo,
        completed,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update todo',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  const completedCount = todos?.filter(todo => todo.completed).length || 0;
  const totalCount = todos?.length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's your personal dashboard with your todos and progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todo Management */}
      <Card>
        <CardHeader>
          <CardTitle>Your Todos</CardTitle>
          <CardDescription>
            Manage your tasks and track your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="flex gap-2">
            <Input
              placeholder="Add a new todo..."
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={addTodoMutation.isPending || !newTodoTitle.trim()}
            >
              {addTodoMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Plus size={16} />
              )}
            </Button>
          </form>

          {/* Todo List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Failed to load todos. Please try again.
            </div>
          ) : todos && todos.length > 0 ? (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) => 
                      handleToggleTodo(todo.id, checked as boolean)
                    }
                    disabled={updateTodoMutation.isPending}
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-900'
                    }`}
                  >
                    {todo.title}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No todos yet. Add your first todo above!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
