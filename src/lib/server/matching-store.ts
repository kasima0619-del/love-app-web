import { promises as fs } from "fs";
import path from "path";
import { matchProfiles } from "@/lib/mock-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "matching.json");

type MatchingData = {
  likedIds: string[];
};

function initialData(): MatchingData {
  return { likedIds: ["mp-9"] };
}

async function readData(): Promise<MatchingData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as MatchingData;
  } catch {
    const data = initialData();
    await writeData(data);
    return data;
  }
}

async function writeData(data: MatchingData): Promise<void> {
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

export async function getMatchingData() {
  const data = await readData();
  return { profiles: matchProfiles, likedIds: data.likedIds };
}

export function toggleLike(profileId: string) {
  return enqueue(async () => {
    const data = await readData();
    const profile = matchProfiles.find((p) => p.id === profileId);
    if (!profile) return { likedIds: data.likedIds, matched: false, found: false } as const;

    const alreadyLiked = data.likedIds.includes(profileId);
    data.likedIds = alreadyLiked
      ? data.likedIds.filter((id) => id !== profileId)
      : [...data.likedIds, profileId];
    await writeData(data);

    const matched = !alreadyLiked && profile.likesYou;
    return { likedIds: data.likedIds, matched, found: true } as const;
  });
}
