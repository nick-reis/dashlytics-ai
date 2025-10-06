"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditProduct } from "./edit-product";
import { Product } from "@/types";
import { ProductSchema } from "@/schemas";

export const EditProductDialog = ({
  product,
  onEdit,
  close,
}: {
  product: Product;
  onEdit: (id: string, values: ProductSchema) => void;
  close: () => void;
}) => {
  const handleSubmit = async (values: ProductSchema) => {
    await onEdit(product.id, values);
    close();
  };

  return (
    <Dialog open={true} onOpenChange={close}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <EditProduct
          useDialog
          initialValues={product}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
