import { createClient } from "@supabase/supabase-js";

/*
  SERVER-SIDE SUPABASE CLIENT
  Uses SERVICE ROLE KEY (NEVER expose to frontend)
*/
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
