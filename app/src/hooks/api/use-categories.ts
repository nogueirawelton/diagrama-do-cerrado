import { Category } from "@/@types/Category";
import useSWR from "swr";

export function useCategories() {
  const { data, ...rest } = useSWR<Array<Category>>("/categories");

  return {
    categories: data,
    ...rest,
  };
}
