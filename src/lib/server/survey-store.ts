import { promises as fs } from "fs";
import path from "path";
import {
  currentUser,
  surveys as seedSurveys,
  type SurveyItem,
  type SurveyType,
} from "@/lib/mock-data";
import { grantCoins } from "@/lib/server/love-coin-store";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "surveys.json");

type SurveyData = {
  surveys: SurveyItem[];
  idCounter: number;
};

function initialData(): SurveyData {
  return { surveys: seedSurveys, idCounter: seedSurveys.length };
}

async function readData(): Promise<SurveyData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as SurveyData;
  } catch {
    const data = initialData();
    await writeData(data);
    return data;
  }
}

async function writeData(data: SurveyData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// 同時書き込みによるファイル競合を避けるための簡易キュー
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task);
  queue = result.catch(() => undefined);
  return result;
}

export async function getSurveyData() {
  const data = await readData();
  return { surveys: data.surveys };
}

export function createSurvey(input: {
  type: SurveyType;
  title: string;
  description: string;
  category: string;
  communityName?: string;
  companyName?: string;
  reward: number;
  options: string[];
}) {
  return enqueue(async () => {
    const data = await readData();
    data.idCounter += 1;
    const id = `sv-${data.idCounter}`;
    const newSurvey: SurveyItem = {
      id,
      type: input.type,
      title: input.title,
      description: input.description,
      category: input.category,
      authorName: currentUser.name,
      communityName: input.communityName,
      companyName: input.companyName,
      status: "公開中",
      reward: input.reward,
      answeredOptionId: null,
      createdAt: new Date().toISOString().slice(0, 10),
      options: input.options.map((label, i) => ({ id: `${id}-o${i + 1}`, label, votes: 0 })),
    };
    data.surveys = [newSurvey, ...data.surveys];
    await writeData(data);
    return newSurvey;
  });
}

export function answerSurvey(surveyId: string, optionId: string) {
  return enqueue(async () => {
    const data = await readData();
    const survey = data.surveys.find((s) => s.id === surveyId);
    if (!survey) return { survey: null, rewarded: false } as const;
    if (survey.answeredOptionId) return { survey, rewarded: false } as const;
    if (!survey.options.some((o) => o.id === optionId)) return { survey, rewarded: false } as const;

    const updated: SurveyItem = {
      ...survey,
      answeredOptionId: optionId,
      options: survey.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)),
    };
    data.surveys = data.surveys.map((s) => (s.id === surveyId ? updated : s));
    await writeData(data);
    await grantCoins(survey.reward, `アンケート回答ボーナス：${survey.title}`);
    return { survey: updated, rewarded: true } as const;
  });
}
