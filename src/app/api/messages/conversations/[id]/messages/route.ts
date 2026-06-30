import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/server/messages-store";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "messages");
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await req.formData();

  const text = String(form.get("text") ?? "").trim();
  const image = form.get("image");

  let imagePath: string | undefined;

  if (image instanceof File && image.size > 0) {
    const ext = ALLOWED_TYPES[image.type];
    if (!ext) {
      return NextResponse.json({ error: "対応していない画像形式です" }, { status: 400 });
    }
    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "画像サイズは5MB以下にしてください" }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await image.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    imagePath = `/uploads/messages/${filename}`;
  }

  if (!text && !imagePath) {
    return NextResponse.json({ error: "text または image が必要です" }, { status: 400 });
  }

  const result = await sendMessage(id, { text, image: imagePath });
  if (!result) {
    return NextResponse.json({ error: "会話が見つかりません" }, { status: 404 });
  }
  return NextResponse.json(result, { status: 201 });
}
