export interface User {
  id: string;
  username: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}
