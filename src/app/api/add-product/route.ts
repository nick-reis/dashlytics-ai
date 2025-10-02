import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const POST = async (req: Request) => {
  try {
    const { product } = await req.json();
    const { data: products, error } = await supabase
      .from("products")
      .insert([product]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      supabase: products,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
