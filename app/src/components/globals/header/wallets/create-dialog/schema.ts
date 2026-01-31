import * as z from "zod";

export const schema = z.object({
  name: z.string().min(1, "Preencha este campo!"),
  walletNumber: z.string().min(1, "Preencha este campo!"),
  targets: z.array(
    z.object({ categoryId: z.number(), percentage: z.number() }),
  ),
});

export const defaultValues = {
  name: "",
  walletNumber: "",
  targets: [],
};

export type FormData = z.infer<typeof schema>;
