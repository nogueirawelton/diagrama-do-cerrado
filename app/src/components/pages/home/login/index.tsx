"use client";

import { useLogin } from "@/hooks/auth/use-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { PiCircleNotch, PiLock, PiUser } from "react-icons/pi";
import { Input } from "../../../ui/input";
import { RegisterDialog } from "../register-dialog";
import { defaultValues, schema } from "./schema";

export function Login() {
  const { login, pending } = useLogin();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await login(data);
      })}
      className="w-full flex flex-col gap-4 max-w-sm mt-8"
    >
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

      <button
        type="submit"
        className="h-12 rounded-md grid place-items-center cursor-pointer w-full bg-primary-light text-lg text-white font-medium"
      >
        {pending ? <PiCircleNotch className="animate-spin size-6" /> : "Entrar"}
      </button>

      <div className="text-zinc-600">
        <span>Não tem uma conta?</span>{" "}
        <RegisterDialog>
          <button className="font-medium cursor-pointer">Cadastre-se</button>
        </RegisterDialog>
      </div>
    </form>
  );
}
