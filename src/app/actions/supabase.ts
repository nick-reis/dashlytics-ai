"use server";

import { supabase } from "@/lib/supabase";
import { productSchema } from "@/schemas";
import { Product } from "@/types";
import z from "zod";

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function addProduct(product: z.infer<typeof productSchema>) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select();

  if (error) throw new Error(error.message);
  return data as Product[];
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
