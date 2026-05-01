import { NextResponse } from "next/server";
import { createChecklistFromTemplate, getStore } from "@/server/store";

export async function GET() {
  const { checklists } = getStore();
  return NextResponse.json({
    items: checklists.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      updatedAt: c.updatedAt,
    })),
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { title?: string; description?: string }
    | null;

  const title = body?.title?.trim() || "Novo Checklist (Modelo)";
  const description = body?.description?.trim();
  const checklist = createChecklistFromTemplate(title, description);
  return NextResponse.json({ checklist }, { status: 201 });
}

