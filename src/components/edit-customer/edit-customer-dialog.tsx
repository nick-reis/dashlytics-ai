"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditCustomer } from "./edit-customer";
import { Customer } from "@/types";
import { CustomerFormValues } from "@/schemas/customer";

interface CustomerDialogProps {
  customer?: Customer | null;
  onEdit?: (id: string, values: CustomerFormValues) => Promise<void>;
  onAdd?: (values: CustomerFormValues) => Promise<void>;
  close: () => void;
}

export const EditCustomerDialog = ({
  customer,
  onEdit,
  onAdd,
  close,
}: CustomerDialogProps) => {
  const isEditing = !!customer;

  const initialValues: Partial<CustomerFormValues> = customer
    ? {
        email: customer.email ?? undefined,
        phone: customer.phone ?? undefined,
        first_name: customer.first_name ?? undefined,
        last_name: customer.last_name ?? undefined,
        orders_count: customer.orders_count,
        total_spent: parseFloat(customer.total_spent ?? "0"),
        shipping_address: customer.shipping_address ?? undefined,
      }
    : {};

  const handleSubmit = async (values: CustomerFormValues) => {
    if (isEditing && onEdit && customer) {
      await onEdit(customer.id, values);
    } else if (onAdd) {
      await onAdd(values);
    }
    close();
  };

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>

        <EditCustomer
          useDialog
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
