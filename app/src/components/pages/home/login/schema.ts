import * as z from "zod";

export const schema = z.object({
  username: z
    .string()
    .min(1, "Preencha este campo!")
    .min(6, "Mínimo de 6 caracteres"),
  password: z
    .string()
    .min(1, "Preencha este campo!")
    .min(8, "Mínimo de 8 caracteres"),
});

export const defaultValues = {
  username: "",
  password: "",
};

export type FormData = z.infer<typeof schema>;
