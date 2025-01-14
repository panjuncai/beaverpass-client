export interface User {
  _id:string;
  email: string;
  isVerified:boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
