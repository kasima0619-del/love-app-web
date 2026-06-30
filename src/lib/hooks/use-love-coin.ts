"use client";

import { useCallback, useEffect, useState } from "react";
import { loveCoin as initialLoveCoin } from "@/lib/mock-data";

export type LoveCoinData = {
  balance: number;
  monthlyEarned: number;
  rank: string;
  nextRank: string;
  nextRankTarget: number;
};

const LOVE_COIN_UPDATED_EVENT = "love-coin-updated";

export function notifyLoveCoinUpdated() {
  window.dispatchEvent(new Event(LOVE_COIN_UPDATED_EVENT));
}

export function useLoveCoin(): LoveCoinData {
  const [data, setData] = useState<LoveCoinData>(initialLoveCoin);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/love-coin");
      if (!res.ok) throw new Error("failed");
      const json = (await res.json()) as LoveCoinData;
      setData(json);
    } catch {
      // APIが利用できない場合はモックデータのまま表示する
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(LOVE_COIN_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(LOVE_COIN_UPDATED_EVENT, refresh);
  }, [refresh]);

  return data;
}
