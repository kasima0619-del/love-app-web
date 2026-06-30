import { NextResponse } from "next/server";
import { getMatchingData } from "@/lib/server/matching-store";

export async function GET() {
  const data = await getMatchingData();
  return NextResponse.json(data);
}
