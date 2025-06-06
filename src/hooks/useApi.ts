
import { fetchTodos, TodoItem } from '@/services/api';
import { logger } from '@/services/logging/logger';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys (centralized for consistency)
export const queryKeys = {
  todos: ['todos'] as const,
  todo: (id: string) => ['todo', id] as const,
} as const;

// Todos query hook
export const useTodos = () => {
  return useQuery({
    queryKey: queryKeys.todos,
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mock mutation for adding todos
export const useAddTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTodo: Omit<TodoItem, 'id' | 'createdAt'>): Promise<TodoItem> => {
      logger.info('Adding new todo', { title: newTodo.title });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const todo: TodoItem = {
        ...newTodo,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      return todo;
    },
    onSuccess: (newTodo) => {
      logger.info('Todo added successfully', { id: newTodo.id });
      
      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.todos, (oldTodos: TodoItem[] | undefined) => {
        return oldTodos ? [...oldTodos, newTodo] : [newTodo];
      });
    },
    onError: (error) => {
      logger.error('Failed to add todo', { error });
    },
  });
};

// Mock mutation for updating todos
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedTodo: TodoItem): Promise<TodoItem> => {
      logger.info('Updating todo', { id: updatedTodo.id });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return updatedTodo;
    },
    onSuccess: (updatedTodo) => {
      logger.info('Todo updated successfully', { id: updatedTodo.id });
      
      // Update the cache
      queryClient.setQueryData(queryKeys.todos, (oldTodos: TodoItem[] | undefined) => {
        return oldTodos?.map(todo => 
          todo.id === updatedTodo.id ? updatedTodo : todo
        ) || [];
      });
    },
    onError: (error) => {
      logger.error('Failed to update todo', { error });
    },
  });
};
