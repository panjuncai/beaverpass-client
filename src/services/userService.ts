import { RegisterRequest, User } from "@/types/user";
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
