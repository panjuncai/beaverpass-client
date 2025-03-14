export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  address?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
  };
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
