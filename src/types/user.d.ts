export interface User {
  id: string;
  email: string;
  user_metadata?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
    address?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
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
