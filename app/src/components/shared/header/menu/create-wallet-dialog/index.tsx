"use client";

import { Input } from "@/components/ui/input";
import { useWallets } from "@/hooks/api/use-wallets";
import { api, getErrorMessage } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "radix-ui";
import { useCallback, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { PiCircleNotch, PiPlusBold, PiX } from "react-icons/pi";
import { toast } from "react-toastify";
import { defaultValues, schema } from "./schema";

export function CreateWalletDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const { mutate } = useWallets();

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = useCallback(
    handleSubmit((data) => {
      startTransition(async () => {
        try {
          await api.post("/wallets", data);
          await mutate();

          setIsDialogOpen(false);
          reset();
          toast.success("Carteira criada com sucesso!");
        } catch (err) {
          toast.error(getErrorMessage(err));
          console.log(err);
        }
      });
    }),
    [],
  );

  return (
    <Dialog.Root
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      <Dialog.Trigger className="text-secondary-light mt-2 text-sm flex w-full items-center gap-2 hover:bg-gray-100/50 transition-all duration-500 h-12 rounded-md px-4">
        <PiPlusBold />
        Adicionar nova carteira
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-50 inset-0 bg-black/40" />

        <Dialog.Content className="bg-white w-full max-w-2xl data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out rounded-md p-4 lg:p-8 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-50">
          <Dialog.Title className="text-2xl font-medium text-zinc-800">
            Criar Carteira
          </Dialog.Title>

          <Dialog.Close className="absolute top-4 right-4 cursor-pointer">
            <PiX />
          </Dialog.Close>

          <p className="text-zinc-500 mt-2">
            Crie uma carteira para organizar seus investimentos
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-8 flex flex-col gap-4"
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input.Root error={errors.name}>
                  <Input.Control
                    type="text"
                    placeholder="Nome"
                    {...field}
                  />
                </Input.Root>
              )}
            />

            <div>
              <Controller
                name="walletNumber"
                control={control}
                render={({ field }) => (
                  <Input.Root error={errors.walletNumber}>
                    <Input.Control
                      type="text"
                      placeholder="ID da carteira no Investidor10"
                      {...field}
                    />
                  </Input.Root>
                )}
              />
              <small className="text-zinc-500">
                OBS: A Carteira deve estar pública
              </small>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
