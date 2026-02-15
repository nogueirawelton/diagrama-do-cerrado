"use client";

import { useWallet } from "@/hooks/api/use-wallet";
import { useSession } from "next-auth/react";

type WalletContentProps = {
  id: string | null;
};

export function WalletContent({ id }: WalletContentProps) {
  const { data: session } = useSession();

  const { wallet } = useWallet(
    Number(id || session?.user.lastOpenedWalletNumber),
  );

  return (
    <main className="h-[calc(100vh-4rem)] py-8 bg-zinc-50">
      <div className="max-w-screen-2xl flex flex-col gap-4 mx-auto px-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="h-32 bg-white rounded-md border border-zinc-200/75"></div>
          <div className="h-32 bg-white rounded-md border border-zinc-200/75"></div>
          <div className="h-32 bg-white rounded-md border border-zinc-200/75"></div>
          <div className="h-32 bg-white rounded-md border border-zinc-200/75"></div>
        </div>

        <div className="grid grid-cols-[2fr_1.5fr] gap-4">
          <div className="h-96 bg-white rounded-md border border-zinc-200/75"></div>
          <div className="h-96 bg-white rounded-md border border-zinc-200/75"></div>
        </div>
      </div>
    </main>
  );
}
