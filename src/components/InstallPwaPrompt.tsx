"use client";

import { useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "love-pwa-install-dismissed";

type EnvSnapshot = { isIOS: boolean; isStandalone: boolean; dismissed: boolean };

const SERVER_ENV: EnvSnapshot = { isIOS: false, isStandalone: false, dismissed: false };
let cachedEnv: EnvSnapshot | null = null;

function getEnvSnapshot(): EnvSnapshot {
  if (!cachedEnv) {
    const nav = window.navigator as Navigator & { standalone?: boolean };
    cachedEnv = {
      isIOS: /iPad|iPhone|iPod/.test(nav.userAgent) && !("MSStream" in window),
      isStandalone: window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true,
      dismissed: window.localStorage.getItem(DISMISS_KEY) === "1",
    };
  }
  return cachedEnv;
}

function getServerEnvSnapshot(): EnvSnapshot {
  return SERVER_ENV;
}

function subscribeEnv() {
  return () => {};
}

let installPromptEvent: BeforeInstallPromptEvent | null = null;
const installPromptListeners = new Set<() => void>();

function subscribeInstallPrompt(callback: () => void) {
  function handleBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    installPromptEvent = event as BeforeInstallPromptEvent;
    installPromptListeners.forEach((listener) => listener());
  }

  function handleAppInstalled() {
    installPromptEvent = null;
    installPromptListeners.forEach((listener) => listener());
  }

  installPromptListeners.add(callback);
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  return () => {
    installPromptListeners.delete(callback);
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", handleAppInstalled);
  };
}

function getInstallPromptSnapshot(): BeforeInstallPromptEvent | null {
  return installPromptEvent;
}

function getServerInstallPromptSnapshot(): BeforeInstallPromptEvent | null {
  return null;
}

export default function InstallPwaPrompt() {
  const env = useSyncExternalStore(subscribeEnv, getEnvSnapshot, getServerEnvSnapshot);
  const installPrompt = useSyncExternalStore(
    subscribeInstallPrompt,
    getInstallPromptSnapshot,
    getServerInstallPromptSnapshot
  );
  const [dismissed, setDismissed] = useState(false);

  const visible = !env.isStandalone && !env.dismissed && !dismissed && (env.isIOS || installPrompt !== null);

  function dismiss() {
    setDismissed(true);
    window.localStorage.setItem(DISMISS_KEY, "1");
  }

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    dismiss();
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-36 sm:pb-4 lg:bottom-4 lg:left-4 lg:right-auto lg:px-0">
      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-love-navy to-love-pink-dark text-lg">
          💗
        </div>
        <div className="flex-1 text-xs leading-relaxed text-love-navy">
          {env.isIOS ? (
            <p>
              <span className="font-bold">ホーム画面に追加：</span>
              共有ボタン<span aria-hidden>⎋</span>から「ホーム画面に追加」を選択してください。
            </p>
          ) : (
            <p>
              <span className="font-bold">LOVEアプリ</span>をホーム画面に追加して、アプリのように使えます。
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {!env.isIOS && (
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-full bg-love-pink-dark px-3 py-1.5 text-xs font-bold text-white"
            >
              追加
            </button>
          )}
          <button type="button" onClick={dismiss} className="text-[11px] text-love-navy/40 underline">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
