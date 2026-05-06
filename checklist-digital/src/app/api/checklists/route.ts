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

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { title?: string; description?: string }
    | null;

  const title = body?.title?.trim() || "Novo Checklist (Modelo)";
  const description = body?.description?.trim();

  try {
    const { data: tarefa, error } = await supabaseAdmin
      .from("tarefas")
      .insert({
        titulo: title,
        descricao: description || null,
        prioridade: "media",
        status: "pendente",
        tenant_id: TENANT_ID,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const checklist = createChecklistFromTemplate(title, description);
    checklist.id = tarefa.id;

    return NextResponse.json({ checklist }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
