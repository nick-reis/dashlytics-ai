import z from "zod";

export const orderSchema = z.object({
  customer_id: z.string().uuid(),
  product_ids: z.array(z.string().uuid()).min(1),
  total_amount: z.coerce.number().min(0),
  status: z.enum(["open", "paid", "fulfilled", "cancelled"]).default("open"),
});

export type OrderFormValues = z.input<typeof orderSchema>;   
export type OrderSchema = z.output<typeof orderSchema>;    
