import { Category } from "@/@types/Category";
import { fetcher } from "@/api";
import useSWR from "swr";

export function useCategories() {
  const { data, ...rest } = useSWR<Array<Category>>("/categories", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    categories: data,
    ...rest,
  };
}
