"use client";

// AIルーターデモ（Phase5）でねねが登録した予定をブラウザに保存し、
// スケジュール画面にも反映させるための簡易共有ストア。

import type { CalendarEvent } from "@/lib/mock-data";

const STORAGE_KEY = "love-demo-schedule-events";

let cached: CalendarEvent[] | null = null;
let idCounter = 0;
const listeners = new Set<() => void>();

function readFromStorage(): CalendarEvent[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CalendarEvent[]) : [];
  } catch {
    return [];
  }
}

export function getDemoScheduleEvents(): CalendarEvent[] {
  if (!cached) cached = readFromStorage();
  return cached;
}

export function getServerDemoScheduleEvents(): CalendarEvent[] {
  return [];
}

export function subscribeDemoScheduleEvents(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function addDemoScheduleEvent(event: Omit<CalendarEvent, "id">): CalendarEvent {
  const list = getDemoScheduleEvents();
  idCounter += 1;
  const created: CalendarEvent = { ...event, id: `demo-ev-${Date.now()}-${idCounter}` };
  cached = [...list, created];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  listeners.forEach((listener) => listener());
  return created;
}
