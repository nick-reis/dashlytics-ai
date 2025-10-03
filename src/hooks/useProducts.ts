"use client";

import { useCallback, useEffect, useState } from "react";
import { getProducts, addProduct } from "@/app/actions";
import { Product } from "@/types";
import { productSchema } from "@/schemas";
import z from "zod";

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err: any) {
      console.error("Failed to fetch products: ", err);
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  async function createProduct(product: z.infer<typeof productSchema>) {
    setLoading(true);
    setError(null);
    try {
      await addProduct(product);
      await fetchProducts();
    } catch (err: any) {
      console.error("Failed to add product: ", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, refetch: fetchProducts, createProduct, loading, error };
}
