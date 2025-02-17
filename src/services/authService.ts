import { LoginRequest, RegisterRequest, User } from "@/types/user";
import apiClient from "@/api/api";

export const registerUser = async (data: RegisterRequest): Promise<User> => {
  try {
    const user: User = await apiClient.post(`/auth/register`, data);
    return user;
  } catch (e) {
    throw e;
  }
};

export const loginUser = async (data: LoginRequest): Promise<User> => {
  try {
    const user: User = await apiClient.post(`/auth/login`, data);
    return user;
  } catch (e) {
    throw e;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post(`/auth/logout`);
  } catch (e) {
    throw e;
  }
};
