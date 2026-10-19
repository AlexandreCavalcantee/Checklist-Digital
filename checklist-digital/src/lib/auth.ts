import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// As rotas da API usam a service role (ignora RLS), então toda requisição
// precisa provar que vem de um usuário logado: o cliente envia o access token
// da sessão Supabase em `Authorization: Bearer <token>` (ver lib/api.ts).
export async function requireUser(req: Request) {
  const token = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ error: "Sessão inválida ou expirada" }, { status: 401 });
  }

  return null;
}
