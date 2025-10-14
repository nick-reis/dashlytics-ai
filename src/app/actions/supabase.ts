"use server";

import { supabase } from "@/lib/supabase";

import { ProductSchema } from "@/schemas"; 
import {
  customerSchema,
  type CustomerFormValues, 
} from "@/schemas/customer";
import {
  orderSchema,
  type OrderFormValues, 
} from "@/schemas/order";

// Return/row types
import { Product, Customer, Order, OrderEnriched } from "@/types";

/* =========================
 * PRODUCTS
 * ========================= */

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Product;
}

export async function addProduct(product: ProductSchema) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select();
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function updateProduct(id: string, product: ProductSchema) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select();
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function deleteProducts(ids: string[]) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .in("id", ids)
    .select();
  if (error) throw new Error(error.message);
  return data as Product[];
}

/* =========================
 * CUSTOMERS
 * ========================= */

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Customer[];
}

export async function getCustomer(id: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Customer;
}

export async function addCustomer(customer: CustomerFormValues) {
  const { data, error } = await supabase
    .from("customers")
    .insert([customer])
    .select();
  if (error) throw new Error(error.message);
  return data as Customer[];
}

export async function updateCustomer(id: string, customer: CustomerFormValues) {
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select();
  if (error) throw new Error(error.message);
  return data as Customer[];
}

export async function deleteCustomers(ids: string[]) {
  const { data, error } = await supabase
    .from("customers")
    .delete()
    .in("id", ids)
    .select();
  if (error) throw new Error(error.message);
  return data as Customer[];
}

/* =========================
 * ORDERS
 * ========================= */

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Order[];
}

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Order;
}

export async function addOrder(order: OrderFormValues) {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select();
  if (error) throw new Error(error.message);
  return data as Order[];
}

export async function updateOrder(id: string, order: OrderFormValues) {
  const { data, error } = await supabase
    .from("orders")
    .update(order)
    .eq("id", id)
    .select();
  if (error) throw new Error(error.message);
  return data as Order[];
}

export async function deleteOrders(ids: string[]) {
  const { data, error } = await supabase
    .from("orders")
    .delete()
    .in("id", ids)
    .select();
  if (error) throw new Error(error.message);
  return data as Order[];


}


// Get all orders with customer + product names (single SELECT via RPC)
export async function getOrdersEnriched() {
  const sql = `SELECT
      o.*,
      c.full_name AS customer_name,
      (
        SELECT array_agg(p.name ORDER BY p.name)
        FROM products p
        WHERE p.id = ANY (o.product_ids)
      ) AS product_names
    FROM orders o
    LEFT JOIN customers c ON c.id = o.customer_id
    ORDER BY o.updated_at DESC`;
  const data = await queryDatabase(sql);
  return data as OrderEnriched[];
}

// Get single order with names
export async function getOrderEnriched(id: string) {
  const sql = `SELECT
      o.*,
      c.full_name AS customer_name,
      (
        SELECT array_agg(p.name ORDER BY p.name)
        FROM products p
        WHERE p.id = ANY (o.product_ids)
      ) AS product_names
    FROM orders o
    LEFT JOIN customers c ON c.id = o.customer_id
    WHERE o.id = '${id.replace(/'/g, "''")}'`;
  const rows = (await queryDatabase(sql)) as OrderEnriched[];
  if (!rows?.length) throw new Error("Order not found");
  return rows[0];
}



/* =========================
 * SAFE SELECT RPC
 * ========================= */

export async function queryDatabase(sqlQuery: string) {
  const cleaned = sqlQuery.trim().replace(/;+\s*$/,"");
  if (!cleaned.toLowerCase().startsWith("select")) {
    throw new Error("Only SELECT queries are allowed.");
  }
  const { data, error } = await supabase.rpc("execute_sql", { query: cleaned });
  if (error) throw new Error(error.message);
  return data;
}

