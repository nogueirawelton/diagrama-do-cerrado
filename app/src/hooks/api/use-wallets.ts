import { Wallet } from "@/@types/Wallet";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export function useWallets() {
  const { data: session } = useSession();
  const { data, ...rest } = useSWR<Array<Wallet>>(
    session ? ["/wallets", session?.access_token] : null,
  );

  return {
    wallets: data,
    ...rest,
  };
}
