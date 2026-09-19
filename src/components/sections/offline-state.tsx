"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useT } from "@/lib/lang";

/* Браузер сам повідомляє про появу й зникнення мережі — слухаємо його
   замість того, щоб опитувати сервер щосекунди. Той самий підхід, що й у
   мови з темою (src/lib/lang.tsx): зовнішнє джерело правди + підписка. */
function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

const getSnapshot = () => navigator.onLine;

/* На сервері мережа є за визначенням: інакше цю сторінку не було б з чого
   віддати. Клієнт перемалює її одразу після гідратації, якщо це не так. */
const getServerSnapshot = () => true;

type Probe = "idle" | "checking" | "failed";

export default function OfflineState() {
  const t = useT();
  const router = useRouter();
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [probe, setProbe] = useState<Probe>("idle");

  /* navigator.onLine відповідає лише на питання «чи є мережевий інтерфейс»:
     Wi-Fi без інтернету він вважає зв'язком. Тому кнопка ще й справді стукає
     на сервер — найлегшим запитом, який у нас є. */
  const check = useCallback(async () => {
    setProbe("checking");
    try {
      await fetch(`/robots.txt?ping=${Date.now()}`, { method: "HEAD", cache: "no-store" });
      setProbe("idle");
    } catch {
      setProbe("failed");
    }
  }, []);

  /* Мережа повернулась сама — перевіряємо сервер без участі людини. */
  useEffect(() => {
    if (online) void check();
  }, [online, check]);

  const connected = online && probe !== "failed";
  const Icon = connected ? Wifi : WifiOff;

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex-1 w-full flex flex-col items-center justify-center bg-page px-5 py-20 md:py-28"
    >
      <div className="w-full max-w-[560px] flex flex-col items-center gap-8 text-center">
        <span
          aria-hidden
          className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-soft text-brand"
        >
          <Icon className="w-7 h-7" />
        </span>

        <div className="flex flex-col items-center gap-4" aria-live="polite">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">
            {connected ? t.offline.restoredLabel : t.offline.label}
          </p>
          <h1 className="font-semibold text-ink text-[32px] sm:text-[38px] leading-[1.15] tracking-[-1.08px]">
            {connected ? t.offline.restoredTitle : t.offline.title}
          </h1>
          <p className="text-[17px] text-ink-2 leading-[1.55]">
            {connected ? t.offline.restoredText : t.offline.text}
          </p>
          {probe === "failed" ? (
            <p className="text-[15px] text-ink-3 leading-[1.5]">{t.offline.failed}</p>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
          {connected ? (
            <button
              onClick={() => router.back()}
              className="btn-primary btn-brand group relative flex items-center justify-center h-12 w-full sm:w-auto px-9 rounded-full overflow-hidden"
            >
              <span className="relative text-white font-semibold text-base tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                {t.offline.back}
              </span>
            </button>
          ) : (
            <button
              onClick={check}
              disabled={probe === "checking"}
              className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 w-full sm:w-auto px-9 rounded-full overflow-hidden disabled:opacity-70"
            >
              {probe === "checking" ? (
                <LoaderCircle aria-hidden className="relative w-[17px] h-[17px] text-white animate-spin" />
              ) : (
                <RefreshCw aria-hidden className="relative w-[17px] h-[17px] text-white" />
              )}
              <span className="relative text-white font-semibold text-base tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                {probe === "checking" ? t.offline.checking : t.offline.retry}
              </span>
            </button>
          )}

          <Link
            href="/"
            className="btn-secondary relative flex items-center justify-center h-12 w-full sm:w-auto px-9 rounded-full overflow-hidden border border-hairline-strong"
          >
            <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
            <span className="relative text-ink-2 font-medium text-base tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
              {t.common.backHome}
            </span>
          </Link>
        </div>

        {/* Поки зв'язку немає, найкорисніше — не текст про нас, а чотири
            речі, які людина може перевірити на своєму боці. */}
        {connected ? null : (
          <div className="w-full flex flex-col items-start gap-3 rounded-2xl border border-hairline bg-surface px-6 py-5 text-left">
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">
              {t.offline.checklistTitle}
            </p>
            <ul className="flex flex-col gap-2">
              {t.offline.checklist.map((item) => (
                <li key={item} className="flex gap-2.5 text-[15px] text-ink-2 leading-[1.5]">
                  <span aria-hidden className="mt-[9px] w-1 h-1 shrink-0 rounded-full bg-ink-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
