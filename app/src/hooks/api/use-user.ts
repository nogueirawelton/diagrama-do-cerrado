import { User } from "@/@types/User";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export function useUser() {
  const { data: session } = useSession();
  const { data, ...rest } = useSWR<User>(
    session ? ["/users/me", session?.tokens.access_token] : null,
  );

  return {
    user: data,
    ...rest,
  };
}
