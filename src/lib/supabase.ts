import { createClient } from "@supabase/supabase-js";

export const supabaseAdmint = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLL_KEY!
)