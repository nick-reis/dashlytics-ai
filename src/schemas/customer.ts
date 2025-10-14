import z from "zod";

export const shippingAddressSchema = z.object({
  name: z.string().min(1, "Recipient name is required"),
  address1: z.string().min(1, "Address line 1 is required"),
  address2: z.string().optional(), // optional secondary line
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "State/Region is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(3, "Phone number is required"),
});

export const customerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(3, "Phone number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),

  orders_count: z.coerce
    .number()
    .int()
    .min(0, "Orders count must be non-negative")
    .refine((val) => !isNaN(val), { message: "Orders count cannot be empty" }),

  total_spent: z.coerce
    .number()
    .min(0, "Total spent must be non-negative")
    .refine((val) => !isNaN(val), { message: "Total spent cannot be empty" }),

  shipping_address: shippingAddressSchema,
});

export type CustomerFormValues = z.input<typeof customerSchema>;
export type CustomerSchema = z.output<typeof customerSchema>;
