"use client";

import { useEffect, useRef, useState } from "react";
import { TgHeader, TgInline, TgInput, TgKeyboard, TgMessage } from "@/components/shared/tg-screen";
import type { TelegramCopy } from "@/content/telegram";
import { cn } from "@/lib/utils";

/* Телефон у герої /telegram — не картинка, а пристрій: корпус із кантом,
   бічними кнопками й живим екраном. Кнопки клавіатури справді
   натискаються — бот відповідає тими самими екранами, що описані в
   контенті (їх списано з бекенду бота). */

/* Розміри — з iPhone 16 Pro, переведені в частки ширини екрана:
     екран 402 × 874 pt (звідси aspect-[402/874]),
     рамка 2,25 мм ≈ 3,4 % ширини екрана (8 px кант + 2 px титанова грань),
     радіус екрана 55 pt ≈ 13,7 % ширини, корпусу — на товщину рамки більше,
     острівець 125 × 36,7 pt, за 11 pt від краю (екран рендеримо 332 px —
       тоді 14,5 px тексту всередині = ті самі 17 pt, що в iOS),
     бічні кнопки: дія, гучність (зліва) і живлення (справа) — на своїх
     відсотках висоти корпусу, тому лишаються на місці за будь-якої ширини. */

/** Корпус iPhone: титанова грань, бічні кнопки, острівець, статусбар і смужка Home. */
export function TgDevice({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full flex justify-center", className)}>
      <div className="tg-device relative w-full max-w-[352px] rounded-[51px] p-[2px]">
        {/* Бічні кнопки: дія і гучність зліва, живлення справа. */}
        <span aria-hidden className="tg-key tg-key-left top-[17%] h-[4.3%]" />
        <span aria-hidden className="tg-key tg-key-left top-[23.7%] h-[7.7%]" />
        <span aria-hidden className="tg-key tg-key-left top-[34.1%] h-[7.7%]" />
        <span aria-hidden className="tg-key tg-key-right top-[27.4%] h-[12.7%]" />

        <div className="tg-bezel rounded-[49px] p-[8px]">
          <div className="relative rounded-[41px] overflow-hidden bg-surface aspect-[402/874] flex flex-col">
            {/* Статусбар: час зліва, зв'язок і батарея справа — як в iOS. */}
            <div className="relative shrink-0 flex items-center justify-between h-[44px] px-6 pt-1 bg-surface">
              <span className="text-[12.5px] font-semibold text-ink leading-none tabular-nums">9:41</span>
              <span className="flex items-center gap-1.5 text-ink">
                <StatusIcons />
              </span>
            </div>
            {/* Острівець камери. */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-[10px] left-1/2 -translate-x-1/2 w-[103px] h-[30px] rounded-full bg-[#05080d] flex items-center justify-end pr-3"
            >
              <span className="w-[9px] h-[9px] rounded-full bg-[#10161f] ring-1 ring-white/10" />
            </div>
            {children}
            {/* Смужка Home — iOS малює її поверх усього. */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[116px] h-[4px] rounded-full bg-ink/25"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusIcons() {
  return (
    <>
      <svg viewBox="0 0 18 12" className="w-[16px] h-[11px]" aria-hidden fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg viewBox="0 0 16 12" className="w-[15px] h-[11px]" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M1 4.2a10 10 0 0 1 14 0" />
        <path d="M3.6 7a6.4 6.4 0 0 1 8.8 0" />
        <path d="M6.3 9.7a2.6 2.6 0 0 1 3.4 0" />
      </svg>
      <svg viewBox="0 0 26 12" className="w-[22px] h-[10px]" aria-hidden>
        <rect x="0.6" y="0.6" width="21" height="10.8" rx="3.2" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
        <rect x="2.2" y="2.2" width="17.8" height="7.6" rx="2" fill="currentColor" />
        <path d="M23.4 4.2v3.6a2 2 0 0 0 0-3.6z" fill="currentColor" fillOpacity="0.5" />
      </svg>
    </>
  );
}

type Entry =
  | { k: "me"; id: number; text: string }
  | { k: "typing"; id: number }
  | { k: "bot"; id: number; lines: { s?: "b" | "d"; t: string }[]; buttons?: { t: string; primary?: boolean; tone?: "green" | "red" }[][] };

/** Час у бульбашці: 9:41 і далі по хвилині на повідомлення. */
function clock(step: number) {
  const m = 9 * 60 + 41 + step;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Живий екран бота: клавіатура працює, відповідь приходить з паузою на «друкує». */
export default function TgPhone({ phone }: { phone: TelegramCopy["hero"]["phone"] }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const chat = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const el = chat.current;
    if (!el || entries.length === 0) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [entries]);

  const tap = (label: string) => {
    if (busy) return;
    const screen = phone.screens.find((s) => s.id === label);
    if (!screen) return;
    const id = Date.now();
    setBusy(true);
    setActive(label);
    setEntries((e) => [...e, { k: "me", id, text: label }]);
    timers.current.push(
      window.setTimeout(() => setEntries((e) => [...e, { k: "typing", id: id + 1 }]), 240),
      window.setTimeout(() => {
        setEntries((e) => [
          ...e.filter((x) => x.k !== "typing"),
          { k: "bot", id: id + 2, lines: screen.lines, buttons: screen.buttons },
        ]);
        setBusy(false);
      }, 1100)
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setEntries([]);
    setActive(null);
    setBusy(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <TgDevice>
        <TgHeader
          title={phone.bot}
          sub={busy ? phone.typing : phone.status}
          onBack={entries.length ? reset : undefined}
          backLabel={phone.back}
        />
        <div
          ref={chat}
          aria-live="polite"
          className="tg-wallpaper tg-chat flex-1 min-h-0 px-4 py-4 overflow-y-auto flex flex-col"
        >
          <div className="mt-auto flex flex-col gap-2.5">
            <TgMessage lines={phone.greeting} className="bubble-in" time={clock(0)} />
            {entries.map((e, i) =>
              e.k === "me" ? (
                <span
                  key={e.id}
                  className="tg-bubble-out bubble-in self-end max-w-[86%] rounded-[14px] rounded-br-[4px] px-3.5 py-2 flex items-end gap-2"
                >
                  <span className="text-[14.5px] leading-[1.35] text-ink">{e.text}</span>
                  <span className="text-[11px] text-ink-3 leading-none tabular-nums shrink-0 pb-0.5">{clock(i + 1)}</span>
                </span>
              ) : e.k === "typing" ? (
                <span key={e.id} className="tg-bubble bubble-in self-start rounded-[14px] rounded-bl-[4px] px-3.5 py-3 flex items-center gap-1.5">
                  <i className="tg-dot" />
                  <i className="tg-dot" />
                  <i className="tg-dot" />
                  <span className="sr-only">{phone.typing}</span>
                </span>
              ) : (
                <TgMessage key={e.id} lines={e.lines} className="bubble-in" time={clock(i + 1)}>
                  {e.buttons && <TgInline rows={e.buttons} className="pt-1.5" dense />}
                </TgMessage>
              )
            )}
          </div>
        </div>
        <TgInput placeholder="…" />
        <TgKeyboard rows={phone.keyboard} className="shrink-0 pb-[18px]" onTap={tap} active={active} disabled={busy} />
      </TgDevice>
      <p className="max-w-[340px] text-center text-[13px] text-ink-3 leading-[1.45]">
        {entries.length ? phone.hint : phone.tapHint}
      </p>
    </div>
  );
}
