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

// ==================== HELPERS ====================

// Normaliza IDs entre MongoDB (_id) e PostgreSQL (id)
const normalizeTask = (task: any): Task => {
  return {
    ...task,
    _id: task._id || task.id, // Prioriza _id (MongoDB), fallback para id (PostgreSQL)
    id: task.id || task._id,  // Garante que ambos existam
    userId: task.userId || task.user_id, // Normaliza user_id para userId
    createdAt: task.createdAt || task.created_at, // Normaliza created_at para createdAt
    updatedAt: task.updatedAt || task.updated_at, // Normaliza updated_at para updatedAt
  };
};

const normalizeUser = (user: any): any => {
  return {
    ...user,
    _id: user._id || user.id,
    id: user.id || user._id,
    createdAt: user.createdAt || user.created_at,
    updatedAt: user.updatedAt || user.updated_at,
  };
};

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
  const data = await handleResponse<{ message?: string; user?: any; token?: string }>(response);
  if (data.user) {
    data.user = normalizeUser(data.user);
  }
  return data;
};

export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse<AuthResponse>(response);
  if (data.user) {
    data.user = normalizeUser(data.user);
  }
  return data;
};

export const checkProtected = async (token: string): Promise<{ message: string; user: any }> => {
  const response = await fetch(`${API_URL}/protected`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await handleResponse<{ message: string; user: any }>(response);
  if (data.user) {
    data.user = normalizeUser(data.user);
  }
  return data;
};

// ==================== TASKS ====================

export const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await handleResponse<{ message?: string; count?: number; tasks: Task[] }>(response);
  return data.tasks.map(normalizeTask);
};

export const fetchTaskById = async (taskId: string, token: string): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await handleResponse<{ message?: string; task: Task }>(response);
  return normalizeTask(data.task);
};

export const createTask = async (taskData: TaskCreateData, token: string): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(taskData),
  });
  const task = await handleResponse<Task>(response);
  return normalizeTask(task);
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
  const task = await handleResponse<Task>(response);
  return normalizeTask(task);
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
  const task = await handleResponse<Task>(response);
  return normalizeTask(task);
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
  const users = await handleResponse<any[]>(response);
  return users.map(normalizeUser);
};

export const fetchUserById = async (userId: string, token: string): Promise<any> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const user = await handleResponse<any>(response);
  return normalizeUser(user);
};

export const updateUser = async (userId: string, userData: any, token: string): Promise<any> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(userData),
  });
  const user = await handleResponse<any>(response);
  return normalizeUser(user);
};

export const deleteUser = async (userId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse<void>(response);
};
