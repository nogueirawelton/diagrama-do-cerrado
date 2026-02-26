import { User } from "@/@types/User";
import useSWR from "swr";

export function useUser() {
  const { data, ...rest } = useSWR<User>("/users/me");

  return {
    user: data,
    ...rest,
  };
}
