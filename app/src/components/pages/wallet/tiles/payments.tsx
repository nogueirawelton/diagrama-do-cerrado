import { formatCurrency } from "@/utils/format-currency";
import { PiCoins } from "react-icons/pi";

type PaymentsProps = {
  totalPayments: number;
  lastPayments: number;
  provisionedPayments: number;
};

export function Payments({
  totalPayments,
  lastPayments,
  provisionedPayments,
}: PaymentsProps) {
  return (
    <div className="p-6 bg-white rounded-md border border-zinc-200/75">
      <div className="flex items-center text-secondary-light gap-3">
        <PiCoins className="size-6" />
        <strong className="font-medium">Proventos Recebidos (12M)</strong>
      </div>

      <div className="pl-10 mt-1">
        <div className="flex gap-4 items-center">
          <span className="text-xl font-medium text-zinc-500">
            {formatCurrency(lastPayments, "BRL")}
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="mt-2 flex-col flex">
            <small className="font-medium text-zinc-500">Total</small>

            <span className="text-secondary-light">
              {formatCurrency(totalPayments, "BRL")}
            </span>
          </div>

          <div className="mt-2 flex-col flex">
            <small className="font-medium text-zinc-500">Provisionado</small>

            <span className="text-secondary-light">
              {formatCurrency(provisionedPayments, "BRL")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
