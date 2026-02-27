import * as z from "zod";

export const schema = z.object({
  totalAmount: z.string().min(1, "Preencha este campo!"),
  maxAmountPercentagePerAsset: z.string().min(1, "Preencha este campo!"),
});

export const defaultValues = {
  totalAmount: "",
  maxAmountPercentagePerAsset: "",
};

export type FormData = z.infer<typeof schema>;
