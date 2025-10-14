"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditOrder } from "./edit-order";
import { Order } from "@/types";
import { OrderFormValues } from "@/schemas/order";

interface OrderDialogProps {
  order?: Order | null;
  onEdit?: (id: string, values: OrderFormValues) => Promise<void>;
  onAdd?: (values: OrderFormValues) => Promise<void>;
  close: () => void;
}

export const EditOrderDialog = ({
  order,
  onEdit,
  onAdd,
  close,
}: OrderDialogProps) => {
  const isEditing = !!order;

  const initialValues: Partial<OrderFormValues> = order
    ? {
        customer_id: order.customer_id,
        product_ids: order.product_ids ?? [],
        total_amount: parseFloat(order.total_amount ?? "0"),
        status: order.status,
      }
    : {};

  const handleSubmit = async (values: OrderFormValues) => {
    if (isEditing && onEdit && order) {
      await onEdit(order.id, values);
    } else if (onAdd) {
      await onAdd(values);
    }
    close();
  };

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Order" : "Add Order"}</DialogTitle>
        </DialogHeader>

        <EditOrder
          useDialog
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
