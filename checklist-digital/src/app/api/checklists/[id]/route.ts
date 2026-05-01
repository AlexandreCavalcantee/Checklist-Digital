import { NextResponse } from "next/server";
import { getChecklistById } from "@/server/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const checklist = getChecklistById(id);
  if (!checklist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ checklist });
}

