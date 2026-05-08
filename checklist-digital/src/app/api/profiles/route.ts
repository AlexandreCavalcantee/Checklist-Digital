import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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
  }));

  return NextResponse.json({ items });
}
