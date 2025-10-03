"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable, productColumns } from "@/components/data-table";
import { DashboardHeader } from "@/components/dashboard-header";
import { EditProduct } from "@/components/edit-product";
import { productSchema } from "@/schemas";
import { Label } from "@radix-ui/react-label";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

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

  const { products, loading, error, createProduct } = useProducts();

  return (
    <div className="w-full h-full">
      <DashboardHeader title="Products" />

      <div className="flex flex-1">
        <div className="w-3/4  ">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
          ) : (
            <DataTable columns={productColumns()} data={products || []} />
          )}
        </div>

        <div className="w-1/2 bg-sidebar border-l border-sidebar-border h-screen flex flex-col overflow-auto ">
          <div className="w-full flex font-medium flex-col gap-4 p-4">
            <Label>Add Product</Label>
            <EditProduct onSubmit={createProduct}></EditProduct>
          </div>
        </div>
      </div>
    </div>
  );
}
