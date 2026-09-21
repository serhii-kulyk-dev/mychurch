"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Clock, MousePointer2 } from "lucide-react";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Планування служіння в блоці огляду — сам план, і нічого більше:
   таймінг, хто веде блок і як він заповнюється на очах. Велике демо
   з пісенником і диктуванням лишилось на /modules/service-planning;
   тут беруться ті самі рядки плану, що й там.
   ──────────────────────────────────────────────────────────────── */

const ACCENT = "#ea580c";
/* Крок між підтвердженнями і пауза перед наступним колом. */
const ROW_MS = 900;
const REPLAY_MS = 2600;
/* Скільки рядків плану влазить у картку огляду. */
const ROWS = 4;
/* Курсори не на кожному рядку: два — це вже «складають кілька людей»,
   чотири перетворювали план на ярмарок. Підпис — роль, а не ім'я. */
const CURSOR_ROWS: Record<number, string> = { 1: "#2563eb", 3: "#0d9488" };

const tint = (pct: number) => `color-mix(in oklab, ${ACCENT} ${pct}%, var(--surface))`;

export default function PlanningMini() {
  const t = useT().servicePlanning.plan;
  const rows = t.items.slice(0, ROWS);
  const hostRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(0);

  /* Графік закривають кілька людей: до кожного рядка підлітає свій
     курсор, ставить підтвердження — і все повторюється з початку. */
  const [run, setRun] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    if (prefersReducedMotion()) {
      const still = window.setTimeout(() => setDone(rows.length), 0);
      return () => clearTimeout(still);
    }
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setDone(0), 0));
    for (let i = 1; i <= rows.length; i++) {
      timers.push(window.setTimeout(() => setDone(i), ROW_MS * i));
    }
    timers.push(
      window.setTimeout(() => setRun((n) => n + 1), ROW_MS * rows.length + REPLAY_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [live, run, rows.length]);

  return (
    <div
      ref={hostRef}
      className="w-full max-w-[460px] mx-auto rounded-[18px] border border-hairline bg-surface overflow-hidden shadow-[0_26px_54px_-36px_rgba(0,40,100,0.5)]"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-2">
        <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
        <span className="text-[12.5px] font-semibold text-ink-2 leading-none truncate">{t.title}</span>
        <span className="ml-auto shrink-0 flex items-center gap-1 text-[11.5px] text-ink-3 leading-none tabular-nums">
          <Clock className="w-3 h-3" strokeWidth={2.2} />
          {t.duration}
        </span>
      </div>

      <ol className="flex flex-col px-3 py-3">
        {rows.map((item, i) => {
          const filled = i < done;
          return (
            <li
              key={item.time}
              className={cn(
                "relative mock-row flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-300",
                filled && "bg-surface-2"
              )}
              style={{ animationDelay: `${80 + i * 70}ms` }}
            >
              {/* Курсор того, хто саме підтверджує цей блок. */}
              {CURSOR_ROWS[i] && (
                <span
                  key={`${run}-${item.time}`}
                  aria-hidden
                  className="plan-cursor absolute right-1 -top-1 z-10 flex items-center gap-1.5 pointer-events-none"
                  style={{ color: CURSOR_ROWS[i], animationDelay: `${i * ROW_MS}ms` }}
                >
                  <MousePointer2 className="w-[18px] h-[18px] fill-current drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" strokeWidth={1.5} />
                  <span
                    className="rounded-full px-2 py-[3px] text-[10.5px] font-semibold text-white leading-none whitespace-nowrap shadow-[0_6px_14px_-8px_rgba(0,0,0,0.6)]"
                    style={{ background: CURSOR_ROWS[i] }}
                  >
                    {item.role}
                  </span>
                </span>
              )}
              <span className="w-[42px] shrink-0 text-[12px] text-ink-3 leading-none tabular-nums">{item.time}</span>
              <span className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-[13.5px] font-semibold text-ink leading-none truncate">{item.name}</span>
                <span className="text-[11.5px] text-ink-3 leading-none truncate">{item.role}</span>
              </span>
              {filled ? (
                <span className="mock-pop flex items-center gap-1.5 shrink-0">
                  <PersonAvatar look={lookFor(item.who)} size={24} className="w-6 h-6" />
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-white"
                    style={{ background: ACCENT }}
                  >
                    <Check className="w-2.5 h-2.5" strokeWidth={3.4} />
                  </span>
                </span>
              ) : (
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none"
                  style={{ background: tint(10), color: ACCENT }}
                >
                  {t.empty}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="px-4 pb-3.5 pt-0.5">
        <span className="text-[12px] text-ink-3 leading-[1.35]">
          {done >= rows.length ? t.ready : t.progress.replace("{n}", String(done)).replace("{total}", String(rows.length))}
        </span>
      </div>
    </div>
  );
}
