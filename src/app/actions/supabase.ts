"use server";

import { supabase } from "@/lib/supabase";
import { ProductSchema, CustomerSchema, OrderSchema } from "@/schemas";
import { Product, Customer, Order } from "@/types";

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

export async function addCustomer(customer: CustomerSchema) {
  const { data, error } = await supabase
    .from("customers")
    .insert([customer])
    .select();
  if (error) throw new Error(error.message);
  return data as Customer[];
}

export async function updateCustomer(id: string, customer: CustomerSchema) {
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
/***/

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

export async function addOrder(order: OrderSchema) {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select();
  if (error) throw new Error(error.message);
  return data as Order[];
}

export async function updateOrder(id: string, order: OrderSchema) {
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



export async function queryDatabase(sqlQuery: string) {
  if (!sqlQuery.trim().toLowerCase().startsWith("select")) {
    throw new Error("Only SELECT queries are allowed.");
  }
  const { data, error } = await supabase.rpc("execute_sql", { query: sqlQuery });
  if (error) throw new Error(error.message);
  return data;
}
