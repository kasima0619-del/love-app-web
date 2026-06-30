import { promises as fs } from "fs";
import path from "path";
import { loveCoin as seedLoveCoin, coinTransactions as seedTransactions, type CoinTransaction } from "@/lib/mock-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "love-coin.json");

type LoveCoinState = {
  balance: number;
  monthlyEarned: number;
  rank: string;
  nextRank: string;
  nextRankTarget: number;
  transactions: CoinTransaction[];
  txCounter: number;
};

function initialData(): LoveCoinState {
  return {
    balance: seedLoveCoin.balance,
    monthlyEarned: seedLoveCoin.monthlyEarned,
    rank: seedLoveCoin.rank,
    nextRank: seedLoveCoin.nextRank,
    nextRankTarget: seedLoveCoin.nextRankTarget,
    transactions: seedTransactions,
    txCounter: seedTransactions.length,
  };
}

async function readData(): Promise<LoveCoinState> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as LoveCoinState;
  } catch {
    const data = initialData();
    await writeData(data);
    return data;
  }
}

async function writeData(data: LoveCoinState): Promise<void> {
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

export async function getLoveCoinData() {
  const data = await readData();
  return {
    balance: data.balance,
    monthlyEarned: data.monthlyEarned,
    rank: data.rank,
    nextRank: data.nextRank,
    nextRankTarget: data.nextRankTarget,
    transactions: data.transactions,
  };
}

export function grantCoins(amount: number, label: string) {
  return enqueue(async () => {
    const data = await readData();
    data.balance += amount;
    data.monthlyEarned += amount;
    data.txCounter += 1;
    const transaction: CoinTransaction = {
      id: `tx-${data.txCounter}`,
      type: "earn",
      label,
      amount,
      date: new Date().toISOString().slice(0, 10),
    };
    data.transactions = [transaction, ...data.transactions];
    await writeData(data);
    return { balance: data.balance, transaction };
  });
}

export function sendCoins(amount: number, counterpart: string, message?: string) {
  return enqueue(async () => {
    const data = await readData();
    if (amount <= 0 || amount > data.balance) {
      return { ok: false as const, balance: data.balance };
    }
    data.balance -= amount;
    data.txCounter += 1;
    const transaction: CoinTransaction = {
      id: `tx-${data.txCounter}`,
      type: "send",
      label: message ? `${counterpart}さんへ送金：${message}` : `${counterpart}さんへ送金`,
      amount,
      date: new Date().toISOString().slice(0, 10),
    };
    data.transactions = [transaction, ...data.transactions];
    await writeData(data);
    return { ok: true as const, balance: data.balance, transaction };
  });
}
