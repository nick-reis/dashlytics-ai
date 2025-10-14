export type Customer = {
  id: string;

  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string;

  created_at: string;
  updated_at: string;
  last_activity_at: string | null;

  orders_count: number;
  total_spent: string; // numeric → string in JS

  shipping_address: {
    name?: string | null;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    region?: string | null;
    postal_code?: string | null;
    country?: string | null;
    phone?: string | null;
  } | null;
};
