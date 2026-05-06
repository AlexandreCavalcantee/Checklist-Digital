import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getChecklistById } from "@/server/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Tenta memória primeiro (sessão atual)
  const stored = getChecklistById(id);
  if (stored) return NextResponse.json({ checklist: stored });

  // Fallback: busca header no Supabase (após reinício do servidor)
  const { data: tarefa, error } = await supabaseAdmin
    .from("tarefas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !tarefa)
    return NextResponse.json({ error: "Checklist não encontrado" }, { status: 404 });

  return NextResponse.json({
    checklist: {
      id: tarefa.id,
      title: tarefa.titulo,
      description: tarefa.descricao,
      status: tarefa.status,
      createdAt: tarefa.created_at,
      updatedAt: tarefa.updated_at,
      sections: [],
    },
  });
}
