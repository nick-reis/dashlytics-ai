"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCustomers,
  addCustomer,
  deleteCustomers,
  updateCustomer,
  getCustomer,
} from "@/app/actions";
import { CustomerFormValues } from "@/schemas/customer";
import { Customer } from "@/types";

export function useCustomers(id?: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async (options?: { showInitialLoading?: boolean }) => {
    setError(null);
    if (options?.showInitialLoading) setInitialLoading(true);
    try {
      if (id) {
        const data = await getCustomer(id);
        setCustomers([data]);
      } else {
        const data = await getCustomers();
        setCustomers(data || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch customers: ", err);
      setError(err.message ?? "Something went wrong");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  async function removeCustomers(ids: string[]) {
    setLoading(true); setError(null);
    try { await deleteCustomers(ids); await fetchCustomers(); }
    catch (err: any) { console.error("Failed to remove customer(s) ", err); setError(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  }

  async function createCustomer(customer: CustomerFormValues) {
    setLoading(true); setError(null);
    try { await addCustomer(customer); await fetchCustomers(); }
    catch (err: any) { console.error("Failed to add customer: ", err); setError(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  }

  async function editCustomer(customerId: string, customer: CustomerFormValues) {
    setLoading(true); setError(null);
    try { await updateCustomer(customerId, customer); await fetchCustomers(); }
    catch (err: any) { console.error("Failed to update customer: ", err); setError(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  }

  const refetch = useCallback(() => fetchCustomers({ showInitialLoading: true }), [fetchCustomers]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  return {
    customers,
    refetch,
    createCustomer,
    editCustomer,
    removeCustomers,
    loading,
    initialLoading,
    error,
  };
}
