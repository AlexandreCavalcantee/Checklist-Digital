import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { UserDepartment, UserRole } from "@/lib/types";

const roleValues: UserRole[] = [
  "auditor_junior",
  "auditor_pleno",
  "auditor_senior",
  "supervisor",
  "gerente",
];

const departmentValues: UserDepartment[] = [
  "financas",
  "operacoes",
  "qualidade",
  "rh",
  "ti",
  "outros",
];

function isRole(v: unknown): v is UserRole {
  return typeof v === "string" && (roleValues as string[]).includes(v);
}

function isDepartment(v: unknown): v is UserDepartment {
  return typeof v === "string" && (departmentValues as string[]).includes(v);
}

function isEmail(v: unknown) {
  if (typeof v !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("id", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data || []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    name: (p.full_name || p.name || p.username || "") as string,
    corporateEmail: (p.email as string | null) ?? "",
    role: (p.role as string | null) ?? "auditor_junior",
    department: (p.department as string | null) ?? "outros",
    isAdmin: (p.is_admin as boolean | null) ?? false,
    createdAt: (p.created_at as string | null) ?? new Date().toISOString(),
  }));

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; corporateEmail?: unknown; role?: unknown; department?: unknown; isAdmin?: unknown }
    | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const corporateEmail = typeof body?.corporateEmail === "string" ? body.corporateEmail.trim() : "";
  const isAdmin = typeof body?.isAdmin === "boolean" ? body.isAdmin : false;

  if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  if (!isEmail(corporateEmail)) return NextResponse.json({ error: "E-mail corporativo inválido" }, { status: 400 });
  if (!isRole(body?.role)) return NextResponse.json({ error: "Cargo/função inválido" }, { status: 400 });
  if (!isDepartment(body?.department)) return NextResponse.json({ error: "Setor/departamento inválido" }, { status: 400 });

  // Cria usuário no Supabase Auth para gerar um UUID válido referenciável por tarefas.responsavel_id
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: corporateEmail,
    password: Math.random().toString(36).slice(-10) + "A1!",
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  const userId = authData.user.id;

  // Insere ou atualiza na tabela profiles com os dados extras
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: userId, full_name: name });

  if (profileError) {
    console.error("[users POST] profile upsert error:", profileError);
    // não falha — o auth user já foi criado
  }

  const user = {
    id: userId,
    name,
    corporateEmail,
    role: body.role,
    department: body.department,
    isAdmin,
    createdAt: authData.user.created_at,
  };

  return NextResponse.json({ user }, { status: 201 });
}
