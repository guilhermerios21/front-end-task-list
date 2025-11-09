import { API_URL } from '../config';
import type {
  AuthResponse,
  RegisterData,
  LoginData,
  Task,
  TaskCreateData,
  TaskUpdateData,
  TaskStats,
  ApiError,
} from '../types';

// Helper para obter headers com autenticação
const getHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Helper para tratamento de resposta
const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      const error = await response.json();
      throw {
        message: error.message || 'Erro na requisição',
        status: response.status,
        errors: error.errors,
      } as ApiError;
    }
    throw {
      message: `Erro ${response.status}: ${response.statusText}`,
      status: response.status,
    } as ApiError;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return isJson ? response.json() : ({} as T);
};

// ==================== AUTH ====================

export const registerUser = async (userData: RegisterData): Promise<{ message?: string; user?: any; token?: string }> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  // Backend retorna 201 com { message, user }, sem token.
  return handleResponse(response);
};

export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });
  return handleResponse<AuthResponse>(response);
};

export const checkProtected = async (token: string): Promise<{ message: string; user: any }> => {
  const response = await fetch(`${API_URL}/protected`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

// ==================== TASKS ====================

export const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await handleResponse<{ message?: string; count?: number; tasks: Task[] }>(response);
  return data.tasks;
};

export const fetchTaskById = async (taskId: string, token: string): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await handleResponse<{ message?: string; task: Task }>(response);
  return data.task;
};

export const createTask = async (taskData: TaskCreateData, token: string): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(taskData),
  });
  return handleResponse<Task>(response);
};

export const updateTask = async (
  taskId: string,
  taskData: TaskUpdateData,
  token: string
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(taskData),
  });
  return handleResponse<Task>(response);
};

export const patchTask = async (
  taskId: string,
  taskData: Partial<TaskUpdateData>,
  token: string
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(taskData),
  });
  return handleResponse<Task>(response);
};

export const deleteTask = async (taskId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse<void>(response);
};

export const fetchTaskStats = async (token: string): Promise<TaskStats> => {
  const response = await fetch(`${API_URL}/tasks/stats`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await handleResponse<{ message?: string; stats: TaskStats }>(response);
  return data.stats;
};

// ==================== USERS (opcional, caso precise) ====================

export const fetchUsers = async (token: string): Promise<any[]> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const fetchUserById = async (userId: string, token: string): Promise<any> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const updateUser = async (userId: string, userData: any, token: string): Promise<any> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const deleteUser = async (userId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse<void>(response);
};
