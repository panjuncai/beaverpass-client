export interface User {
  _id:string;
  email: string;
  firstName:string;
  lastName:string;
  avatar?:string;
  isVerified:boolean;
}

export interface RegisterRequest {
  email: string;
  firstName:string;
  lastName:string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
