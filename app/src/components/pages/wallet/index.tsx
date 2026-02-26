"use client";

import { Lazy } from "@/components/ui/lazy";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/api/use-wallet";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { Category } from "./category";
import { AllocationChart } from "./tiles/allocation-chart";
import { Equity } from "./tiles/equity";
import { EvolutionChart } from "./tiles/evolution-chart";
import { Payments } from "./tiles/payments";
import { Profit } from "./tiles/profit";
import { Profitability } from "./tiles/profitability";

type WalletContentProps = {
  id: string | null;
};

export function WalletContent({ id }: WalletContentProps) {
  const { data: session } = useSession();

  const { wallet, isLoading } = useWallet(
    Number(id || session?.user.lastOpenedWalletNumber),
  );

  const pending = !wallet || isLoading;

  return (
    <main className="mt-12 py-8 bg-zinc-50">
      <div className="max-w-screen-2xl flex flex-col gap-4 mx-auto px-4">
        <section className="grid grid-cols-4 gap-4">
          <Lazy
            pending={pending}
            fallback={<Skeleton className="h-[157px]" />}
          >
            <Equity
              equity={wallet?.equity!}
              variation={wallet?.variation!}
              applied={wallet?.applied!}
            />
          </Lazy>

          <Lazy
            pending={pending}
            fallback={<Skeleton className="h-[157px]" />}
          >
            <Profit
              gain={wallet?.equity! - wallet?.applied!}
              payments={wallet?.payments_total!}
            />
          </Lazy>

          <Lazy
            pending={pending}
            fallback={<Skeleton className="h-[157px]" />}
          >
            <Payments
              totalPayments={wallet?.payments_total!}
              lastPayments={wallet?.payments_12_months!}
              provisionedPayments={wallet?.provisioned!}
            />
          </Lazy>

          <Lazy
            pending={pending}
            fallback={<Skeleton className="h-[157px]" />}
          >
            <Profitability
              variation={wallet?.variation!}
              profit={wallet?.profit!}
              paymentVariation={wallet?.variation_payments_12_months!}
            />
          </Lazy>
        </section>

        <section className="grid grid-cols-[2fr_1.5fr] gap-4">
          <Lazy
            pending={pending}
            fallback={<Skeleton className="h-[350px]" />}
          >
            <EvolutionChart history={wallet?.history!} />
          </Lazy>
          <Lazy
            pending={pending}
            fallback={<Skeleton className="h-[350px]" />}
          >
            <AllocationChart categoryBalances={wallet?.categoryBalances!} />
          </Lazy>
        </section>

        <section>
          <h2 className="font-medium flex items-center gap-2 text-xl text-secondary-light">
            Meus Ativos{" "}
            <small className="text-zinc-500">
              ({wallet?.positions.length})
            </small>
          </h2>

          <div className="flex mt-4 flex-col gap-4">
            <Lazy
              pending={pending}
              fallback={
                <Fragment>
                  <Skeleton className="h-[350px]" />
                  <Skeleton className="h-[350px]" />
                  <Skeleton className="h-[350px]" />
                </Fragment>
              }
            >
              {wallet?.categories.map((category) => (
                <Category
                  key={category.id}
                  walletNumber={wallet.walletNumber}
                  category={category}
                  targets={wallet.targets}
                  balances={wallet.categoryBalances}
                />
              ))}
            </Lazy>
          </div>
        </section>
      </div>
    </main>
  );
}
