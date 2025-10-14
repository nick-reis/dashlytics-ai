"use client";
import React, { useState } from "react";
import { orderSchema, type OrderFormValues } from "@/schemas/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { DialogClose } from "@radix-ui/react-dialog";
import LoadIcon from "@/components/ui/load-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OrderFormProps = {
  onSubmit: (values: OrderFormValues) => Promise<void> | void;
  initialValues?: Partial<OrderFormValues>;
  useDialog?: boolean;
};

export const EditOrder: React.FC<OrderFormProps> = ({
  onSubmit,
  initialValues,
  useDialog = false,
}) => {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_id: initialValues?.customer_id ?? "",
      product_ids: initialValues?.product_ids ?? [],
      total_amount: initialValues?.total_amount ?? 0,
      status: initialValues?.status ?? "open",
    },
  });

  const [loading, setLoading] = useState(false);

  const productIdsText = (form.watch("product_ids") || []).join(",") || "";
  const handleProductIdsChange = (val: string) => {
    const arr = val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    form.setValue("product_ids", arr, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSubmit = async (values: OrderFormValues) => {
    try {
      setLoading(true);
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="UUID of customer"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Product IDs (comma-separated)</FormLabel>
          <FormControl>
            <Input
              placeholder="uuid-1, uuid-2, uuid-2"
              value={productIdsText}
              onChange={(e) => handleProductIdsChange(e.currentTarget.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="total_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total</FormLabel>
              <FormControl>
                <NumberInput
                  prefix="$"
                  suffix=" USD"
                  decimalScale={2}
                  value={field.value}
                  placeholder="$0.00 USD"
                  onValueChange={(val) => field.onChange(val ?? undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        Open
                      </span>
                    </SelectItem>

                    <SelectItem value="paid">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Paid
                      </span>
                    </SelectItem>

                    <SelectItem value="fulfilled">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Fulfilled
                      </span>
                    </SelectItem>

                    <SelectItem value="cancelled">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Cancelled
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex gap-2 justify-end items-center">
          {useDialog && (
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          )}
          <Button disabled={loading} type="submit">
            {loading ? <LoadIcon /> : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
