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

// Setores conhecidos (espelha UserDepartment em lib/types.ts).
const SETOR_VALUES = ["financas", "operacoes", "qualidade", "rh", "ti", "outros"] as const;
type Setor = (typeof SETOR_VALUES)[number];

function normalizeSetor(v: unknown): Setor | null {
  return typeof v === "string" && (SETOR_VALUES as readonly string[]).includes(v) ? (v as Setor) : null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const periodParam = url.searchParams.get("period");
  const period: Period = isPeriod(periodParam) ? periodParam : "semana";

  const startDate = getPeriodStartDate(period).toISOString();

  // select("*") para ler `setor` da tarefa sem quebrar caso a coluna não exista.
  const { data: tarefas, error: tarefasErr } = await supabaseAdmin
    .from("tarefas")
    .select("*")
    .gte("created_at", startDate);

  if (tarefasErr) {
    return NextResponse.json({ error: tarefasErr.message }, { status: 500 });
  }

  const responsavelIds = [
    ...new Set((tarefas || []).map((t) => t.responsavel_id).filter(Boolean) as string[]),
  ];

  // Mapa de perfis (nome + setor). Usamos select("*") para não quebrar caso a
  // coluna `setor` ainda não exista no banco — o setor simplesmente vem nulo.
  const profileMap: Record<string, { nome: string; setor: Setor | null }> = {};
  if (responsavelIds.length > 0) {
    const { data: profiles, error: profilesErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .in("id", responsavelIds);

    if (profilesErr) {
      return NextResponse.json({ error: profilesErr.message }, { status: 500 });
    }

    for (const p of (profiles || []) as Record<string, unknown>[]) {
      const id = p.id as string;
      profileMap[id] = {
        nome: (p.full_name || p.name || p.username || "Usuário") as string,
        setor: normalizeSetor(p.setor ?? p.department),
      };
    }
  }

  const items = (tarefas || []).map((t) => {
    const prof = t.responsavel_id ? profileMap[t.responsavel_id as string] : undefined;
    // Setor próprio do checklist tem prioridade; se ausente, herda do responsável.
    const setor = normalizeSetor(t.setor) ?? prof?.setor ?? null;
    return {
      id: t.id as string,
      titulo: (t.titulo as string) ?? "",
      status: (t.status as string) ?? "pendente",
      prioridade: (t.prioridade as string) ?? "media",
      responsavelId: (t.responsavel_id as string | null) ?? null,
      responsavelNome: prof?.nome ?? null,
      setor,
      tempoEstimadoMin: (t.tempo_estimado_minutos as number | null) ?? null,
      concluidaEm: (t.concluida_em as string | null) ?? null,
      createdAt: t.created_at as string,
    };
  });

  return NextResponse.json({
    period,
    tarefas: items,
    generatedAt: new Date().toISOString(),
  });
}
