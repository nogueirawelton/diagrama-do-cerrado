import { User } from "@/@types/User";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export function useUser() {
  const { data: session } = useSession();
  const { data, ...rest } = useSWR<User>(["/users/me", session?.access_token]);

  return {
    user: data,
    ...rest,
  };
}
