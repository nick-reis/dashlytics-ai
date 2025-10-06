"use client";
import { useState } from "react";
import { DataTable, productColumns } from "@/components/data-table";
import { DashboardHeader } from "@/components/dashboard-header";
import { EditProductDialog } from "@/components/edit-product/edit-product-dialog";
import { Product } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { EditProduct } from "@/components/edit-product/edit-product";
import LoadIcon from "@/components/ui/load-icon";
import { Delete } from "lucide-react";

export default function Products() {
  const {
    products,
    initialLoading,
    loading,
    removeProducts,
    editProduct,
    createProduct,
  } = useProducts();
  const [activeEditRow, setActiveEditRow] = useState<Product | null>(null);
  const [activeDeleteRow, setActiveDeleteRow] = useState<Product | null>(null);

  const columns = productColumns({
    onDeleteRowClick: (product) => setActiveDeleteRow(product),
  });

  return (
    <div className="w-full h-full">
      <DashboardHeader title="Products" />
      <div className="flex flex-1">
        <div className="w-full h-screen overflow-y-auto">
          <DataTable
            data={products}
            loading={initialLoading}
            columns={columns}
            onClickRow={setActiveEditRow} // opens edit dialog
          />
        </div>
      </div>

      {/* Edit Product Dialog */}
      {activeEditRow && (
        <EditProductDialog
          product={activeEditRow}
          onEdit={editProduct}
          close={() => setActiveEditRow(null)}
        />
      )}

      {/* Delete Product Dialog */}
      {activeDeleteRow && (
        <Dialog
          open
          onOpenChange={(open) => {
            // Prevent closing while deleting
            if (!loading) setActiveDeleteRow(open ? activeDeleteRow : null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete <strong>{activeDeleteRow.name}</strong>?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex gap-2">
              {/* Cancel Button */}
              <Button
                variant="outline"
                disabled={loading} // prevent cancel while deleting
                onClick={() => !loading && setActiveDeleteRow(null)}
              >
                Cancel
              </Button>

              {/* Delete Button */}
              <Button
                variant="destructive"
                disabled={loading}
                onClick={async () => {
                  // Call removeProducts and wait for hook to finish
                  await removeProducts([activeDeleteRow.id]);
                  // Only close once loading becomes false
                  if (!loading) setActiveDeleteRow(null);
                }}
              >
                {loading ? <LoadIcon /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
