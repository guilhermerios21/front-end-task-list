export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id?: string;  // MongoDB
  id?: string;   // PostgreSQL
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: string; // ISO string
  tags?: string[];
  userId?: string;
  user_id?: string; // PostgreSQL pode usar snake_case
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // PostgreSQL pode usar snake_case
  updated_at?: string; // PostgreSQL pode usar snake_case
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
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: string;
  tags?: string[];
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: string;
  tags?: string[];
}

export interface TaskStats {
  total: number;
  byStatus: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
