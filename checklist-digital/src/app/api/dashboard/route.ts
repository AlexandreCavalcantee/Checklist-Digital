import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: tarefas, error } = await supabaseAdmin
    .from("tarefas")
    .select("status");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const counts = (tarefas || []).reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    checklistCounts: {
      in_progress: (counts["in_progress"] || 0) + (counts["pendente"] || 0),
      reopened: counts["reopened"] || 0,
      under_analysis: counts["under_analysis"] || 0,
      rejected: counts["rejected"] || 0,
    },
    actionPlanCounts: {
      delayed: 0,
      awaiting_solution: 0,
      solution_under_analysis: 0,
      awaiting_conclusion: 0,
    },
    lastUpdatedAt: new Date().toISOString(),
  });
}
