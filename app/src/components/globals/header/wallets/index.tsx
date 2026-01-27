"use client";

import { Lazy } from "@/components/utils/lazy";
import { Skeleton } from "@/components/utils/skeleton";
import { useWallets } from "@/hooks/swr/use-wallets";
import { PiPlusBold } from "react-icons/pi";
import { CreateDialog } from "./create-dialog";

export function Wallets() {
  const { wallets, isLoading } = useWallets();

  return (
    <Lazy
      pending={isLoading}
      fallback={<Skeleton className="h-10 w-[165px] rounded-md" />}
    >
      {wallets?.length ? (
        <div className="flex items-center gap-2">
          {wallets.map((wallet) => (
            <span key={wallet.id}>{wallet.name}</span>
          ))}
        </div>
      ) : (
        <CreateDialog>
          <button className="text-white text-sm flex items-center gap-2 bg-primary-light h-10 rounded-md px-4">
            <PiPlusBold />
            Cadastrar Carteira
          </button>
        </CreateDialog>
      )}
    </Lazy>
  );
}
