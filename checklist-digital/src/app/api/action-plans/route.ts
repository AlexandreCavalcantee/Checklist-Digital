import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: tarefas, error } = await supabaseAdmin
    .from("tarefas")
    .select("*")
    .not("status", "eq", "concluido")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const responsavelIds = [...new Set((tarefas || []).map((t) => t.responsavel_id).filter(Boolean))];
  const profileMap: Record<string, { id: string; nome: string }> = {};

  if (responsavelIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .in("id", responsavelIds);
    for (const p of profiles || []) {
      profileMap[p.id] = { id: p.id, nome: p.full_name || "Usuário" };
    }
  }

  const now = Date.now();

  const items = (tarefas || []).map((t) => {
    const createdAt = new Date(t.created_at).getTime();
    const tempoMin: number | null = t.tempo_estimado_minutos ?? null;
    const deadlineMs = tempoMin ? createdAt + tempoMin * 60 * 1000 : null;
    const remainingMs = deadlineMs ? deadlineMs - now : null;

    let urgencia: "atrasado" | "critico" | "urgente" | "atencao" | "normal";
    if (deadlineMs !== null) {
      if (remainingMs! < 0) urgencia = "atrasado";
      else if (remainingMs! < 60 * 60 * 1000) urgencia = "critico";
      else if (remainingMs! < 24 * 60 * 60 * 1000) urgencia = "urgente";
      else if (remainingMs! < 72 * 60 * 60 * 1000) urgencia = "atencao";
      else urgencia = "normal";
    } else {
      const prio = t.prioridade ?? "media";
      urgencia = prio === "alta" ? "critico" : prio === "baixa" ? "normal" : "atencao";
    }

    return {
      id: t.id,
      titulo: t.titulo,
      descricao: t.descricao ?? null,
      prioridade: t.prioridade ?? "media",
      status: t.status ?? "pendente",
      createdAt: t.created_at,
      tempoEstimadoMin: tempoMin,
      deadlineIso: deadlineMs ? new Date(deadlineMs).toISOString() : null,
      remainingMs,
      urgencia,
      responsavelId: t.responsavel_id ?? null,
      responsavel: t.responsavel_id ? (profileMap[t.responsavel_id] ?? null) : null,
    };
  });

  // Ordena: atrasado → critico → urgente → atencao → normal
  const ordem = { atrasado: 0, critico: 1, urgente: 2, atencao: 3, normal: 4 };
  items.sort((a, b) => ordem[a.urgencia] - ordem[b.urgencia]);

  return NextResponse.json({ items });
}
