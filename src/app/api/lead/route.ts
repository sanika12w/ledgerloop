/*- Receives audit lead data from frontend
  - Validates input
  - Stores lead in Supabase
  - Sends confirmation email via Resend
  - Includes basic spam + rate limiting protection
*/
import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { Resend } from "resend";
import { rateLimit } from "@/lib/rateLimit";

//Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

//Resend email client
const resend = new Resend(
  process.env.RESEND_API_KEY
);

/*
  POST endpoint:
  - stores lead
  - sends confirmation email
*/
export async function POST(req: Request) {
/*
  Rate limiting layer

  - Identifies user IP
  - Prevents spam / abuse requests
*/
const ip =
  req.headers.get("x-forwarded-for") || "unknown";

const allowed = rateLimit(ip);

if (!allowed.success) {
  return NextResponse.json(
    { success: false, message: "Too many requests" },
    { status: 429 }
  );
}
  try {

    const body = await req.json();

    const {
      email,
      companyName,
      role,
      teamSize,
      monthlySavings,
      website,
    } = body;


    if (!email || !email.includes("@")) {
  return NextResponse.json({ success: false, message: "Invalid email" });
}

if (!teamSize || teamSize < 1) {
  return NextResponse.json({ success: false, message: "Invalid team size" });
}

if (!monthlySavings || monthlySavings < 0) {
  return NextResponse.json({ success: false, message: "Invalid savings" });
}

    /*
  Honeypot spam protection

  - Hidden field should stay empty
  - If filled → likely bot
*/
    if (website) {

      return NextResponse.json({
        success: false,
        message: "Spam detected",
      });
    }

    if (!email) {

      return NextResponse.json({
        success: false,
        message: "Email required",
      });
    }

    // Store lead in Supabase database
    const { error } = await supabase.from("leads").insert([
  {
    email,
    company_name: companyName, 
    role,
    team_size: teamSize,
    monthly_savings: monthlySavings,
  },
]);

    if (error) {

      console.error(
        "Supabase Error:",
        error
      );

      return NextResponse.json({
        success: false,
        message:
          "Failed to save lead",
      });
    }

    /*
  Detect high-value leads
  Used to trigger upsell messaging
*/
    const highSavings =
      monthlySavings > 500;

   console.log("ABOUT TO SEND EMAIL:", email);
    await resend.emails.send({
      from:
        "onboarding@resend.dev",

      to: email,

      subject:
        "Your LedgerLoop AI Audit",

      html: `
        <h2>
          AI Spend Audit Received
        </h2>

        <p>
          Thanks for using LedgerLoop.
        </p>

        <p>
          Your audit has been generated successfully.
        </p>

        ${
          highSavings
            ? `
          <p>
            Your stack shows significant
            optimization potential.

            Credex may reach out regarding
            discounted AI infrastructure credits.
          </p>
          `
            : `
          <p>
            We'll notify you when new
            optimization opportunities
            become available.
          </p>
          `
        }
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "Lead API Error:",
      error
    );

    return NextResponse.json({
      success: false,
      message:
        "Something went wrong",
    });
  }
}