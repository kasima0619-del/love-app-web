import { NextResponse } from "next/server";
import { getCommunityData } from "@/lib/server/community-store";

export async function GET() {
  const data = await getCommunityData();
  return NextResponse.json(data);
}
