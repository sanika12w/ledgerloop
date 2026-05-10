"use client";

import AuditForm from "@/components/AuditForm";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#060816] text-white">
      
      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="relative z-10 px-6 pb-24 pt-16 md:pb-32 md:pt-24">
        
        <div className="mx-auto max-w-5xl text-center">

          <div
            className="
              mb-6
              inline-flex
              rounded-full
              border
              border-violet-500/20
              bg-violet-500/10
              px-4
              py-2
              text-sm
              text-violet-200
            "
          >
            AI Spend Optimization for Modern Teams
          </div>

          <h1
            className="
              text-5xl
              font-bold
              leading-tight
              tracking-tight
              md:text-7xl
            "
          >
            Stop Overspending
            <br />
            <span className="text-white">
              on AI Tools
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-lg
              leading-relaxed
              text-gray-400
              md:text-xl
            "
          >
            Audit your AI stack in under 60 seconds.
          </p>
        </div>
      </section>

      {/* =========================
          AUDIT FORM
      ========================== */}

      <AuditForm />
    </main>
  );
}