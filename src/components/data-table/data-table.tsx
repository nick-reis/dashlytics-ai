"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadIcon from "../ui/load-icon";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  onClickRow?: (row: TData) => void;
  selectedIds: string[]; // IDs of selected rows
  onSelectionChange: (selectedIds: string[]) => void; // callback for parent
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  loading,
  onClickRow,
  selectedIds,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id, // use row.id as the unique key
    state: {
      rowSelection: Object.fromEntries(selectedIds.map((id) => [id, true])),
    },
    onRowSelectionChange: (updaterOrValue) => {
      const newSelection: RowSelectionState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(table.getState().rowSelection)
          : updaterOrValue;

      // Convert to array of selected IDs for parent
      onSelectionChange(Object.keys(newSelection));
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-md border-b">
        <Table className="w-full table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <LoadIcon />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`cursor-pointer ${
                    selectedIds.includes(row.original.id)
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => onClickRow?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="truncate max-w-[100px]" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
