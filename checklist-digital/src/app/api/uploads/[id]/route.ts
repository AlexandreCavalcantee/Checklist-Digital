import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getUploadById } from "@/server/store";

function fromBase64(b64: string) {
  return Buffer.from(b64, "base64");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireUser(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const upload = getUploadById(id);
  if (!upload) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = fromBase64(upload.dataBase64);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": upload.type,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(upload.name)}"`,
      "Content-Length": String(upload.size),
      "Cache-Control": "no-store",
    },
  });
}
