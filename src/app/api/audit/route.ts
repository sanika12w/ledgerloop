import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rateLimit";

 /*
   Server-side Supabase admin client

   - Uses service role key (bypasses RLS)
   - ONLY for backend API routes
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/*
  POST /api/audit
  - Saves audit result
  - Returns shareable URL
*/
export async function POST(req: Request) {
  try {
    //RATE LIMIT (basic abuse protection)
    const ip =
      req.headers.get("x-forwarded-for") || "unknown";

    const allowed = rateLimit(ip);

    if (!allowed.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json();

    const {
      tools,
      recommendations,
      totalSavings,
    } = body;

    if (!tools || !recommendations) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

      // Save to supabase
    const { data, error } = await supabase
      .from("audits")
      .insert([
        {
          tools,
          recommendations,
          total_savings: totalSavings,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase audit error:", error);

      return NextResponse.json(
        { success: false, message: "Failed to save audit" },
        { status: 500 }
      );
    }

     
    return NextResponse.json({
      success: true,
      id: data.id,
      shareUrl: `/audit/${data.id}`,
    });

  } catch (error) {
    console.error("Audit API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}