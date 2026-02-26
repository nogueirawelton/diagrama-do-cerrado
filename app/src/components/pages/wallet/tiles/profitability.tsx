import {
  PiCaretDownFill,
  PiCaretUpFill,
  PiChartLine,
  PiTrendDown,
  PiTrendUp,
} from "react-icons/pi";

type ProfitabilityProps = {
  profit: number;
  variation: number;
  paymentVariation: number;
};

export function Profitability({
  variation,
  profit,
  paymentVariation,
}: ProfitabilityProps) {
  return (
    <div className="px-6 pt-6 bg-white flex gap-4 items-start  rounded-md border border-zinc-200/75">
      <div className="flex items-center text-secondary-light gap-3">
        <PiChartLine className="size-6" />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-8 items-start">
          <div>
            <div>
              <strong className="font-medium text-secondary-light">
                Variação
              </strong>
              <span
                data-status={variation > 0 ? "positive" : "negative"}
                className="text-lg mt-1 flex items-center gap-2 font-medium data-[status=positive]:text-green-600 data-[status=negative]:text-red-600"
              >
                {Number(variation.toFixed(2)).toLocaleString("pt-BR")}%
                <span>
                  {variation > 0 ? (
                    <PiCaretUpFill className="text-green-600 size-4" />
                  ) : (
                    <PiCaretDownFill className="text-red-600 size-4" />
                  )}
                </span>
              </span>
            </div>
          </div>

          <div>
            <strong className="font-medium text-secondary-light">
              Rentabilidade
            </strong>
            <span
              data-status={profit > 0 ? "positive" : "negative"}
              className="text-lg mt-1 flex items-center gap-2 font-medium data-[status=positive]:text-green-600 data-[status=negative]:text-red-600"
            >
              {Number(profit.toFixed(2)).toLocaleString("pt-BR")}%
              <span>
                {profit > 0 ? (
                  <PiTrendUp className="text-green-600 size-4" />
                ) : (
                  <PiTrendDown className="text-red-600 size-4" />
                )}
              </span>
            </span>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <div>
            <strong className="font-medium text-secondary-light">
              Proventos
            </strong>
            <span
              data-status={paymentVariation > 0 ? "positive" : "negative"}
              className="text-lg  flex items-center gap-2 font-medium data-[status=positive]:text-green-600 data-[status=negative]:text-red-600"
            >
              {Number(paymentVariation.toFixed(2)).toLocaleString("pt-BR")}%
              <span>
                {paymentVariation > 0 ? (
                  <PiTrendUp className="text-green-600 size-4" />
                ) : (
                  <PiTrendDown className="text-red-600 size-4" />
                )}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
