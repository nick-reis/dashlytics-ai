export type Order = {
  id: string;
  customer_id: string;
  product_ids: string[];
  total_amount: string;
  status: 'open' | 'paid' | 'fulfilled' | 'cancelled';
  created_at: string;
  updated_at: string;
};
