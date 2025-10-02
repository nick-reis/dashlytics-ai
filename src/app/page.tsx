"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { DataTable, productColumns } from "@/components/data-table";
import { DashboardHeader } from "@/components/dashboard-header";

export const inputSchema = z.object({
  formInput: z
    .string()
    .min(1, "Input is too short")
    .max(1000, "Input is too long"),
});

type InputSchema = z.infer<typeof inputSchema>;

export default function Home() {
  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
  });

  const [result, setResult] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);

  const onSubmit = async (values: InputSchema) => {
    console.log(JSON.stringify(values));
    const res = await fetch("/api/query-sql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: values.formInput }),
    });
    const data = await res.json();
    setResult(data.summary);
    console.log(data);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/retrieve-products");
      const data = await res.json();
      setProducts(data.supabase);
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full h-full">
      <DashboardHeader title="Dashboard" />

      <div className="flex flex-1">
        <div className="w-3/4  "></div>

        <div className="w-1/2 bg-sidebar border-l border-sidebar-border h-screen flex flex-col overflow-auto items-center justify-center">
          <div className="w-full p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="formInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className=""
                          placeholder="Ask anything"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant={"outline"} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
            {result && (
              <p className="text-sm p-4 my-4 border rounded-lg">{result}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
