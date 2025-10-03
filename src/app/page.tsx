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
import { DashboardHeader } from "@/components/dashboard-header";
import { useAnalyzeQuery } from "@/hooks/useAnalyzeQuery";
import { Loader2 } from "lucide-react";

export const inputSchema = z.object({
  formInput: z
    .string()
    .min(1, "Input is too short")
    .max(1000, "Input is too long"),
});

type InputSchema = z.infer<typeof inputSchema>;

export default function Home() {
  const { loading, error, runQuery, summary } = useAnalyzeQuery();

  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
  });

  const onSubmit = async (values: InputSchema) => {
    runQuery(JSON.stringify(values));
  };

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
                <Button
                  disabled={loading}
                  className=""
                  variant={"outline"}
                  type="submit"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>

            {error && (
              <p className="text-sm p-4 my-4 border rounded-lg text-destructive">
                {error}
              </p>
            )}
            {summary && (
              <p className="text-sm p-4 my-4 border rounded-lg">{summary}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
