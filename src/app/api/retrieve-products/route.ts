import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const GET = async () => {
  const { data: products, error } = await supabase.from("products").select("*");

  return NextResponse.json({
    supabase: error ? error.message : products,
  });
};
