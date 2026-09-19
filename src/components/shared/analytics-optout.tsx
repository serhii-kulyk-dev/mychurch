"use client";

import { OPTOUT_KEY, useFlag, writeFlag } from "@/lib/analytics/flag";
import { track } from "@/lib/analytics/client";
import { useLang } from "@/lib/lang";

/* Кнопка «не рахувати мене» на сторінці політики. Вибір живе в
   локальному сховищі браузера і нікуди не надсилається.        */

const COPY = {
  ua: {
    on: "Статистику вимкнено",
    off: "Статистика ввімкнена",
    turnOff: "Не рахувати мене",
    turnOn: "Рахувати знову",
    note: "Вибір зберігається у цьому браузері.",
  },
  en: {
    on: "Analytics is off",
    off: "Analytics is on",
    turnOff: "Do not count me",
    turnOn: "Count me again",
    note: "The choice is stored in this browser.",
  },
};

export default function AnalyticsOptOut() {
  const { lang } = useLang();
  const c = COPY[lang];
  const state = useFlag(OPTOUT_KEY);

  /* До першого рендера в браузері стан невідомий — тримаємо місце,
     але не показуємо напис, який може виявитись неправдою. */
  if (state === "unknown") return <div className="h-[46px]" aria-hidden />;

  const off = state === "on";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-hairline bg-surface-2 px-4 py-3">
      <span className="flex items-center gap-2 text-[15px] text-ink-2">
        <span className={`size-2 rounded-full ${off ? "bg-ink-3" : "bg-brand"}`} aria-hidden />
        {off ? c.on : c.off}
      </span>
      <button
        type="button"
        onClick={() => {
          /* Спершу записуємо сам факт вимкнення — і аж тоді вимикаємо. */
          if (!off) track("analytics_off");
          writeFlag(OPTOUT_KEY, !off);
        }}
        className="ml-auto rounded-full border border-hairline-strong px-4 py-1.5 text-[14px] font-medium text-ink transition-colors hover:bg-surface-3"
      >
        {off ? c.turnOn : c.turnOff}
      </button>
      <span className="w-full text-[13px] text-ink-3">{c.note}</span>
    </div>
  );
}
