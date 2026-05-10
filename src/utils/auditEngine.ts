/*
  LedgerLoop Audit Engine

  Deterministic rule-based system that analyzes AI tool spend.
  No AI/ML used — only pricing + usage logic.

  Detects inefficiencies like:
  - Overpriced plans
  - Unused seats
  - Tool overlap
  - High spend optimization opportunities
  - Cheaper alternatives
*/

import { AuditFormData, AuditRecommendation } from "@/types/audit";

import { TOOL_PRICING } from "@/data/pricing";

/*
  Main deterministic audit engine
  (finance-style + realistic SaaS optimization rules)
*/
export function generateAudit(data: AuditFormData): AuditRecommendation[] {
  const recommendations: AuditRecommendation[] = [];

  const codingTools = ["Cursor", "GitHub Copilot", "Windsurf"];

  const assistantTools = ["ChatGPT", "Claude", "Gemini"];

  // Count overlaps
  const codingToolCount = data.tools.filter((t) =>
    codingTools.includes(t.tool),
  ).length;

  const assistantToolCount = data.tools.filter((t) =>
    assistantTools.includes(t.tool),
  ).length;

  //  Evaluate each tool
  data.tools.forEach((tool) => {
    const toolPricing = TOOL_PRICING[tool.tool as keyof typeof TOOL_PRICING];

    const currentPrice =
      toolPricing?.[tool.plan as keyof typeof toolPricing] ?? 0;

    const seats = Number(tool.seats || 1);
    const spend = Number(tool.monthlySpend || 0);
    const baselineSpend = spend / Math.max(seats, 1);

    //Detect unrealistic / extreme pricing inputs
    if (baselineSpend >= 500) {
      const estimatedSavings = spend * 0.25;

      recommendations.push({
        tool: tool.tool,
        currentPlan: tool.plan,

        recommendedPlan: "Enterprise pricing audit required",

        reason:
          "Your reported spend is significantly above typical SaaS pricing benchmarks. This indicates potential misconfiguration or enterprise-scale procurement inefficiencies.",

        monthlySavings: Math.round(estimatedSavings),
        yearlySavings: Math.round(estimatedSavings * 12),
      });
    }
    /*
  Rule 1: Overpriced enterprise plans

  Detects small teams using Team/Business/Enterprise plans.
  Suggests lower-tier plans with similar functionality.
*/
    if (
      seats <= 3 &&
      (tool.plan === "Team" ||
        tool.plan === "Business" ||
        tool.plan === "Enterprise")
    ) {
      const cheaperPlan = tool.tool === "ChatGPT" ? "Plus" : "Pro";

      const cheaperPrice =
        toolPricing?.[cheaperPlan as keyof typeof toolPricing] ?? 0;

      const estimatedSavings = Math.min(
        spend * 0.35,
        Math.max(0, (currentPrice - cheaperPrice) * seats),
      );

      if (estimatedSavings > 0) {
        recommendations.push({
          tool: tool.tool,
          currentPlan: tool.plan,
          recommendedPlan: cheaperPlan,

          reason:
            "Small teams rarely require enterprise features like SSO, admin controls, or advanced governance.",

          monthlySavings: Math.round(estimatedSavings),
          yearlySavings: Math.round(estimatedSavings * 12),
        });
      }
    }
    /*
  Rule 2: Unused seats

  Flags when seats purchased exceed actual team size.
  Suggests reducing subscription seats to match usage.
*/
    if (seats > data.teamSize) {
      const unusedSeats = seats - data.teamSize;

      const estimatedSavings = Math.min(
        spend * 0.5,
        unusedSeats * currentPrice,
      );

      if (estimatedSavings > 0) {
        recommendations.push({
          tool: tool.tool,
          currentPlan: tool.plan,

          recommendedPlan: `${data.teamSize} active seats`,

          reason:
            "You are paying for more seats than active users in your team.",

          monthlySavings: Math.round(estimatedSavings),
          yearlySavings: Math.round(estimatedSavings * 12),
        });
      }
    }

    /*
  Rule 3: Coding tool redundancy

  Detects multiple coding assistants in the same stack.
  Recommends consolidation when overlap is high.
*/
    if (
      codingToolCount >= 3 &&
      codingTools.includes(tool.tool) &&
      data.primaryUseCase === "Coding"
    ) {
      const estimatedSavings = spend * 0.1;

      recommendations.push({
        tool: tool.tool,
        currentPlan: tool.plan,

        recommendedPlan: "Consolidate coding tools",

        reason:
          "Multiple AI coding assistants are being used with overlapping functionality.",

        monthlySavings: Math.round(estimatedSavings),
        yearlySavings: Math.round(estimatedSavings * 12),
      });
    }

    /*
  Rule 4: AI assistant duplication

  Flags multiple ChatGPT / Claude / Gemini usage.
  Suggests reducing redundant subscriptions.
*/
    if (
      assistantToolCount >= 3 &&
      assistantTools.includes(tool.tool) &&
      (data.primaryUseCase === "Writing" ||
        data.primaryUseCase === "Research" ||
        data.primaryUseCase === "Mixed")
    ) {
      const estimatedSavings = spend * 0.1;

      recommendations.push({
        tool: tool.tool,
        currentPlan: tool.plan,

        recommendedPlan: "Reduce overlapping assistant tools",

        reason:
          "Multiple AI assistants provide similar capabilities and may be redundant.",

        monthlySavings: Math.round(estimatedSavings),
        yearlySavings: Math.round(estimatedSavings * 12),
      });
    }

    /*
  Rule 5: API cost optimization

  Detects API-heavy users.
  Suggests discounted credits or infrastructure savings.
*/
    if (tool.plan === "API Direct" && spend >= 500) {
      const estimatedSavings = spend * 0.08;

      recommendations.push({
        tool: tool.tool,
        currentPlan: tool.plan,

        recommendedPlan: "Discounted infrastructure credits",

        reason:
          "High API usage may benefit from discounted infrastructure or credit-based pricing.",

        monthlySavings: Math.round(estimatedSavings),
        yearlySavings: Math.round(estimatedSavings * 12),
      });
    }

    /*
  Rule 6: High spend detection

  For large monthly spend (> threshold),
  suggests enterprise pricing negotiation opportunities.
*/
    if (spend >= 5000) {
      const estimatedSavings = spend * 0.05;

      recommendations.push({
        tool: tool.tool,
        currentPlan: tool.plan,

        recommendedPlan: "Enterprise pricing review",

        reason: "High spending may qualify for negotiated enterprise pricing.",

        monthlySavings: Math.round(estimatedSavings),
        yearlySavings: Math.round(estimatedSavings * 12),
      });
    }

    /*
  Rule 7: Cheaper alternatives

  Suggests alternative AI tools with similar capabilities
  but lower subscription cost.
*/
    const normalizedTool = tool.tool.toLowerCase();
    const normalizedPlan = (tool.plan || "").toLowerCase();

    const isAssistant = assistantTools.includes(tool.tool);

    if (isAssistant) {
      let estimatedSavings = 0;
      let alternative = "";

      if (tool.tool === "ChatGPT") {
        alternative = "Claude Pro or Gemini Pro";

        if (
          normalizedPlan.includes("team") ||
          normalizedPlan.includes("business")
        ) {
          estimatedSavings = Math.min(spend * 0.15, 80);
        }
      }

      if (tool.tool === "Claude") {
        alternative = "ChatGPT Plus or Gemini Pro";

        if (!normalizedPlan.includes("pro")) {
          estimatedSavings = Math.min(spend * 0.12, 90);
        }
      }

      if (tool.tool === "Gemini") {
        alternative = "ChatGPT Plus or Claude Pro";

        if (normalizedPlan.includes("pro")) {
          estimatedSavings = Math.min(spend * 0.12, 90);
        }
      }

      if (estimatedSavings > 0 || spend >= 100) {
        recommendations.push({
          tool: tool.tool,
          currentPlan: tool.plan,

          recommendedPlan: alternative,

          reason:
            "Comparable AI tools may offer similar capabilities at lower pricing depending on workflow needs.",

          monthlySavings: Math.round(Math.max(estimatedSavings, spend * 0.1)),

          yearlySavings: Math.round(
            Math.max(estimatedSavings, spend * 0.1) * 12,
          ),
        });
      }
    }
 /*
   Rule 8: No optimization needed

   If spend is low and aligned with usage,
   system returns honest "already optimized" result.
*/
    if (spend < 100 && seats <= data.teamSize) {
      recommendations.push({
        tool: tool.tool,
        currentPlan: tool.plan,

        recommendedPlan: "No change needed",

        reason:
          "Your current setup appears cost-efficient and well aligned with usage.",

        monthlySavings: 0,
        yearlySavings: 0,
      });
    }
  });

  return recommendations;
}
