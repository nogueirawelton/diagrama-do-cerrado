import { formatCurrency } from "@/utils/format-currency";
import { PiHandCoins } from "react-icons/pi";

type ProfitProps = {
  gain: number;
  payments: number;
};

export function Profit({ gain, payments }: ProfitProps) {
  const totalProfit = gain + payments;

  return (
    <div className="p-6 bg-white rounded-md border border-zinc-200/75">
      <div className="flex items-center text-secondary-light gap-3">
        <PiHandCoins className="size-6" />
        <strong className="font-medium">Lucro Total</strong>
      </div>

      <div className="pl-10 mt-1">
        <div className="flex gap-4">
          <span
            data-status={totalProfit > 0 ? "positive" : "negative"}
            className="text-xl font-medium data-[status=positive]:text-green-600 data-[status=negative]:text-red-600"
          >
            {formatCurrency(totalProfit, "BRL")}
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="mt-2 flex-col flex">
            <small className="font-medium text-zinc-500">
              Ganho de capital
            </small>

            <span className="text-secondary-light">
              {formatCurrency(gain, "BRL")}
            </span>
          </div>

          <div className="mt-2 flex-col flex">
            <small className="font-medium text-zinc-500">
              Dividendos recebidos
            </small>

            <span className="text-secondary-light">
              {formatCurrency(payments, "BRL")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
