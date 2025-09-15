"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: () => "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div>
          <Button
            variant={"ghost"}
            className="group-hover:opacity-100 opacity-0 transition-opacity"
          >
            <Pencil></Pencil>
          </Button>
        </div>
      );
    },
  },
];
