import { Wallet } from "@/@types/Wallet";
import Link from "next/link";
import { PiTrendDown, PiTrendUp } from "react-icons/pi";

type WalletCardProps = {
  wallet: Wallet;
};

export function WalletCard({ wallet }: WalletCardProps) {
  return (
    <Link
      href={`/dashboard/wallet/${wallet.walletNumber}`}
      className="py-2 px-4 flex-col  text-secondary-light hover:bg-gray-100/50 transition-all duration-500 rounded-md flex "
    >
      <strong className="font-medium">{wallet.name}</strong>
      <div className="flex gap-4 text-sm text-zinc-400">
        <span>
          {wallet.equity.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
        <span className="flex items-center gap-2">
          <span>
            {Number(wallet.profit.toFixed(2)).toLocaleString("pt-BR")}%{" "}
          </span>
          <span>
            {wallet.profit > 0 ? (
              <PiTrendUp className="text-green-600" />
            ) : (
              <PiTrendDown className="text-red-600" />
            )}
          </span>
        </span>
      </div>
    </Link>
  );
}
