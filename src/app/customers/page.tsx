"use client";
import { useEffect, useState } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import LoadIcon from "@/components/ui/load-icon";
import { Plus, RefreshCcw, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    products,
    initialLoading,
    loading,
    removeProducts,
    editProduct,
    refetch,
    createProduct,
  } = useProducts();

  const [activeAddRow, setActiveAddRow] = useState<boolean>(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const editId = searchParams.get("edit");

  const columns = productColumns({
    onDeleteRowClick: (product) => {
      selectedProducts.push(product.id);
      setDeleteDialogOpen(true);
    },
  });

  // Helper to open edit dialog by updating the URL
  const openEditDialog = (id: string) => {
    router.push(`/products?edit=${id}`);
  };

  // Close the edit dialog by removing the query param
  const closeEditDialog = () => {
    router.push("/products");
  };

  useEffect(() => {
    console.log(selectedProducts);
  }, [selectedProducts]);

  return (
    <div className="w-full h-full">
      <DashboardHeader
        title="Customers"
        actions={
          <div className="w-full flex flex-row gap-2 justify-end">
            {selectedProducts.length > 0 && deleteDialogOpen == false && (
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant={"secondary"}
              >
                <Trash />
                Delete {selectedProducts.length} product(s)
              </Button>
            )}
            <Button onClick={() => setActiveAddRow(true)} variant={"outline"}>
              <Plus />
              Add Product
            </Button>

            <Button
              disabled={loading || initialLoading}
              onClick={refetch}
              variant={"outline"}
            >
              {loading || initialLoading ? (
                <RefreshCcw className=" animate-spin" />
              ) : (
                <RefreshCcw />
              )}
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex flex-1">
        <div className="w-full h-screen overflow-y-auto">
          <DataTable
            data={products}
            selectedIds={selectedProducts}
            onSelectionChange={setSelectedProducts}
            loading={initialLoading}
            columns={columns}
            onClickRow={(row: Product) => openEditDialog(row.id)} // opens edit dialog
          />
        </div>
      </div>

      {/* Edit Product Dialog */}
      {editId && !initialLoading && (
        <EditProductDialog
          product={products.find((p) => p.id === editId)!}
          onEdit={editProduct}
          close={closeEditDialog}
        />
      )}

      {/* Add Product Dialog */}
      {activeAddRow && (
        <EditProductDialog
          onAdd={createProduct}
          close={() => setActiveAddRow(false)}
        ></EditProductDialog>
      )}

      {/* Delete Product Dialog */}
      {deleteDialogOpen && (
        <Dialog
          open
          onOpenChange={() => {
            setSelectedProducts([]);
            setDeleteDialogOpen(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete{" "}
                <strong>
                  {selectedProducts.length === 1
                    ? products.find((p) => p.id === selectedProducts[0])?.name
                    : `${selectedProducts.length} products`}
                </strong>
                ?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedProducts([]);
                  setDeleteDialogOpen(false);
                }}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                disabled={loading}
                onClick={async () => {
                  await removeProducts(selectedProducts);

                  if (!loading) {
                    setSelectedProducts([]); // clear selection after deletion
                    setDeleteDialogOpen(false);
                  }
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
