export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  status?: string; // e.g., "pending" | "in_progress" | "completed"
  priority?: string; // e.g., "low" | "normal" | "urgent"
  dueDate?: string; // ISO string
  tags?: string[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TaskCreateData {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
