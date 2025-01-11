import axios from "axios";
import { RegisterRequest,User } from "@/types/user";

const API_URI=import.meta.env.VITE_API_URI;
export const registerUser=async (data:RegisterRequest):Promise<User>=>{
    const response =await axios.post(`${API_URI}/users/register`,data);
    return response.data;
}