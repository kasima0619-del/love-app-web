import { NextRequest, NextResponse } from "next/server";
import { createSurvey, getSurveyData } from "@/lib/server/survey-store";
import { surveyCategories, type SurveyType } from "@/lib/mock-data";

const SURVEY_TYPES: SurveyType[] = ["personal", "community", "corporate"];

export async function GET() {
  const data = await getSurveyData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    type?: SurveyType;
    title?: string;
    description?: string;
    category?: string;
    communityName?: string;
    companyName?: string;
    reward?: number;
    options?: string[];
  };

  const title = body.title?.trim();
  const description = body.description?.trim() ?? "";
  const category = body.category && surveyCategories.includes(body.category) ? body.category : surveyCategories[0];
  const type = body.type && SURVEY_TYPES.includes(body.type) ? body.type : "personal";
  const options = (body.options ?? []).map((o) => o.trim()).filter((o) => o.length > 0);
  const reward = Number.isFinite(body.reward) && (body.reward as number) >= 0 ? Math.round(body.reward as number) : 10;

  if (!title) {
    return NextResponse.json({ error: "title は必須です" }, { status: 400 });
  }
  if (options.length < 2 || options.length > 5) {
    return NextResponse.json({ error: "選択肢は2〜5個で指定してください" }, { status: 400 });
  }

  const survey = await createSurvey({
    type,
    title,
    description,
    category,
    communityName: type === "community" ? body.communityName?.trim() || undefined : undefined,
    companyName: type === "corporate" ? body.companyName?.trim() || undefined : undefined,
    reward,
    options,
  });

  return NextResponse.json({ survey }, { status: 201 });
}
