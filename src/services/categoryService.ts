import { Category } from "@/types/category";
import apiClient from "@/api/api";

export const getAllCategories = async (): Promise<Array<Category>> => {
  try {
    const categories: Array<Category> = await apiClient.get(`/categories/`);
    console.log(categories);
    return categories;
  } catch (e) {
    throw e;
  }
};
