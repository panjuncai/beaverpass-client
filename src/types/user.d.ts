export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  address?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
}
