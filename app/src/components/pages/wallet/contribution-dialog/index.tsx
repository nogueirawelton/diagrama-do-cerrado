"use client";

import { Contribution } from "@/@types/Contribution";
import { Input } from "@/components/ui/input";
import { api, getErrorMessage } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Dialog } from "radix-ui";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { PiCircleNotch, PiCurrencyDollar, PiX } from "react-icons/pi";
import { toast } from "react-toastify";
import { defaultValues, schema } from "./schema";

type DoContributionResponse = {
  items: Array<Contribution>;
};

export function ContributionDialog() {
  const { id } = useParams();
  const [pending, startTransition] = useTransition();
  const [contribution, setContribution] =
    useState<DoContributionResponse | null>(null);

  const {
    formState: { errors },
    reset,
    control,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = handleSubmit((formData) => {
    startTransition(async () => {
      try {
        const { data } = await api.post<DoContributionResponse>(
          `/contributions/${id}`,
          {
            totalAmount: Number(formData.totalAmount),
            maxAmountPercentagePerAsset: Number(
              formData.maxAmountPercentagePerAsset,
            ),
          },
        );

        setContribution(data);
        reset();

        console.log(data);
      } catch (err) {
        toast.error(getErrorMessage(err));
        console.log(err);
      }
    });
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger className="h-10 right-0 absolute rounded-md text-sm flex items-center gap-2 font-medium px-4 text-white bg-secondary-dark">
        <PiCurrencyDollar className="size-5 shrink-0" />
        Fazer Aporte
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-50 inset-0 bg-black/40" />

        <Dialog.Content className="bg-white w-full max-w-2xl data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out rounded-md p-4 lg:p-8 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50">
          <Dialog.Title className="text-2xl font-medium text-zinc-800">
            Novo aporte
          </Dialog.Title>

          <Dialog.Close className="absolute top-4 right-4 cursor-pointer">
            <PiX />
          </Dialog.Close>

          <form
            onSubmit={onSubmit}
            className="mt-8 flex flex-col gap-4"
          >
            <div className="grid lg:grid-cols-2 gap-4">
              <Controller
                name="totalAmount"
                control={control}
                render={({ field }) => (
                  <Input.Root error={errors.totalAmount}>
                    <Input.Control
                      type="text"
                      placeholder="Valor do aporte"
                      {...field}
                    />
                  </Input.Root>
                )}
              />

              <Controller
                name="maxAmountPercentagePerAsset"
                control={control}
                render={({ field }) => (
                  <Input.Root error={errors.maxAmountPercentagePerAsset}>
                    <Input.Control
                      type="text"
                      placeholder="Limite de exposição"
                      {...field}
                    />
                  </Input.Root>
                )}
              />
            </div>

            <button
              type="submit"
              className="h-12 rounded-md grid place-items-center cursor-pointer w-full bg-primary-light text-lg text-white font-medium"
            >
              {pending ? (
                <PiCircleNotch className="animate-spin size-6" />
              ) : (
                "Cadastrar"
              )}
            </button>
          </form>

          {contribution && (
            <div className="mt-8 flex flex-col">
              <div className="max-h-[400px] overflow-y-scroll">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      <th className="text-sm font-medium border-l border-zinc-200/75 h-16 bg-zinc-100 text-zinc-500">
                        ID
                      </th>

                      <th className="text-sm font-medium  h-16 bg-zinc-100 text-zinc-500">
                        Ticker
                      </th>

                      <th className="text-sm font-medium  h-16 bg-zinc-100 text-zinc-500">
                        Quantidade
                      </th>

                      <th className="text-sm font-medium  h-16 bg-zinc-100 text-zinc-500">
                        Preço atual
                      </th>

                      <th className="text-sm font-medium border-r border-zinc-200/75 h-16 bg-zinc-100 text-zinc-500">
                        Aporte
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {contribution.items.map((contribution, key) => (
                      <tr
                        key={key}
                        className="even:bg-zinc-100/50 bg-white"
                      >
                        <td className="border-l border-zinc-200/75 text-center h-14">
                          #{key + 1}
                        </td>

                        <td className="text-center h-14">
                          {contribution.ticker}
                        </td>

                        <td className="text-center h-14">
                          {contribution.amount}
                        </td>

                        <td className="text-center h-14">
                          {contribution.priceInBrl.toLocaleString("pt-BR", {
                            currency: "BRL",
                            style: "currency",
                          })}
                        </td>

                        <td className="text-center h-14">
                          {contribution.totalBrlCost.toLocaleString("pt-BR", {
                            currency: "BRL",
                            style: "currency",
                          })}
                        </td>

                        <td className="text-center border-r border-zinc-200/75 h-16"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
