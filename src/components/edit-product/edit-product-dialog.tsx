"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditProduct } from "./edit-product";
import { Product } from "@/types";
import { ProductSchema } from "@/schemas";

interface ProductDialogProps {
  product?: Product | null; // optional -> if undefined, adding new product
  onEdit?: (id: string, values: ProductSchema) => Promise<void>;
  onAdd?: (values: ProductSchema) => Promise<void>;
  close: () => void;
}

export const EditProductDialog = ({
  product,
  onEdit,
  onAdd,
  close,
}: ProductDialogProps) => {
  const isEditing = !!product;

  const handleSubmit = async (values: ProductSchema) => {
    if (isEditing && onEdit && product) {
      await onEdit(product.id, values);
    } else if (onAdd) {
      await onAdd(values);
    }
    close();
  };

  return (
    <Dialog open={true} onOpenChange={close}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <EditProduct
          useDialog
          initialValues={product || ({} as Partial<ProductSchema>)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
