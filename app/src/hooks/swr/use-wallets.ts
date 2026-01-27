import { Wallet } from "@/@types/Wallet";
import { fetcher } from "@/api";
import useSWR from "swr";

export function useWallets() {
  const { data, ...rest } = useSWR<Array<Wallet>>("/wallets", fetcher);

  return {
    wallets: data,
    ...rest,
  };
}
