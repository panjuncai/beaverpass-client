import { LoginRequest, RegisterRequest, User } from "@/types/user";
import apiClient from "@/api/api";

export const registerUser = async (data: RegisterRequest): Promise<User> => {
  const user: User = await apiClient.post(`/auth/register`, data);
  return user;
};

export const loginUser = async (data: LoginRequest): Promise<User> => {
  const user: User = await apiClient.post(`/auth/login`, data);
  return user;
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post(`/auth/logout`);
};
