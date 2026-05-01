import { NextResponse } from "next/server";
import { getStore } from "@/server/store";

export async function GET() {
  const { checklists, actionPlans } = getStore();

  const checklistCounts = {
    in_progress: checklists.filter((c) => c.status === "in_progress").length,
    reopened: checklists.filter((c) => c.status === "reopened").length,
    under_analysis: checklists.filter((c) => c.status === "under_analysis").length,
    rejected: checklists.filter((c) => c.status === "rejected").length,
  };

  const actionPlanCounts = {
    delayed: actionPlans.filter((a) => a.status === "delayed").length,
    awaiting_solution: actionPlans.filter((a) => a.status === "awaiting_solution").length,
    solution_under_analysis: actionPlans.filter((a) => a.status === "solution_under_analysis").length,
    awaiting_conclusion: actionPlans.filter((a) => a.status === "awaiting_conclusion").length,
  };

  return NextResponse.json({
    checklistCounts,
    actionPlanCounts,
    lastUpdatedAt: new Date().toISOString(),
  });
}

