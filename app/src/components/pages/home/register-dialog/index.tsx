"use client";

import { api, getErrorMessage } from "@/api";
import { Input } from "@/components/utils/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "radix-ui";
import { ReactNode, useCallback, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { PiCircleNotch, PiLock, PiUser, PiX } from "react-icons/pi";
import { toast } from "react-toastify";
import { defaultValues, schema } from "./schema";

type RegisterDialogProps = {
  children: ReactNode;
};

export function RegisterDialog({ children }: RegisterDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pending, startTransition] = useTransition();

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
          await api.post("/auth/register", data);

          setIsDialogOpen(false);
          reset();
          toast.success("Usuário cadastrado com sucesso!");
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
            Cadastre-se
          </Dialog.Title>

          <Dialog.Close className="absolute top-4 right-4 cursor-pointer">
            <PiX />
          </Dialog.Close>

          <p className="text-zinc-500 mt-2">
            Faça seu cadastro e facilite o seu investimento!
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
                    placeholder="Nome Completo"
                    {...field}
                  />
                </Input.Root>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input.Root error={errors.email}>
                  <Input.Control
                    type="text"
                    placeholder="E-mail"
                    {...field}
                  />
                </Input.Root>
              )}
            />

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input.Root error={errors.username}>
                  <Input.Prefix>
                    <PiUser className="size-5 text-zinc-400" />
                  </Input.Prefix>

                  <Input.Control
                    type="text"
                    placeholder="Usuário"
                    {...field}
                  />
                </Input.Root>
              )}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Root error={errors.password}>
                    <Input.Prefix>
                      <PiLock className="size-5 text-zinc-400" />
                    </Input.Prefix>

                    <Input.Control
                      type="password"
                      placeholder="Senha"
                      {...field}
                    />

                    <Input.Action>
                      <Input.PasswordAction />
                    </Input.Action>
                  </Input.Root>
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input.Root error={errors.confirmPassword}>
                    <Input.Prefix>
                      <PiLock className="size-5 text-zinc-400" />
                    </Input.Prefix>

                    <Input.Control
                      type="password"
                      placeholder="Confirmar Senha"
                      {...field}
                    />

                    <Input.Action>
                      <Input.PasswordAction />
                    </Input.Action>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
