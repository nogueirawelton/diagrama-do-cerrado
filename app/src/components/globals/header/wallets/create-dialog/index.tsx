"use client";

import { api, getErrorMessage } from "@/api";
import { Input } from "@/components/utils/input";
import { useCategories } from "@/hooks/swr/use-categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, ScrollArea } from "radix-ui";
import { ReactNode, useCallback, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { PiCircleNotch, PiX } from "react-icons/pi";
import { toast } from "react-toastify";
import { CategoryTarget } from "./category-target";
import { defaultValues, schema } from "./schema";

type CreateDialogProps = {
  children: ReactNode;
};

export function CreateDialog({ children }: CreateDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const { categories } = useCategories();

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
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

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
            <div className="grid md:grid-cols-2 gap-4">
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
                        placeholder="Número da Carteira no I10"
                        {...field}
                      />
                    </Input.Root>
                  )}
                />
                <small className="text-zinc-500">
                  OBS: A Carteira deve estar pública
                </small>
              </div>
            </div>

            <div>
              <strong className="text-lg font-medium">Objetivos</strong>

              <ScrollArea.Root
                type="auto"
                className="pr-4 pt-4"
              >
                <ScrollArea.Viewport className="h-[225px] 2xl:h-auto">
                  <div className="mt-4 flex overflow-auto flex-col gap-2">
                    {categories?.map((category) => (
                      <CategoryTarget
                        key={category.id}
                        category={category}
                      />
                    ))}
                  </div>
                </ScrollArea.Viewport>

                <ScrollArea.Scrollbar className="bg-zinc-100 w-1 rounded-full ">
                  <ScrollArea.Thumb className="w-1 bg-secondary-light rounded-full" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
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
