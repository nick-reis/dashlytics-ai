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
import LoadIcon from "@/components/ui/load-icon";
import Chat from "@/components/chat";

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

  return (
    <div className="w-full h-full">
      <DashboardHeader title="Dashboard" />

      <div className="flex h-full flex-1"></div>
    </div>
  );
}
