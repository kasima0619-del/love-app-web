import { NextResponse } from "next/server";
import { getPartnerData } from "@/lib/server/partner-store";

export async function GET() {
  const data = await getPartnerData();
  return NextResponse.json(data);
}
