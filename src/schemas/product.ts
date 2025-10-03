import z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Input is too short"),
  description: z.string().min(1, "Input is too short"),
  price: z.coerce
    .number()
    .min(0, "Price must be non-negative")
    .refine((val) => !isNaN(val), { message: "Price cannot be empty" }),
  stock: z.coerce
    .number()
    .min(0, "Stock must be non-negative")
    .refine((val) => !isNaN(val), { message: "Stock cannot be empty" }),
  category: z.string().min(1, "Input is too short"),
});

export type ProductSchema = z.infer<typeof productSchema>;
