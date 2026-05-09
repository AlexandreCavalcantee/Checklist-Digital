import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type Period = "semana" | "mes" | "trimestre";

function isPeriod(v: unknown): v is Period {
  return v === "semana" || v === "mes" || v === "trimestre";
}

function getPeriodStartDate(period: Period): Date {
  const d = new Date();
  if (period === "semana") d.setDate(d.getDate() - 7);
  else if (period === "mes") d.setMonth(d.getMonth() - 1);
  else d.setMonth(d.getMonth() - 3);
  return d;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const periodParam = url.searchParams.get("period");
  const period: Period = isPeriod(periodParam) ? periodParam : "semana";

  const startDate = getPeriodStartDate(period).toISOString();

  const { data: tarefas, error: tarefasErr } = await supabaseAdmin
    .from("tarefas")
    .select("id, titulo, status, prioridade, responsavel_id, tempo_estimado_minutos, created_at")
    .gte("created_at", startDate);

  if (tarefasErr) {
    return NextResponse.json({ error: tarefasErr.message }, { status: 500 });
  }

  const responsavelIds = [
    ...new Set((tarefas || []).map((t) => t.responsavel_id).filter(Boolean) as string[]),
  ];

  const profileMap: Record<string, string> = {};
  if (responsavelIds.length > 0) {
    const { data: profiles, error: profilesErr } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .in("id", responsavelIds);

    if (profilesErr) {
      return NextResponse.json({ error: profilesErr.message }, { status: 500 });
    }

    for (const p of profiles || []) {
      profileMap[p.id] = p.full_name || "Usuário";
    }
  }

  const items = (tarefas || []).map((t) => ({
    id: t.id as string,
    titulo: (t.titulo as string) ?? "",
    status: (t.status as string) ?? "pendente",
    prioridade: (t.prioridade as string) ?? "media",
    responsavelId: (t.responsavel_id as string | null) ?? null,
    responsavelNome: t.responsavel_id ? (profileMap[t.responsavel_id] ?? null) : null,
    tempoEstimadoMin: (t.tempo_estimado_minutos as number | null) ?? null,
    createdAt: t.created_at as string,
  }));

  return NextResponse.json({
    period,
    tarefas: items,
    generatedAt: new Date().toISOString(),
  });
}
