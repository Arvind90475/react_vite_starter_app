
import { logger } from './logger';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// API utility functions (pure functions)
export const createApiError = (message: string, status: number, code?: string): ApiError => ({
  message,
  status,
  code,
});

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'message' in error && 'status' in error;
};

// HTTP client functions
export const createHeaders = (additionalHeaders: Record<string, string> = {}): Headers => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...additionalHeaders,
  });
  
  return headers;
};

export const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorText = await response.text();
    logger.error('API request failed', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    
    throw createApiError(
      errorText || `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }
  
  const data = await response.json();
  return {
    data,
    status: response.status,
  };
};

// Generic API functions
export const apiGet = async <T>(
  url: string,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  logger.debug('API GET request', { url });
  
  const response = await fetch(url, {
    method: 'GET',
    headers: createHeaders(headers),
  });
  
  return handleResponse<T>(response);
};

export const apiPost = async <T, B = unknown>(
  url: string,
  body?: B,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  logger.debug('API POST request', { url });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: createHeaders(headers),
    body: body ? JSON.stringify(body) : undefined,
  });
  
  return handleResponse<T>(response);
};

export const apiPut = async <T, B = unknown>(
  url: string,
  body?: B,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  logger.debug('API PUT request', { url });
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: createHeaders(headers),
    body: body ? JSON.stringify(body) : undefined,
  });
  
  return handleResponse<T>(response);
};

export const apiDelete = async <T>(
  url: string,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  logger.debug('API DELETE request', { url });
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: createHeaders(headers),
  });
  
  return handleResponse<T>(response);
};

// Mock data for demo
export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const mockTodos: TodoItem[] = [
  {
    id: '1',
    title: 'Learn React with TypeScript',
    completed: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Build modular architecture',
    completed: false,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Implement authentication',
    completed: false,
    createdAt: '2024-01-03T00:00:00Z',
  },
];

export const fetchTodos = async (): Promise<TodoItem[]> => {
  logger.info('Fetching todos');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockTodos;
};
