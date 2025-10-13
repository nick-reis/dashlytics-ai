import z from "zod";

export const shippingAddressSchema = z
  .object({
    name: z.string().min(1).optional().nullable(),
    address1: z.string().min(1).optional().nullable(),
    address2: z.string().min(1).optional().nullable(),
    city: z.string().min(1).optional().nullable(),
    region: z.string().min(1).optional().nullable(),
    postal_code: z.string().min(1).optional().nullable(),
    country: z.string().min(1).optional().nullable(),
    phone: z.string().min(3).optional().nullable(),
  })
  .optional()
  .nullable();

export const customerSchema = z.object({
  email: z.string().email().optional().nullable(),
  phone: z.string().min(3).optional().nullable(),
  first_name: z.string().min(1).optional().nullable(),
  last_name: z.string().min(1).optional().nullable(),
  last_activity_at: z.coerce.date().optional().nullable(),
  orders_count: z.coerce.number().int().min(0).default(0),
  total_spent: z.coerce.number().min(0).default(0),
  shipping_address: shippingAddressSchema,
});

export type CustomerSchema = z.infer<typeof customerSchema>;
