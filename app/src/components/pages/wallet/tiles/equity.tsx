import { formatCurrency } from "@/utils/format-currency";
import { PiPiggyBank, PiTrendDown, PiTrendUp } from "react-icons/pi";

type EquityProps = {
  equity: number;
  variation: number;
  applied: number;
};

export function Equity({ equity, variation, applied }: EquityProps) {
  return (
    <div className="p-6 bg-white rounded-md border border-zinc-200/75">
      <div className="flex items-center text-secondary-light gap-3">
        <PiPiggyBank className="size-6" />
        <strong className="font-medium">Patrimônio Total</strong>
      </div>

      <div className="pl-10 mt-1">
        <div className="flex gap-4">
          <span className="text-xl font-medium text-zinc-500">
            {formatCurrency(equity, "BRL")}
          </span>

          <span className="flex text-secondary-light text-sm items-center bg-zinc-100/50 rounded-sm px-2 gap-2">
            <span>
              {Number(variation.toFixed(2)).toLocaleString("pt-BR")}%{" "}
            </span>
            <span>
              {variation > 0 ? (
                <PiTrendUp className="text-green-600" />
              ) : (
                <PiTrendDown className="text-red-600" />
              )}
            </span>
          </span>
        </div>

        <div className="mt-2 flex-col flex">
          <small className="font-medium text-zinc-500">Valor investido</small>

          <span className="text-secondary-light">
            {formatCurrency(applied, "BRL")}
          </span>
        </div>
      </div>
    </div>
  );
}
