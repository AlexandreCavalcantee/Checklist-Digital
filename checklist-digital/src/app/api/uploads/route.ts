import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createUpload, getStore } from "@/server/store";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

function toBase64(buf: ArrayBuffer) {
  return Buffer.from(buf).toString("base64");
}

export async function GET(req: Request) {
  const unauthorized = await requireUser(req);
  if (unauthorized) return unauthorized;

  const { uploads } = getStore();
  return NextResponse.json({
    items: uploads.map((u) => ({
      id: u.id,
      name: u.name,
      type: u.type,
      size: u.size,
      createdAt: u.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  const unauthorized = await requireUser(req);
  if (unauthorized) return unauthorized;

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Form inválido" }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Arquivo acima de 10MB" }, { status: 413 });
  }

  const data = await file.arrayBuffer();
  const upload = createUpload({
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    dataBase64: toBase64(data),
  });

  return NextResponse.json(
    {
      upload: {
        id: upload.id,
        name: upload.name,
        type: upload.type,
        size: upload.size,
        createdAt: upload.createdAt,
      },
    },
    { status: 201 }
  );
}
