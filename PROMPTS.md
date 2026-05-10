# LedgerLoop — Prompt Design & System Rules

LedgerLoop is a deterministic AI spend optimization engine.
It does NOT use AI for reasoning. All outputs are rule-based and explainable.

---

#  CORE PRINCIPLES

All outputs must be:

- Deterministic (same input → same output)
- Realistic (no inflated savings)
- Capped (no extreme % multipliers)
- Honest (no fake savings if system is already optimal)
- Explainable (every recommendation must map to a rule)
- Tool-aware (Gemini ≠ ChatGPT ≠ Windsurf)
- Use-case aware (Coding ≠ Writing ≠ Research)

---

#  INPUT STRUCTURE

```ts
AuditFormData = {
  tools: {
    tool: string;
    plan: string;
    monthlySpend: number;
    seats: number;
  }[];

  teamSize: number;

  primaryUseCase:
     "Coding"
     "Writing"
     "Research"
     "Mixed";
}