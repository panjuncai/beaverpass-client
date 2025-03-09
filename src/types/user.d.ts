export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}


export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
