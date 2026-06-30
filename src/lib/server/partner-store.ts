import { promises as fs } from "fs";
import path from "path";
import { partners, type PartnerUsageLog } from "@/lib/mock-data";
import { grantCoins } from "@/lib/server/love-coin-store";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "partners.json");

type PartnerData = {
  favoriteIds: string[];
  usageLog: PartnerUsageLog[];
  logCounter: number;
};

function initialData(): PartnerData {
  return {
    favoriteIds: ["pt-1", "pt-3"],
    usageLog: [{ id: "ul-1", partnerId: "pt-2", partnerName: "LOVEトラベル株式会社", reward: 100, date: "2026-06-10" }],
    logCounter: 1,
  };
}

async function readData(): Promise<PartnerData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as PartnerData;
  } catch {
    const data = initialData();
    await writeData(data);
    return data;
  }
}

async function writeData(data: PartnerData): Promise<void> {
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

export async function getPartnerData() {
  const data = await readData();
  return { partners, favoriteIds: data.favoriteIds, usageLog: data.usageLog };
}

export function toggleFavorite(partnerId: string) {
  return enqueue(async () => {
    const data = await readData();
    if (!partners.some((p) => p.id === partnerId)) {
      return { favoriteIds: data.favoriteIds, found: false } as const;
    }
    data.favoriteIds = data.favoriteIds.includes(partnerId)
      ? data.favoriteIds.filter((id) => id !== partnerId)
      : [...data.favoriteIds, partnerId];
    await writeData(data);
    return { favoriteIds: data.favoriteIds, found: true } as const;
  });
}

export function recordUsage(partnerId: string) {
  return enqueue(async () => {
    const data = await readData();
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner || partner.status !== "提携中") {
      return { usageLog: data.usageLog, reward: 0, found: false } as const;
    }

    const reward = partner.cashbackRate * 10;
    data.logCounter += 1;
    const entry: PartnerUsageLog = {
      id: `ul-${data.logCounter}`,
      partnerId: partner.id,
      partnerName: partner.name,
      reward,
      date: new Date().toISOString().slice(0, 10),
    };
    data.usageLog = [entry, ...data.usageLog];
    await writeData(data);
    await grantCoins(reward, `${partner.name}のご利用`);
    return { usageLog: data.usageLog, reward, found: true } as const;
  });
}
