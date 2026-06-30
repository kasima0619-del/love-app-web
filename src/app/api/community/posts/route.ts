import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createCommunityPost } from "@/lib/server/community-store";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "community");
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  const form = await req.formData();

  const community = String(form.get("community") ?? "");
  const category = String(form.get("category") ?? "");
  const text = String(form.get("text") ?? "").trim();
  const image = form.get("image");

  if (!community || !category || !text) {
    return NextResponse.json({ error: "community, category, text は必須です" }, { status: 400 });
  }

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
    imagePath = `/uploads/community/${filename}`;
  }

  const post = await createCommunityPost({ community, category, text, image: imagePath });
  return NextResponse.json({ post }, { status: 201 });
}
