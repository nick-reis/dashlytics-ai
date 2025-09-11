"use client";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

export const inputSchema = z.object({
  formInput: z
    .string()
    .min(1, "Input is too short")
    .max(100, "Input is too long"),
});

type InputSchema = z.infer<typeof inputSchema>;

export default function Home() {
  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
  });

  const [result, setResult] = useState<any>(null);

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

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="w-lg flex flex-col items-baseline justify-center gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="formInput"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="w-lg"
                        placeholder="Ask anything"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
          {result && <p className="text-sm">{result}</p>}
        </div>
      </main>
    </div>
  );
}
