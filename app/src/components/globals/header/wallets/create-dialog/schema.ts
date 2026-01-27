import * as z from "zod";

export const schema = z.object({
  name: z.string().min(1, "Preencha este campo!"),
  walletNumber: z.string().min(1, "Preencha este campo!"),
});

export const defaultValues = {
  name: "",
  walletNumber: "",
};

export type FormData = z.infer<typeof schema>;
