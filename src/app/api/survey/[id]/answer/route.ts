import { NextRequest, NextResponse } from "next/server";
import { answerSurvey } from "@/lib/server/survey-store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { optionId } = (await req.json().catch(() => ({}))) as { optionId?: string };

  if (!optionId) {
    return NextResponse.json({ error: "optionId は必須です" }, { status: 400 });
  }

  const { survey, rewarded } = await answerSurvey(id, optionId);
  if (!survey) {
    return NextResponse.json({ error: "survey not found" }, { status: 404 });
  }
  if (!rewarded) {
    return NextResponse.json({ error: "already answered" }, { status: 409 });
  }

  return NextResponse.json({ survey, reward: survey.reward });
}
