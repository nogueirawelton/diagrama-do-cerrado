"use client";

import { Lazy } from "@/components/ui/lazy";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallets } from "@/hooks/api/use-wallets";
import { useSession } from "next-auth/react";
import { Collapsible, Popover } from "radix-ui";
import { PiCaretDown, PiList, PiSignOut, PiWallet } from "react-icons/pi";
import { Logout } from "../logout";
import { CreateWalletDialog } from "./create-wallet-dialog";
import { WalletCard } from "./wallet";

export function Menu() {
  const { data: session } = useSession();
  const { wallets } = useWallets();

  const initial = session?.user.name
    ?.split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <Popover.Root>
      <Popover.Trigger className="text-white  flex items-center gap-3 px-2 h-11 border-white/30 border rounded-md">
        <PiList className="size-7" />

        <Lazy
          pending={!session}
          fallback={<Skeleton className="size-7 rounded-full" />}
        >
          <span className="size-7 text-xs uppercase grid place-items-center rounded-full bg-white/30">
            {initial}
          </span>
        </Lazy>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          className="bg-white p-4 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out shadow-sm rounded-lg min-w-(--radix-popover-trigger-width)"
        >
          <div className="flex items-center gap-4  text-zinc-800 rounded-md transition-all duration-500 p-4">
            <span className=" size-12 text-sm uppercase grid place-items-center rounded-full bg-zinc-100">
              {initial}
            </span>

            <div className="flex flex-col">
              <strong className="font-medium text-sm">
                {session?.user.name}
              </strong>
              <small className="text-zinc-400">{session?.user.email}</small>
            </div>
          </div>

          <nav className="border-y border-zinc-200 py-4 my-2">
            <Collapsible.Root>
              <Collapsible.Trigger className="flex group text-secondary-light data-[state=open]:bg-gray-100/50 w-full px-4 hover:bg-gray-100/50 rounded-md transition-all duration-500 h-12 justify-between items-center gap-3">
                <span className="flex items-center gap-3">
                  <PiWallet className="size-6 text-zinc-500" />
                  Minhas Carteiras
                </span>

                <PiCaretDown className="text-secondary-light size-4 group-data-[state=open]:rotate-180 transition-all duration-500" />
              </Collapsible.Trigger>

              <Collapsible.Content className="data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
                <div className="flex flex-col gap-2 pt-2">
                  {wallets?.map((wallet) => (
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                    />
                  ))}
                </div>

                <CreateWalletDialog />
              </Collapsible.Content>
            </Collapsible.Root>
          </nav>

          <Logout>
            <button className="flex text-secondary-light w-full px-4 hover:bg-gray-100/50 rounded-md transition-all duration-500 h-12 items-center gap-3">
              <PiSignOut className="size-6 text-zinc-500" />
              Sair
            </button>
          </Logout>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
