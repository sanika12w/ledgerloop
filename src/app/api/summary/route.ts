import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ToolUsage } from "@/types/audit";
import { summaryPrompt } from "@/prompts/summaryPrompt";
/*
  Initialize OpenAI client using API key
  stored in environment variables
*/
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/*
  POST endpoint: generates AI summary
  from audit results
*/
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tools, teamSize, primaryUseCase } = body;
  
    /*
      Convert structured audit data into
      readable context for LLM
    */
    const auditContext = `
Team Size: ${teamSize}
Primary Use Case: ${primaryUseCase}

Tools:
${tools
  .map(
    (t:ToolUsage) =>
      `- ${t.tool} | Plan: ${t.plan} | Spend: $${t.monthlySpend} | Seats: ${t.seats}`
  )
  .join("\n")}
`;

    // Call OpenAI model to generate summary
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "You are a financial AI SaaS auditor. Write concise, professional, finance-focused insights. No hype. Be factual.",
        },

        {
          role: "user",
          content: summaryPrompt(auditContext),
        },
      ],

      temperature: 0.7,
    });

    //Extract generated text safely
    const summary =
      response.choices[0]?.message?.content;

    return NextResponse.json({
      success: true,
      summary,
    });

  } catch {
    
    return NextResponse.json({
      success: true,
      summary:
        "Your AI tool stack shows potential inefficiencies across overlapping subscriptions and underutilized higher-tier plans. Consolidating similar tools and aligning plans with actual team size can reduce unnecessary recurring costs while maintaining productivity.",
    });
  }
}