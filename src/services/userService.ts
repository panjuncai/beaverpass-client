import { LoginRequest, RegisterRequest, User } from "@/types/user";
import apiClient from "@/utils/api";


export const registerUser = async (
  data: RegisterRequest
): Promise<User> => {
  try {
    const user:User = await apiClient.post(`/users/register`, data);
    return user;
  } catch (e) {
    throw e;
  }
};

export const loginUser = async (
  data: LoginRequest
): Promise<User> => {
  try {
    const user:User = await apiClient.post(`/users/login`, data);
    return user;
  } catch (e) {
    throw e;
  }
};
