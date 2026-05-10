/*
  Main audit form state
  Stores all user inputs like tools, seats, spend, and use case
  Generates cost-saving recommendations
  Saves results to Supabase
  Provides shareable audit links
  Captures leads for optimization alerts
*/

"use client";
import { useEffect, useState } from "react";
import { AI_TOOLS, USE_CASES } from "@/constants/tools";
import { AuditFormData } from "@/types/audit";
import { generateAudit } from "@/utils/auditEngine";
import ResultsPanel from "@/components/ResultsPanel";
import { supabase } from "@/lib/supabaseClient";

const defaultForm: AuditFormData = {
  teamSize: 1,
  primaryUseCase: "Coding",

  tools: [
    {
      tool: "Cursor",
      plan: "Pro",
      monthlySpend: 20,
      seats: 1,
    },
  ],
};

export default function AuditForm() {
  const [leadEmail, setLeadEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuditFormData>(defaultForm);
  const [copied, setCopied] = useState(false);

  const generateReport = async () => {
    setLoading(true);

    try {
      // Run deterministic audit engine
      const recommendations = generateAudit(formData);

      // Calculate total savings
      const totalMonthlySavings = recommendations.reduce(
        (sum, r) => sum + r.monthlySavings,
        0,
      );

      //Call AI summary API
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // SAVE AUDIT TO SUPABASE
      const { data: auditData, error } = await supabase
        .from("audits")
        .insert([
          {
            tools: formData.tools,
            recommendations,
            total_savings: totalMonthlySavings,
          },
        ])
        .select()
        .single();

      const shareUrl = `${window.location.origin}/audit/${auditData.id}`;
      console.log("Share URL:", shareUrl);

      if (error) {
        console.error("Audit insert error:", error);
      }

      setResults({
        recommendations,
        totalMonthlySavings,
        summary: data.summary,
        auditId: auditData?.id,
        shareUrl,
      });
    } catch (err) {
      console.error("Audit generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const submitLead = async () => {
    try {
      await fetch("/api/lead", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: leadEmail,
          companyName,
          role,
          teamSize: formData.teamSize,
          monthlySavings: results?.totalMonthlySavings || 0,
          website: honeypot,
        }),
      });
      alert("Audit saved successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  //Load saved data from localStorage  when page first loads
  useEffect(() => {
  const savedData =
    localStorage.getItem("ledgerloop-audit");

  if (savedData) {
    const parsedData =
      JSON.parse(savedData) as AuditFormData;

    setFormData(parsedData);
  }
}, []);

  useEffect(() => {
    localStorage.setItem("ledgerloop-audit", JSON.stringify(formData));
  }, [formData]);

  //Add new empty tool row
  const addTool = () => {
    setFormData({
      ...formData,

      tools: [
        ...formData.tools,

        {
          tool: "ChatGPT",
          plan: "Plus",
          monthlySpend: 20,
          seats: 1,
        },
      ],
    });
  };

  // Remove tool by index
  const removeTool = (index: number) => {
    const updatedTools = formData.tools.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tools: updatedTools,
    });
  };

  //Update specific tool field
  const updateTool = (index: number, field: string, value: string | number) => {
    const updatedTools = [...formData.tools];

    updatedTools[index] = {
      ...updatedTools[index],

      [field]: value,
    };

    setFormData({
      ...formData,
      tools: updatedTools,
    });
  };

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold">Audit Your AI Stack</h2>

          <p className="mt-4 text-gray-400">
            Enter your current AI tools and spending.
          </p>
        </div>

        {/* Main form card */}
        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-6
            backdrop-blur ">
          {/*  TEAM SIZE*/}
          <div className="mb-6">
            <label className="mb-2 block text-sm text-gray-300">
              Team Size
            </label>
            <input
              type="number"
              value={formData.teamSize}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  teamSize: Number(e.target.value),
                })
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111827]
                px-4
                py-3
                outline-none" />
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm text-gray-300">
              Primary Use Case
            </label>
            <select
              value={formData.primaryUseCase}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primaryUseCase: e.target.value,
                })
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111827]
                px-4
                py-3
                outline-none">
              {USE_CASES.map((useCase) => (
                <option key={useCase} value={useCase}>
                  {useCase}
                </option>
              ))}
            </select>
          </div>

          {/* TOOL ENTRIES */}
          <div className="space-y-6">
            {formData.tools.map((toolData, index) => {
              
              //Find matching tool object to access plans
              const selectedTool = AI_TOOLS.find(
                (tool) => tool.name === toolData.tool,
              );

              return (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#0F172A]
                    p-5">
                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      justify-between">
                    <h3 className="font-semibold">Tool #{index + 1}</h3>

                    {/* Remove button */}
                    <button
                      onClick={() => removeTool(index)}
                      className="
                        text-sm
                        text-red-400">
                      Remove
                    </button>
                  </div>

                  {/* Grid */}
                  <div
                    className="
                      grid
                      gap-4
                      md:grid-cols-2">
                    {/* TOOL SELECT */}
                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Tool
                      </label>

                      <select
                        value={toolData.tool}
                        onChange={(e) => {
                          //Newly selected tool name
                          const selectedToolName = e.target.value;

                          // Find matching tool object
                          const matchedTool = AI_TOOLS.find(
                            (tool) => tool.name === selectedToolName,
                          );

                          //Create updated tools array
                          const updatedTools = [...formData.tools];

                          //Update tool name
                          // AND reset plan automatically
                          updatedTools[index] = {
                            ...updatedTools[index],
                            tool: selectedToolName,
                            plan: matchedTool?.plans[0] || "",
                          };

                          setFormData({
                            ...formData,
                            tools: updatedTools,
                          });
                        }}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-[#111827]
                          px-4
                          py-3
                          outline-none">
                        {AI_TOOLS.map((tool) => (
                          <option key={tool.name} value={tool.name}>
                            {tool.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* PLAN SELECT */}
                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Plan
                      </label>
                      <select
                        value={toolData.plan}
                        onChange={(e) =>
                          updateTool(index, "plan", e.target.value)
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-[#111827]
                          px-4
                          py-3
                          outline-none">
                        {selectedTool?.plans.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* MONTHLY SPEND */}
                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Monthly Spend ($)
                      </label>
                      <input
                        type="number"
                        value={toolData.monthlySpend}
                        onChange={(e) =>
                          updateTool(
                            index,
                            "monthlySpend",
                            Number(e.target.value),
                          )
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-[#111827]
                          px-4
                          py-3
                          outline-none"/>
                    </div>

                    {/* SEATS */}
                    <div>
                      <label className="mb-2 block text-sm text-gray-300">
                        Seats
                      </label>
                      <input
                        type="number"
                        value={toolData.seats}
                        onChange={(e) =>
                          updateTool(index, "seats", Number(e.target.value))
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-[#111827]
                          px-4
                          py-3
                          outline-none"/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/*  ACTION BUTTONS*/}
          <div
            className="
              mt-8
              flex
              flex-col
              gap-4
              sm:flex-row" >
            {/* Add tool */}
            <button
              onClick={addTool}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-6
                py-4
                font-semibold
                transition
                hover:bg-white/10">
              + Add Another Tool
            </button>

            {/* Audit button */}
            <button
              onClick={generateReport}
              disabled={loading}
              className="
              rounded-2xl
              bg-violet-500
              px-6
              py-4
              font-semibold
              transition
              hover:bg-violet-400
              disabled:opacity-50">
              {loading ? "Analyzing..." : "Generate Audit Report"}
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div className="mt-10">
          {/* AI Summary */}
          <div className="mx-auto max-w-5xl mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
            <p className="text-gray-300">{results.summary}</p>
          </div>

          {/* Results Panel */}
          <ResultsPanel
            recommendations={results.recommendations}
            totalMonthlySavings={results.totalMonthlySavings}
          />

          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-bold">Get Optimization Alerts</h3>
            <p className="mt-2 text-gray-400">
              Receive future AI savings recommendations.
            </p>
            <div className="mt-6 space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"/>
              <input
                type="email"
                placeholder="Email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3"
              />
              <input
                type="text"
                placeholder="Company Name (optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3"
              />
              <input
                type="text"
                placeholder="Role (optional)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3"
              />
              <button
                onClick={submitLead}
                className="w-full rounded-2xl bg-violet-500 px-6 py-4 font-semibold"
              >
                Save My Audit
              </button>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 text-center">
            <h3 className="text-lg font-semibold text-white">
              Share your audit
            </h3>
            <p className="mt-2 text-sm text-gray-300">
              Anyone with this link can view the results
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/audit/${results.auditId}`,
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className=" mt-4
              w-full
              rounded-xl
              bg-violet-500
              px-6
              py-4
              text-lg
              font-semibold
              text-white
              hover:bg-violet-400
              transition">
              {copied ? "Copied " : "Copy Shareable Link"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
