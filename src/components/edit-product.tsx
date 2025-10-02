"use client";
import React, { use, useEffect, useState } from "react";
import { productSchema } from "@/schemas";
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
import { Textarea } from "./ui/textarea";
import { NumberInput } from "./ui/number-input";
import { Loader2 } from "lucide-react";

type ProductSchema = z.infer<typeof productSchema>;

type ProductFormProps = {
  onSubmit: (values: ProductSchema) => Promise<void> | void;
  initialValues?: Partial<ProductSchema>;
};

export const EditProduct: React.FC<ProductFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
                  placeholder="0"
                  onValueChange={(val) => field.onChange(val ?? undefined)}
                ></NumberInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end items-center">
          <Button
            disabled={loading}
            className=""
            variant={"outline"}
            type="submit"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
