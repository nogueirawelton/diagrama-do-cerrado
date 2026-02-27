import { Category as CategoryType } from "@/@types/Category";
import { CategoryBalance, Target, WalletPosition } from "@/@types/Wallet";
import { formatCurrency } from "@/utils/format-currency";
import { Collapsible } from "radix-ui";
import {
  PiCaretDown,
  PiCaretDownFill,
  PiCaretUpFill,
  PiTipJar,
  PiTrendDown,
  PiTrendUp,
} from "react-icons/pi";
import { RateDialog } from "./rate-dialog";

type CategoryProps = {
  walletNumber: string;
  category: CategoryType & { positions: Array<WalletPosition> };
  targets: Array<Target>;
  balances: Array<CategoryBalance>;
};

export function Category({
  category,
  targets,
  walletNumber,
  balances,
}: CategoryProps) {
  const categoryBalance = balances.find((b) => b.category.id === category.id);
  const categoryTarget = targets.find((t) => t.category.id === category.id);

  const sums = category.positions.reduce(
    (acc, pos) => ({
      sumDy: acc.sumDy + pos.asset.dy,
      sumYoc: acc.sumYoc + pos.yoc,
    }),
    { sumDy: 0, sumYoc: 0 },
  );

  const averages = {
    dy: sums.sumDy / category.positions.length || 0,
    yoc: sums.sumYoc / category.positions.length || 0,
  };

  return (
    <Collapsible.Root>
      <Collapsible.Trigger className="p-6 rounded-b-none group flex justify-between items-center bg-white rounded-md border w-full border-zinc-200/75">
        <strong className="font-medium text-secondary-light flex items-center gap-2 text-lg">
          <PiTipJar className="size-7" />
          {category.name}
        </strong>

        <div className="flex items-center gap-24">
          <div className="flex items-center gap-16">
            <div className="flex font-medium text-zinc-500 flex-col items-end">
              <strong className="font-medium">Ativos</strong>
              <span className="text-lg">{category.positions.length}</span>
            </div>

            <div className="flex font-medium text-zinc-500 flex-col items-end">
              <strong className="font-medium">Valor total</strong>
              <span className="text-lg">
                {formatCurrency(categoryBalance?.value || 0, "BRL")}
              </span>
            </div>

            {averages.dy > 0 && (
              <div className="flex font-medium text-zinc-500 flex-col items-end">
                <strong className="font-medium">DY</strong>
                <span className="text-lg">
                  {Number(averages.dy.toFixed(2)).toLocaleString("pt-BR")}%
                </span>
              </div>
            )}

            {averages.yoc > 0 && (
              <div className="flex font-medium text-zinc-500 flex-col items-end">
                <strong className="font-medium">YOC</strong>
                <span className="text-lg">
                  {Number(averages.yoc.toFixed(2)).toLocaleString("pt-BR")}%
                </span>
              </div>
            )}

            <div className="flex font-medium text-zinc-500 flex-col items-end">
              <strong className="font-medium">% na carteira</strong>
              <span className="text-lg">
                {Math.round(categoryBalance?.percent || 0)}% /{" "}
                {categoryTarget?.targetPercentage}%
              </span>
            </div>
          </div>

          <span className="size-8 grid rounded-full place-items-center bg-zinc-100/75">
            <PiCaretDown className="size-4 group-data-[state=open]:rotate-180 transition-all duration-500" />
          </span>
        </div>
      </Collapsible.Trigger>

      <Collapsible.Content className="data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-sm font-medium border-l border-zinc-200/75 h-16 bg-zinc-100 text-zinc-500">
                Ativo
              </th>
              <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                Quant.
              </th>
              <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                Preço médio
              </th>
              <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                Preço atual
              </th>
              <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                Variação
              </th>
              <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                Rentabilidade
              </th>
              <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                Saldo
              </th>
              {category.positions.some((position) => position.asset.pl) && (
                <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                  P/L
                </th>
              )}
              {category.positions.some((position) => position.asset.pvp) && (
                <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                  P/VP
                </th>
              )}

              {category.positions.some((position) => position.asset.dy) && (
                <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                  DY
                </th>
              )}

              {category.positions.some((position) => position.yoc) && (
                <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                  Yield on Cost
                </th>
              )}

              <th className="text-sm font-medium h-16 bg-zinc-100 text-zinc-500">
                % Carteira
              </th>
              <th className="text-sm font-medium border-r border-zinc-200/75 h-16 bg-zinc-100 text-zinc-500">
                Nota
              </th>
            </tr>
          </thead>

          <tbody>
            {category.positions
              .toSorted((a, b) => a.asset.ticker.localeCompare(b.asset.ticker))
              .map((position) => (
                <tr
                  key={position.asset.ticker}
                  className="even:bg-zinc-100/50 bg-white"
                >
                  <td className="border-l border-zinc-200/75 text-center h-14">
                    <a
                      href={position.asset.url}
                      target="_blank"
                    >
                      {position.asset.ticker}
                    </a>
                  </td>
                  <td className="text-center h-16">{position.quantity}</td>
                  <td className="text-center h-16">
                    {formatCurrency(
                      position.averagePrice,
                      position.asset.currency == "R$" ? "BRL" : "USD",
                    )}
                  </td>
                  <td className="text-center h-16">
                    {formatCurrency(
                      position.asset.price,
                      position.asset.currency == "R$" ? "BRL" : "USD",
                    )}
                  </td>
                  <td className="text-center h-16">
                    <div className="flex items-center justify-center gap-2">
                      {Number(position.appreciation.toFixed(2)).toLocaleString(
                        "pt-BR",
                      )}
                      %
                      <span>
                        {position.appreciation > 0 ? (
                          <PiCaretUpFill className="text-green-600 size-4" />
                        ) : (
                          <PiCaretDownFill className="text-red-600 size-4" />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="text-center h-16">
                    <div className="flex items-center justify-center gap-2">
                      {Number(
                        position.weightedReturn.toFixed(2),
                      ).toLocaleString("pt-BR")}
                      %
                      <span>
                        {position.weightedReturn > 0 ? (
                          <PiTrendUp className="text-green-600 size-4" />
                        ) : (
                          <PiTrendDown className="text-red-600 size-4" />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="text-center h-16">
                    {formatCurrency(
                      position.asset.price * position.quantity,
                      position.asset.currency == "R$" ? "BRL" : "USD",
                    )}
                  </td>
                  {position.asset.pl && (
                    <td className="text-center h-16">
                      {Number(position.asset.pl.toFixed(2)).toLocaleString(
                        "pt-BR",
                      )}
                    </td>
                  )}
                  {position.asset.pvp && (
                    <td className="text-center h-16">
                      {Number(position.asset.pvp.toFixed(2)).toLocaleString(
                        "pt-BR",
                      )}
                    </td>
                  )}
                  {position.asset.dy && (
                    <td className="text-center h-16">
                      {Number(position.asset.dy.toFixed(2)).toLocaleString(
                        "pt-BR",
                      )}
                      %
                    </td>
                  )}
                  {position.yoc && (
                    <td className="text-center h-16">
                      {Number(position.yoc.toFixed(2)).toLocaleString("pt-BR")}%
                    </td>
                  )}
                  <td className="text-center h-16">
                    {Number(position.percentWallet.toFixed(2)).toLocaleString(
                      "pt-BR",
                    )}
                    %
                  </td>
                  <td className="text-center border-r border-zinc-200/75 h-16">
                    <RateDialog
                      walletNumber={walletNumber}
                      category={category}
                      position={position}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Collapsible.Content>

      <div className="p-6 rounded-t-none border-t-0 group flex justify-between items-center bg-white rounded-md border w-full border-zinc-200/75"></div>
    </Collapsible.Root>
  );
}
