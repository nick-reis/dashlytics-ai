import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { openai } from "@/lib/openai";

export const GET = async () => {
  // Test Supabase
  const { data: products, error } = await supabase.from("products").select("*").limit(3);

  // Test OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Say hello from the ecommerce dashboard setup!" }],
  });

  return NextResponse.json({
    supabase: error ? error.message : products,
    openai: completion.choices[0].message.content,
  });
}
