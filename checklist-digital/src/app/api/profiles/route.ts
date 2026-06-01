import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SETOR_VALUES = ["financas", "operacoes", "qualidade", "rh", "ti", "outros"] as const;
type Setor = (typeof SETOR_VALUES)[number];

function normalizeSetor(v: unknown): Setor | null {
  return typeof v === "string" && (SETOR_VALUES as readonly string[]).includes(v) ? (v as Setor) : null;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("[profiles]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data || []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    nome: (p.full_name || p.name || p.username || "Usuário") as string,
    email: (p.email as string | null) ?? null,
    setor: normalizeSetor(p.setor ?? p.department),
  }));

  return NextResponse.json({ items });
}

// Atualiza o setor/departamento de um perfil existente (gerenciamento por setor).
export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: unknown; setor?: unknown } | null;

  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });

  // setor null limpa a atribuição; qualquer valor inválido é rejeitado.
  const setor = body?.setor === null ? null : normalizeSetor(body?.setor);
  if (body?.setor !== null && setor === null) {
    return NextResponse.json({ error: "Setor inválido" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("profiles").update({ setor }).eq("id", id);

  if (error) {
    console.error("[profiles PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id, setor });
}
