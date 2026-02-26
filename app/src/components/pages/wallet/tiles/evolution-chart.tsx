import { History } from "@/@types/Wallet";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { PiCurrencyDollar } from "react-icons/pi";

type EvolutionChartProps = {
  history: Array<History>;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function EvolutionChart({ history }: EvolutionChartProps) {
  const chartData = {
    labels: history.map((h) => h.date),
    datasets: [
      {
        label: "Valor aplicado",
        data: history.map((h) => h.sum_applied),
        backgroundColor: "#2f3b47",
        borderRadius: 4,
      },
      {
        label: "Ganho capital",
        data: history.map((h) => h.sum_equity - h.sum_applied),
        backgroundColor: "#95a1ad",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: false,
        ticks: {
          callback: (value: any) => value.toLocaleString("pt-BR"),
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-md border border-zinc-200/75">
      <div className="flex justify-between gap-4 items-center relative">
        <strong className="font-medium text-secondary-light text-lg">
          Evolução do Patrimônio
        </strong>

        <button className="h-10 right-0 absolute rounded-md text-sm flex items-center gap-2 font-medium px-4 text-white bg-secondary-dark">
          <PiCurrencyDollar className="size-5 shrink-0" />
          Fazer Aporte
        </button>
      </div>

      <div className="w-full border-t border-zinc-200 mt-4 pt-6 h-64">
        <Bar
          data={chartData}
          options={options as any}
        />
      </div>
    </div>
  );
}
