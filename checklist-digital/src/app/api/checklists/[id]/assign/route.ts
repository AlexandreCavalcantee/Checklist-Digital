import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SETOR_VALUES = ["financas", "operacoes", "qualidade", "rh", "ti", "outros"];
function normalizeSetor(v: unknown): string | null {
  return typeof v === "string" && SETOR_VALUES.includes(v) ? v : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as
    | { responsavelId?: string | null; setor?: string | null }
    | null;

  // Atualização parcial: só altera os campos presentes no corpo.
  const update: Record<string, unknown> = {};
  if (body && "responsavelId" in body) update.responsavel_id = body.responsavelId ?? null;
  if (body && "setor" in body) update.setor = body.setor === null ? null : normalizeSetor(body.setor);

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
  }

  let { error } = await supabaseAdmin.from("tarefas").update(update).eq("id", id);

  // Fallback: se a coluna `setor` ainda não existir, aplica os demais campos.
  if (error && "setor" in update && /setor/i.test(error.message)) {
    delete update.setor;
    if (Object.keys(update).length > 0) {
      ({ error } = await supabaseAdmin.from("tarefas").update(update).eq("id", id));
    } else {
      error = null;
    }
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
