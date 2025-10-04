"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProducts,
  updateProduct,
} from "@/app/actions";
import { ProductSchema } from "@/schemas";
import { set } from "zod";

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err: any) {
      console.error("Failed to fetch products: ", err);
      setError(err.message ?? "Something went wrong");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  async function removeProducts(id: string[]) {
    setLoading(true);
    setError(null);
    try {
      await deleteProducts(id);
      await fetchProducts();
    } catch (err: any) {
      console.error("Failed to remove product(s) ", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function createProduct(product: ProductSchema) {
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

  async function editProduct(id: string, product: ProductSchema) {
    setLoading(true);
    setError(null);
    try {
      await updateProduct(id, product);
      await fetchProducts();
    } catch (err: any) {
      console.error("Failed to update product: ", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    refetch: fetchProducts,
    createProduct,
    editProduct,
    removeProducts,
    loading,
    initialLoading,
    error,
  };
}
