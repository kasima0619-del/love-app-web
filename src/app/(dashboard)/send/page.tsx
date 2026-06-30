"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import { sendableContacts, sendHistory as initialSendHistory, type SendHistoryItem } from "@/lib/mock-data";
import { useLoveCoin, notifyLoveCoinUpdated } from "@/lib/hooks/use-love-coin";

export default function SendPage() {
  const loveCoin = useLoveCoin();
  const [history, setHistory] = useState<SendHistoryItem[]>(initialSendHistory);
  const [selectedId, setSelectedId] = useState(sendableContacts[0]?.id ?? "");
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const selectedContact = sendableContacts.find((c) => c.id === selectedId);

  async function handleSend() {
    if (!selectedContact || amount <= 0 || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/love-coin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount, counterpart: selectedContact.name, message }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "送金に失敗しました");
      }
      setHistory((prev) => [
        {
          id: `sh-${Date.now()}`,
          type: "send",
          counterpart: selectedContact.name,
          avatarInitial: selectedContact.avatarInitial,
          amount,
          message: message.trim() || undefined,
          date: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      notifyLoveCoinUpdated();
      setToast(`💗 ${selectedContact.name}さんに${amount.toLocaleString()} LOVEを送りました！`);
      setMessage("");
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "送金に失敗しました");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col">
      <TopBar title="送金" subtitle="友達にLOVE COINを送れます" category="coin" />

      <div className="space-y-6 p-4 sm:p-8">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs text-love-navy/50">現在のLOVE COIN残高</p>
          <p className="mt-1 text-2xl font-bold text-love-navy">{loveCoin.balance.toLocaleString()} 💗</p>
        </section>

        {error && (
          <div className="rounded-2xl border border-love-pink/30 bg-love-pink-soft px-4 py-3 text-sm text-love-pink-dark">
            {error}
          </div>
        )}
        {toast && (
          <div className="rounded-2xl border border-love-gold/40 bg-love-gold-soft px-4 py-3 text-sm font-semibold text-love-navy">
            {toast}
          </div>
        )}

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-love-navy/50">送り先を選ぶ</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sendableContacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => setSelectedId(contact.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedId === contact.id
                    ? "bg-love-pink text-white"
                    : "bg-love-bg text-love-navy/60 hover:bg-love-pink-soft hover:text-love-pink-dark"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
                  {contact.avatarInitial}
                </span>
                {contact.name}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm font-medium text-love-navy/50">金額</p>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 w-full rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
          />

          <p className="mt-4 text-sm font-medium text-love-navy/50">メッセージ（任意）</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="ありがとう！また一緒に行きましょう"
            className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-love-bg px-4 py-2.5 text-sm text-love-navy outline-none focus:border-love-pink focus:ring-2 focus:ring-love-pink/30"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!selectedContact || amount <= 0 || sending}
            className="mt-4 rounded-full bg-love-pink px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-love-pink-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? "送金中..." : "送金する"}
          </button>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium text-love-navy/50">送受金履歴</p>
          <ul className="mt-3 divide-y divide-black/5">
            {history.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-love-pink-soft text-sm font-bold text-love-pink-dark">
                    {item.avatarInitial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-love-navy">
                      {item.type === "send" ? `${item.counterpart}さんへ` : `${item.counterpart}さんから`}
                    </p>
                    {item.message && <p className="truncate text-xs text-love-navy/40">{item.message}</p>}
                    <p className="text-[11px] text-love-navy/30">{item.date}</p>
                  </div>
                </div>
                <p className={`flex-none font-bold ${item.type === "send" ? "text-love-navy" : "text-love-pink-dark"}`}>
                  {item.type === "send" ? "-" : "+"}
                  {item.amount.toLocaleString()} LOVE
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
