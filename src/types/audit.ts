/*
  Represents a single AI tool entry
  entered by the user
*/
export interface ToolUsage {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  teamSize: number;
  primaryUseCase: string;
  tools: ToolUsage[];
}
//Single recommendation produced by audit engine
export interface AuditRecommendation {
  tool: string;
  currentPlan: string;
  recommendedPlan: string;
  reason: string;
  monthlySavings: number;
  yearlySavings: number;
}
