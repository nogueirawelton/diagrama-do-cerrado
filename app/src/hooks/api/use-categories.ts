import { Category } from "@/@types/Category";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export function useCategories() {
  const { data: session } = useSession();

  const { data, ...rest } = useSWR<Array<Category>>(
    session ? ["/categories", session?.access_token] : null,
  );

  return {
    categories: data,
    ...rest,
  };
}
