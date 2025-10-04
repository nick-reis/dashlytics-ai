"use server";

import { supabase } from "@/lib/supabase";
import { ProductSchema } from "@/schemas";
import { Product } from "@/types";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Product[];
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

export async function deleteProducts(id: string[]) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .in("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export async function queryDatabase(sqlQuery: string) {
  if (!sqlQuery.trim().toLowerCase().startsWith("select")) {
    throw new Error("Only SELECT queries are allowed.");
  }

  const { data, error } = await supabase.rpc("execute_sql", {
    query: sqlQuery,
  });

  if (error) throw new Error(error.message);
  return data;
}
