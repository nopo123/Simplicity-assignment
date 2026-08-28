import api from "src/lib/lib";
import { CategoryType } from "src/types/category";

export const categoryApi = {
  getCategories: (): Promise<CategoryType[]> => api.get("/v1/categories"),
};
