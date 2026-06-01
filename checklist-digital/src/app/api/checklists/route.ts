import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createChecklistFromTemplate } from "@/server/store";

const TENANT_ID = "b1117fe3-97c1-4b8c-98e2-9834ca21f115";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("tarefas")
      .select("id, titulo, status, updated_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      items: data.map((row) => ({
        id: row.id,
        title: row.titulo,
        status: row.status,
        updatedAt: row.updated_at,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

const SETOR_VALUES = ["financas", "operacoes", "qualidade", "rh", "ti", "outros"];
function normalizeSetor(v: unknown): string | null {
  return typeof v === "string" && SETOR_VALUES.includes(v) ? v : null;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { title?: string; description?: string }
    | null;

  const title = body?.title?.trim() || "Novo Checklist (Modelo)";
  const description = body?.description?.trim();
  const responsavelId = (body as { responsavelId?: string } | null)?.responsavelId || null;
  const setor = normalizeSetor((body as { setor?: unknown } | null)?.setor);

  try {
    const base = {
      titulo: title,
      descricao: description || null,
      prioridade: "media",
      status: "pendente",
      tenant_id: TENANT_ID,
      responsavel_id: responsavelId,
    };

    let { data: tarefa, error } = await supabaseAdmin
      .from("tarefas")
      .insert(setor ? { ...base, setor } : base)
      .select()
      .single();

    // Fallback: se a coluna `setor` ainda não existir, cria o checklist sem ela.
    if (error && setor && /setor/i.test(error.message)) {
      ({ data: tarefa, error } = await supabaseAdmin
        .from("tarefas")
        .insert(base)
        .select()
        .single());
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const checklist = createChecklistFromTemplate(title, description);
    checklist.id = tarefa.id;

    return NextResponse.json({ checklist }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
