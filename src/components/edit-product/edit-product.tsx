"use client";
import React, { use, useEffect, useState } from "react";
import { productSchema, ProductSchema } from "@/schemas";
import z from "zod";
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
import { Textarea } from "../ui/textarea";
import { NumberInput } from "../ui/number-input";
import { DialogClose } from "@radix-ui/react-dialog";
import LoadIcon from "../ui/load-icon";

type ProductFormProps = {
  onSubmit: (values: ProductSchema) => Promise<void> | void;
  initialValues?: Partial<ProductSchema>;
  useDialog?: boolean;
};

export const EditProduct: React.FC<ProductFormProps> = ({
  onSubmit,
  initialValues,
  useDialog = false,
}) => {
  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues ?? {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
    },
  });

  const handleSubmit = async (values: ProductSchema) => {
    try {
      setLoading(true);
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field}></Input>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Product Description"
                  {...field}
                ></Textarea>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Category Name" {...field}></Input>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder="$0 USD"
                  prefix="$"
                  suffix=" USD"
                  value={field.value}
                  decimalScale={2}
                  onValueChange={(val) => field.onChange(val ?? undefined)}
                ></NumberInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <NumberInput
                  value={field.value}
                  placeholder="0"
                  onValueChange={(val) => field.onChange(val ?? undefined)}
                ></NumberInput>
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
          <Button disabled={loading} className="" type="submit">
            {loading ? <LoadIcon /> : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
