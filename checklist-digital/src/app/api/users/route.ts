import { NextResponse } from "next/server";
import { createUser, getStore } from "@/server/store";
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
  const { users } = getStore();
  return NextResponse.json({ items: users });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        name?: unknown;
        corporateEmail?: unknown;
        role?: unknown;
        department?: unknown;
        isAdmin?: unknown;
      }
    | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const corporateEmail =
    typeof body?.corporateEmail === "string" ? body.corporateEmail.trim() : "";
  const isAdmin = typeof body?.isAdmin === "boolean" ? body.isAdmin : false;

  if (!name) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }
  if (!isEmail(corporateEmail)) {
    return NextResponse.json({ error: "E-mail corporativo inválido" }, { status: 400 });
  }
  if (!isRole(body?.role)) {
    return NextResponse.json({ error: "Cargo/função inválido" }, { status: 400 });
  }
  if (!isDepartment(body?.department)) {
    return NextResponse.json({ error: "Setor/departamento inválido" }, { status: 400 });
  }

  const user = createUser({
    name,
    corporateEmail,
    role: body.role,
    department: body.department,
    isAdmin,
  });

  return NextResponse.json({ user }, { status: 201 });
}
