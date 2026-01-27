"use client";

import { Category } from "@/@types/Category";
import { useState } from "react";
import { PiMinusBold, PiPlusBold } from "react-icons/pi";

export function CategoryTarget({ category }: { category: Category }) {
  const [amount, setAmount] = useState(0);

  function handleAmountChange(value: string) {
    const filteredValue = Number(value.replaceAll(/[^0-9]/g, ""));

    if (filteredValue > 100) {
      setAmount(100);
    } else if (filteredValue < 0) {
      setAmount(0);
    } else {
      setAmount(filteredValue);
    }
  }

  return (
    <div
      key={category.id}
      className="flex items-center h-11 rounded-md border border-zinc-200 px-4 justify-between"
    >
      <span>{category.name}</span>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            setAmount((prev) => {
              if (prev <= 0) return 0;
              return prev - 1;
            });
          }}
          className="size-8 text-secondary-light grid place-items-center rounded-md aspect-square bg-zinc-100"
        >
          <PiMinusBold />
        </button>

        <div className="flex  gap-2">
          <input
            type="text"
            className="w-[6ch] outline-none text-center px-2"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <span>%</span>
        </div>

        <button
          type="button"
          onClick={() => {
            setAmount((prev) => {
              if (prev >= 100) return 100;
              return prev + 1;
            });
          }}
          className="size-8 text-secondary-light grid place-items-center rounded-md aspect-square bg-zinc-100"
        >
          <PiPlusBold />
        </button>
      </div>
    </div>
  );
}
