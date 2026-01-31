"use client";

import { api, getErrorMessage } from "@/api";
import { Input } from "@/components/utils/input";
import { useCategories } from "@/hooks/swr/use-categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, ScrollArea } from "radix-ui";
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { PiCircleNotch, PiX } from "react-icons/pi";
import { toast } from "react-toastify";
import { mutate } from "swr";
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
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "targets",
  });

  const targets = watch("targets");

  const totalPercentage = targets.reduce(
    (acc, target) => acc + target.percentage,
    0,
  );

  const onSubmit = useCallback(
    handleSubmit((data) => {
      startTransition(async () => {
        try {
          await api.post("/wallets", {
            ...data,
            targets: data.targets.map((target) => ({
              id: target.categoryId,
              percentage: target.percentage,
            })),
          });

          mutate("/wallets");

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

  useEffect(() => {
    if (categories && categories.length > 0) {
      replace(categories.map((cat) => ({ categoryId: cat.id, percentage: 0 })));
    }
  }, [categories]);

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
                className="pr-4"
              >
                <ScrollArea.Viewport className="h-[225px] 2xl:h-auto">
                  <div className="mt-4 flex overflow-auto flex-col gap-2">
                    {fields.map((field, index) => {
                      const categoryOriginal = categories?.find(
                        (c) => c.id === field.categoryId,
                      );

                      return (
                        <Controller
                          key={field.id}
                          control={control}
                          name={`targets.${index}.percentage`}
                          render={({ field: { onChange, value } }) => (
                            <CategoryTarget
                              category={categoryOriginal!}
                              value={value}
                              onValueChange={(val) => onChange(Number(val))}
                            />
                          )}
                        />
                      );
                    })}
                  </div>
                </ScrollArea.Viewport>

                <ScrollArea.Scrollbar className="bg-zinc-100 w-1 rounded-full ">
                  <ScrollArea.Thumb className="w-1 bg-secondary-light rounded-full" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </div>

            <div className="flex text-secondary-dark items-center justify-between pr-4">
              <strong>Total</strong>
              <div className="font-medium">
                <span
                  data-warning={totalPercentage !== 100}
                  className="data-[warning=true]:text-primary-light"
                >
                  {totalPercentage}%
                </span>
                <span> / 100%</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending || totalPercentage !== 100}
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
