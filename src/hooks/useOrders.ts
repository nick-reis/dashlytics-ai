"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getOrders,
  addOrder,
  deleteOrders,
  updateOrder,
  getOrder,
} from "@/app/actions";
import { OrderFormValues } from "@/schemas/order";
import { Order } from "@/types";

export function useOrders(id?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (options?: { showInitialLoading?: boolean }) => {
    setError(null);
    if (options?.showInitialLoading) setInitialLoading(true);
    try {
      if (id) {
        const data = await getOrder(id);
        setOrders([data]);
      } else {
        const data = await getOrders();
        setOrders(data || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch orders: ", err);
      setError(err.message ?? "Something went wrong");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  async function removeOrders(ids: string[]) {
    setLoading(true); setError(null);
    try { await deleteOrders(ids); await fetchOrders(); }
    catch (err: any) { console.error("Failed to remove order(s) ", err); setError(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  }

  async function createOrder(order: OrderFormValues) {
    setLoading(true); setError(null);
    try { await addOrder(order); await fetchOrders(); }
    catch (err: any) { console.error("Failed to add order: ", err); setError(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  }

  async function editOrder(orderId: string, order: OrderFormValues) {
    setLoading(true); setError(null);
    try { await updateOrder(orderId, order); await fetchOrders(); }
    catch (err: any) { console.error("Failed to update order: ", err); setError(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  }

  const refetch = useCallback(() => fetchOrders({ showInitialLoading: true }), [fetchOrders]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return {
    orders,
    refetch,
    createOrder,
    editOrder,
    removeOrders,
    loading,
    initialLoading,
    error,
  };
}
