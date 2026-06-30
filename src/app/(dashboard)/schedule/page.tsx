"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import {
  scheduleWeekDays,
  calendarEvents,
  scheduleCalendarHours,
  juneCalendarWeeks,
  juneToday,
  juneEventDates,
  type CalendarEvent,
} from "@/lib/mock-data";
import {
  getDemoScheduleEvents,
  getServerDemoScheduleEvents,
  subscribeDemoScheduleEvents,
} from "@/lib/demo-schedule-store";

const eventStyles: Record<CalendarEvent["color"], string> = {
  pink: "bg-love-pink text-white",
  navy: "bg-love-navy text-white",
  gold: "bg-love-gold text-love-navy",
};

const colorOptions: { id: CalendarEvent["color"]; label: string }[] = [
  { id: "pink", label: "ピンク" },
  { id: "navy", label: "ネイビー" },
  { id: "gold", label: "ゴールド" },
];

let eventIdCounter = calendarEvents.length;
function nextEventId() {
  eventIdCounter += 1;
  return `ev-${eventIdCounter}`;
}

export default function SchedulePage() {
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const demoEvents = useSyncExternalStore(
    subscribeDemoScheduleEvents,
    getDemoScheduleEvents,
    getServerDemoScheduleEvents
  );
  const [newDay, setNewDay] = useState(0);
  const [newStart, setNewStart] = useState(10);
  const [newEnd, setNewEnd] = useState(11);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState<CalendarEvent["color"]>("pink");
  const [newReminder, setNewReminder] = useState(true);
  const [error, setError] = useState("");

  const allEvents = [...events, ...demoEvents];
  const todayEvents = allEvents.filter((e) => e.day === 0);

  function addEvent() {
    if (!newTitle.trim()) {
      setError("予定のタイトルを入力してください");
      return;
    }
    if (newEnd <= newStart) {
      setError("終了時刻は開始時刻より後にしてください");
      return;
    }
    setError("");
    setEvents((prev) => [
      ...prev,
      {
        id: nextEventId(),
        day: newDay,
        startHour: newStart,
        endHour: newEnd,
        title: newTitle,
        color: newColor,
        reminder: newReminder,
      },
    ]);
    setNewTitle("");
  }

  function toggleReminder(id: string) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, reminder: !e.reminder } : e)));
  }

  const reminderEvents = allEvents.filter((e) => e.reminder);

  return (
    <div className="flex flex-col">
      <TopBar title="スケジュール" subtitle="今週の予定をカレンダーでまとめて確認できます" category="friend" />

      <div className="space-y-6 p-4 sm:p-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-love-navy to-love-pink-dark p-6 text-white sm:p-8">
          <p className="text-xs uppercase tracking-widest text-love-gold">今週の予定</p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">2026年6月（今週）</h2>
          <p className="mt-2 text-sm text-white/70">
            本日は {todayEvents.length} 件の予定があります。AI秘書ねねが移動時間も考慮してサポートします。
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* 週間カレンダー */}
          <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white p-4 shadow-sm lg:col-span-2 sm:p-6">
            <p className="mb-3 text-xs font-medium text-love-navy/50">週間カレンダー</p>
            <div
              className="grid min-w-[640px]"
              style={{
                gridTemplateColumns: "56px repeat(7, minmax(80px, 1fr))",
                gridTemplateRows: `auto repeat(${scheduleCalendarHours.length}, 44px)`,
              }}
            >
              <div className="border-b border-black/5" />
              {scheduleWeekDays.map((d, i) => (
                <div
                  key={d.label}
                  className={`border-b border-l border-black/5 px-1 py-2 text-center text-xs font-semibold ${
                    i === 0 ? "text-love-pink-dark" : "text-love-navy"
                  }`}
                >
                  {d.label}
                  <br />
                  <span className="text-[10px] font-normal text-love-navy/40">{d.date}</span>
                </div>
              ))}

              {scheduleCalendarHours.map((h, rowIdx) => (
                <div
                  key={`time-${h}`}
                  className="border-b border-black/5 px-2 py-1 text-right text-[11px] text-love-navy/40"
                  style={{ gridColumn: 1, gridRow: rowIdx + 2 }}
                >
                  {h}:00
                </div>
              ))}
              {scheduleCalendarHours.map((h, rowIdx) =>
                scheduleWeekDays.map((_, colIdx) => (
                  <div
                    key={`cell-${h}-${colIdx}`}
                    className="border-b border-l border-black/5"
                    style={{ gridColumn: colIdx + 2, gridRow: rowIdx + 2 }}
                  />
                ))
              )}

              {allEvents.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    gridColumn: ev.day + 2,
                    gridRow: `${ev.startHour - scheduleCalendarHours[0] + 2} / ${ev.endHour - scheduleCalendarHours[0] + 2}`,
                  }}
                  className={`m-0.5 overflow-hidden rounded-lg px-2 py-1 text-[11px] font-semibold leading-tight ${eventStyles[ev.color]}`}
                >
                  {ev.reminder && "🔔 "}
                  {ev.title}
                </div>
              ))}
            </div>
          </div>

          {/* ミニカレンダー + AI秘書ねね */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-love-navy">2026年6月</p>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px]">
                {["月", "火", "水", "木", "金", "土", "日"].map((d) => (
                  <div key={d} className="font-semibold text-love-navy/40">
                    {d}
                  </div>
                ))}
                {juneCalendarWeeks.flat().map((day, i) => (
                  <div
                    key={i}
                    className={`flex h-7 items-center justify-center rounded-full ${
                      day === null
                        ? ""
                        : day === juneToday
                        ? "bg-love-pink font-bold text-white"
                        : juneEventDates.includes(day)
                        ? "bg-love-pink-soft font-semibold text-love-pink-dark"
                        : "text-love-navy/70"
                    }`}
                  >
                    {day ?? ""}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-love-navy/30">● 予定のある日 ／ ● 今日</p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-love-pink-soft text-xl">
                  🦉
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-love-navy">AI秘書「ねね」からの提案</p>
                  <p className="mt-1 text-sm text-love-navy/70">
                    本日は{todayEvents.length}件の予定があります。移動時間も考えてリマインドしますね。予定の調整はチャットからご相談ください。
                  </p>
                  <Link
                    href="/ai-partner"
                    className="mt-3 inline-block rounded-full bg-love-pink px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-love-pink-dark"
                  >
                    ねねに相談する →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 予定追加 */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-love-navy/50">予定を追加</p>
            <div className="mt-3 space-y-3">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="予定のタイトル"
                className="w-full rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
              />
              <div className="grid grid-cols-3 gap-2">
                <label className="text-xs text-love-navy/50">
                  曜日
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-love-bg px-2 py-2 text-sm text-love-navy outline-none focus:border-love-pink"
                  >
                    {scheduleWeekDays.map((d, i) => (
                      <option key={d.label} value={i}>
                        {d.label}（{d.date}）
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-love-navy/50">
                  開始
                  <select
                    value={newStart}
                    onChange={(e) => setNewStart(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-love-bg px-2 py-2 text-sm text-love-navy outline-none focus:border-love-pink"
                  >
                    {scheduleCalendarHours.map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-love-navy/50">
                  終了
                  <select
                    value={newEnd}
                    onChange={(e) => setNewEnd(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-love-bg px-2 py-2 text-sm text-love-navy outline-none focus:border-love-pink"
                  >
                    {scheduleCalendarHours.map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewColor(c.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        newColor === c.id
                          ? "bg-love-bg ring-2 ring-love-pink"
                          : "bg-love-bg text-love-navy/50 hover:text-love-navy"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${eventStyles[c.id].split(" ")[0]}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs font-medium text-love-navy/60">
                  <input
                    type="checkbox"
                    checked={newReminder}
                    onChange={(e) => setNewReminder(e.target.checked)}
                    className="h-4 w-4 rounded border-black/20 accent-love-pink"
                  />
                  🔔 リマインダーを設定
                </label>
              </div>
              {error && <p className="text-xs font-semibold text-love-pink-dark">{error}</p>}
              <button
                type="button"
                onClick={addEvent}
                className="w-full rounded-full bg-love-pink px-5 py-3 text-sm font-bold text-white shadow-md shadow-love-pink/30 transition-colors hover:bg-love-pink-dark"
              >
                予定を追加する
              </button>
            </div>
          </div>

          {/* リマインダー一覧 */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-love-navy/50">リマインダー一覧</p>
            {reminderEvents.length === 0 ? (
              <p className="mt-3 text-sm text-love-navy/40">設定されているリマインダーはありません</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {reminderEvents.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-love-bg px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-love-navy">{ev.title}</p>
                      <p className="text-[11px] text-love-navy/40">
                        {scheduleWeekDays[ev.day].label}曜日（{scheduleWeekDays[ev.day].date}） {ev.startHour}:00-{ev.endHour}:00
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleReminder(ev.id)}
                      className="flex-none rounded-full bg-white px-3 py-1.5 text-xs font-bold text-love-pink-dark shadow-sm hover:bg-love-pink-soft"
                    >
                      🔔 解除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <p className="text-[11px] text-love-navy/30">
          ※ 表示は体験版です（ページ再読み込みでリセットされます）。実際のカレンダー連携・GPSに基づく予定提案・Push通知はPhase2で本実装予定です。
        </p>
      </div>
    </div>
  );
}
