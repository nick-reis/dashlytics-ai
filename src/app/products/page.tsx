"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { DataTable, productColumns } from "@/components/data-table";
import { DashboardHeader } from "@/components/dashboard-header";
import { EditProduct } from "@/components/edit-product";

export const inputSchema = z.object({
  formInput: z
    .string()
    .min(1, "Input is too short")
    .max(100, "Input is too long"),
});

type InputSchema = z.infer<typeof inputSchema>;

export default function Home() {
  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
  });

  const [result, setResult] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);

  const onSubmit = async (values: InputSchema) => {
    console.log(JSON.stringify(values));
    const res = await fetch("/api/query-sql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: values.formInput }),
    });
    const data = await res.json();
    setResult(data.summary);
    console.log(data);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/retrieve-products");
      const data = await res.json();
      setProducts(data.supabase);
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full h-full">
      <DashboardHeader title="Products" />

      <div className="flex flex-1">
        <div className="w-3/4  ">
          <DataTable columns={productColumns} data={products || []} />
        </div>

        <div className="w-1/2 bg-sidebar border-l border-sidebar-border h-screen flex flex-col overflow-auto ">
          <div className="w-full p-4">
            <EditProduct></EditProduct>
          </div>
        </div>
      </div>
    </div>
  );
}
