import { Wallet } from "@/@types/Wallet";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export function useWallet(id: number) {
  const { data: session } = useSession();
  const { data, ...rest } = useSWR<Wallet>(
    session ? [`/wallets/${id}`, session?.tokens.access_token] : null,
  );

  return {
    wallet: data,
    ...rest,
  };
}
