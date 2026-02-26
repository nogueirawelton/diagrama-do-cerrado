import { CategoryBalance } from "@/@types/Wallet";
import { formatCurrency } from "@/utils/format-currency";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

type AllocationChartProps = {
  categoryBalances: Array<CategoryBalance>;
};

ChartJS.register(ArcElement, Tooltip, Legend);

export function AllocationChart({ categoryBalances }: AllocationChartProps) {
  const chartData = {
    labels: categoryBalances.map((b) => b.category.name),
    datasets: [
      {
        data: categoryBalances.map((b) => b.percent),
        backgroundColor: [
          "#2f3b47",
          "#acb3ba",
          "#ff7058",
          "#ffd15c",
          "#523563",
          "#b04167",
          "#1a9973",
        ],
        borderWidth: 0,
        cutout: "50%",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    align: "start",
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        backgroundColor: "#2f3b47",
        titleColor: "#ffffff",
        bodySpacing: 8,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const value = context.raw || 0;
            const label = context.label || "";

            return ` ${label}: ${value.toLocaleString("pt-BR")}%`;
          },
          afterLabel: function (context: any) {
            const amount = categoryBalances[context.dataIndex].value;

            return ` ${formatCurrency(amount, "BRL")}`;
          },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-md border border-zinc-200/75">
      <div className="flex relative justify-between gap-4 items-center">
        <strong className="font-medium text-secondary-light text-lg">
          Patrimônio Total
        </strong>
      </div>

      <div className="w-full border-t border-zinc-200 mt-4 pt-6 h-64">
        <Doughnut
          data={chartData}
          options={options as any}
        />
      </div>
    </div>
  );
}
