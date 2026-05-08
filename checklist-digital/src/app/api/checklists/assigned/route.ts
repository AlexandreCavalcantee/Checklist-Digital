import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: tarefas, error } = await supabaseAdmin
    .from("tarefas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Busca perfis dos responsáveis em uma única query
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

  const items = (tarefas || []).map((t) => ({
    id: t.id,
    titulo: t.titulo,
    descricao: t.descricao,
    prioridade: t.prioridade,
    status: t.status,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    responsavelId: t.responsavel_id ?? null,
    responsavel: t.responsavel_id ? (profileMap[t.responsavel_id] ?? null) : null,
  }));

  return NextResponse.json({ items });
}
