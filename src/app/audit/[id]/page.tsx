/*
- Fetches saved audit from Supabase using route param ID
  - Displays total savings + tool breakdown
  - Designed for shareable public links (/audit/[id])
  - Includes OpenGraph metadata for link previews
*/

import { supabaseServer } from "@/lib/supabaseServer";

/*
  Shared Audit Page (Public View)
  Fetches audit by ID from Supabase and renders shareable report UI
*/
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  //Fetch audit record from Supabase using ID
  const { data, error } = await supabaseServer
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase fetch error:", error);

    return <div className="p-10 text-red-400">Error loading audit</div>;
  }

  if (!data) {
    return <div className="p-10 text-white">Not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#060816] px-6 py-12 text-white">
      {/* Background glow */}
      <div
        className="
        absolute
        left-1/2
        top-0
        h-[400px]
        w-[400px]
        -translate-x-1/2
        rounded-full
        bg-violet-600/20
        blur-3xl
      "
      />

      <div
        className="
        relative
        mx-auto
        max-w-4xl
        rounded-3xl
        border
        border-violet-500/20
        bg-[#0F172A]
        p-8
        shadow-2xl
      "
      >
        {/* Heading */}
        <h1
          className="
          bg-gradient-to-r
          from-violet-400
          to-fuchsia-300
          bg-clip-text
          text-4xl
          font-bold
          text-transparent
        "
        >
          Shared Audit Report
        </h1>

        <p className="mt-3 text-gray-400">AI spend optimization summary</p>

        {/* Savings Card */}
        <div
          className="
          mt-8
          rounded-2xl
          border
          border-violet-500/20
          bg-violet-500/10
          p-6
        "
        >
          <p className="text-sm text-violet-200">Estimated Monthly Savings</p>

          <h2 className="mt-2 text-5xl font-bold text-white">
            ${data.total_savings}
          </h2>
        </div>

        {/* Tools */}
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">Tools Breakdown</h2>

          <pre
            className="
            overflow-auto
            rounded-2xl
            border
            border-white/10
            bg-[#020617]
            p-6
            text-sm
            text-violet-200
          "
          >
            {JSON.stringify(data.tools, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

//SEO + OpenGraph metadata for shareable audit preview links
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return {
    title: "LedgerLoop AI Audit",

    description: "See how much this team can save on AI tools.",

    openGraph: {
      title: "LedgerLoop AI Audit",
      description: "AI spend optimization report",
      url: `https://yourdomain.com/audit/${id}`,

      siteName: "LedgerLoop",

      images: [
        {
          url: "https://yourdomain.com/og-image.png",
          width: 1200,
          height: 630,
        },
      ],

      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: "LedgerLoop AI Audit",
      description: "AI spend optimization report",

      images: ["https://yourdomain.com/og-image.png"],
    },
  };
}
