import { User } from "@/@types/User";
import { fetcher } from "@/api";
import useSWR from "swr";

export function useUser() {
  const { data, ...rest } = useSWR<User>("/users/me", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    user: data,
    ...rest,
  };
}
