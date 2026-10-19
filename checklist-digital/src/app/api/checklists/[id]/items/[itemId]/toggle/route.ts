import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { toggleChecklistItem } from "@/server/store";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const unauthorized = await requireUser(req);
  if (unauthorized) return unauthorized;

  const { id, itemId } = await params;
  const result = toggleChecklistItem(id, itemId);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    item: result.item,
    updatedAt: result.checklist.updatedAt,
  });
}
