"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type OrderEnriched } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderColumnOptions {
  onDeleteRowClick: (order: OrderEnriched) => void;
}

const statusColor: Record<OrderEnriched["status"], string> = {
  open: "bg-blue-500",
  paid: "bg-green-500",
  fulfilled: "bg-purple-500",
  cancelled: "bg-red-500",
};

export const orderColumns = ({
  onDeleteRowClick,
}: OrderColumnOptions): ColumnDef<OrderEnriched>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 32,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderEnriched["status"];
      const dot = statusColor[status] ?? "bg-muted-foreground";
      return (
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          <span className="capitalize">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.getValue("customer_name") as string | null;
      return <div>{name || "—"}</div>;
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const names = row.original.product_names ?? [];
      if (!names.length) return <div>—</div>;
      const preview = names.slice(0, 3).join(", ");
      const extra = names.length > 3 ? ` +${names.length - 3}` : "";
      return (
        <div title={names.join(", ")}>
          {preview}
          {extra}
        </div>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const v = row.getValue("created_at") as string;
      return <div>{v ? new Date(v).toLocaleString() : "—"}</div>;
    },
  },

  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ row }) => {
      const val = parseFloat(String(row.getValue("total_amount") ?? 0));
      return (
        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number.isFinite(val) ? val : 0)}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={(e) => e.stopPropagation()}
              variant="ghost"
              className="h-8 w-8"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
            <DropdownMenuLabel hidden>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.customer_id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteRowClick(order)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
