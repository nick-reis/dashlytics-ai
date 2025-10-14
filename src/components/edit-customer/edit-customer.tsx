"use client";
import React, { useState } from "react";
import { customerSchema, type CustomerFormValues } from "@/schemas/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

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
import { Separator } from "../ui/separator";

type CustomerFormProps = {
  onSubmit: (values: CustomerFormValues) => Promise<void> | void;
  initialValues?: Partial<CustomerFormValues>;
  useDialog?: boolean;
};

export const EditCustomer: React.FC<CustomerFormProps> = ({
  onSubmit,
  initialValues,
  useDialog = false,
}) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      email: initialValues?.email,
      phone: initialValues?.phone,
      first_name: initialValues?.first_name,
      last_name: initialValues?.last_name,
      orders_count: initialValues?.orders_count ?? 0,
      total_spent: initialValues?.total_spent ?? 0,
      shipping_address: initialValues?.shipping_address,
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      setLoading(true);
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  const toLocalInput = (d?: Date | null) =>
    d ? new Date(d).toISOString().slice(0, 16) : "";

  // Helpers: keep inputs controlled but store undefined for empty strings
  const normalizeStr =
    (onChange: (v: string | undefined) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(
        e.currentTarget.value.trim() === "" ? undefined : e.currentTarget.value
      );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First name"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last name"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@email.com"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1 (555) 555-5555"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="orders_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orders count</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    placeholder="0"
                    onValueChange={(val) => field.onChange(val ?? undefined)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_spent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total spent</FormLabel>
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
        </div>
        <Separator />
        <h1>Shipping Address</h1>
        {/* Shipping Address (optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shipping_address.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full name"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shipping_address.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1 (555) 555-5555"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shipping_address.address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 1</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St"
                  value={field.value ?? ""}
                  onChange={normalizeStr(field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shipping_address.address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 2</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apt, suite, etc. (optional)"
                  value={field.value ?? ""}
                  onChange={normalizeStr(field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="shipping_address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="City"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shipping_address.region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Region</FormLabel>
                <FormControl>
                  <Input
                    placeholder="State or region"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shipping_address.postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ZIP / Postal code"
                    value={field.value ?? ""}
                    onChange={normalizeStr(field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shipping_address.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="Country"
                  value={field.value ?? ""}
                  onChange={normalizeStr(field.onChange)}
                />
              </FormControl>
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
