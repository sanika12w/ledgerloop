"use client";

import { AuditRecommendation } from "@/types/audit";

/*
  Props:
  - recommendations from audit engine
  - original form data
*/
type Props = {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
};

export default function ResultsPanel({
  recommendations,
  totalMonthlySavings,
}: Props) {
  //  Compute annual savings

  const totalAnnualSavings = totalMonthlySavings * 12;

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        {/*  HERO SAVINGS HEADER*/}
        <div
          className="
            mb-10
            rounded-3xl
            border
            border-white/10
            bg-gradient-to-r
            from-violet-500/10
            to-fuchsia-500/10
            p-8
            text-center
          "
        >
          <h2 className="text-sm text-gray-300">Your AI Spend Audit Results</h2>

          {/* Monthly savings */}
          <h1 className="mt-4 text-5xl font-bold">
            ${totalMonthlySavings.toFixed(0)}
            <span className="text-xl text-gray-400">/month saved</span>
          </h1>

          {/* Annual savings */}
          <p className="mt-3 text-gray-400">
            ≈ ${totalAnnualSavings.toFixed(0)} yearly savings potential
          </p>
        </div>

        {/* TOOL BREAKDOWN*/}
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border
                border-white/10
                bg-[#0F172A]
                p-6
              "
            >
              {/* Tool name */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{rec.tool}</h3>

                {/* Savings badge */}
                <span className="text-green-400 font-semibold">
                  +${rec.monthlySavings}/mo saved
                </span>
              </div>

              {/* Plans */}
              <p className="mt-2 text-sm text-gray-400">
                {rec.currentPlan} → {rec.recommendedPlan}
              </p>

              {/* Reason */}
              <p className="mt-3 text-sm text-gray-300">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
