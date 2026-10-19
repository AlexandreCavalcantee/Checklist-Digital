import { supabase } from "@/lib/supabase";

// fetch para as rotas internas (/api/*) enviando o token da sessão atual.
export async function apiFetch(input: string, init: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(init.headers);
  if (session) headers.set("Authorization", `Bearer ${session.access_token}`);

  return fetch(input, { ...init, headers });
}
