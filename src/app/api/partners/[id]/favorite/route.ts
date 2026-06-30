import { NextRequest, NextResponse } from "next/server";
import { toggleFavorite } from "@/lib/server/partner-store";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { favoriteIds, found } = await toggleFavorite(id);

  if (!found) {
    return NextResponse.json({ error: "partner not found" }, { status: 404 });
  }

  return NextResponse.json({ favoriteIds });
}
