import * as z from "zod";

export const schema = z
  .object({
    name: z.string().min(1, "Preencha este campo!"),
    email: z.email("E-mail inválido").min(1, "Preencha este campo!"),
    username: z
      .string()
      .min(1, "Preencha este campo!")
      .min(6, "Mínimo de 6 caracteres"),
    password: z
      .string()
      .min(1, "Preencha este campo!")
      .min(8, "Mínimo de 8 caracteres"),
    confirmPassword: z.string().min(1, "Preencha este campo!"),
  })
  .superRefine((val, ctx) => {
    if (val.password != val.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem!",
        path: ["confirmPassword"],
      });
    }
  });

export const defaultValues = {
  name: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export type FormData = z.infer<typeof schema>;
