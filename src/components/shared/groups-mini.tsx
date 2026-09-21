"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Check } from "lucide-react";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Малі групи в блоці огляду — відмітка явки однієї зустрічі: тема,
   а під нею люди поіменно з галочками, які лягають одна за одною.
   Того, кого не було, видно окремо.

   Ряд наліплених облич із дрібними галочками й смужкою прогресу
   читався як пляма (2026-09-21: «має бути чітка візуалізація») —
   тепер це список із іменами, як у самій системі. Тиждень по всіх
   днях лишився у великому демо на сторінці модуля.
   ──────────────────────────────────────────────────────────────── */

const TEAL = "#0d9488";
const TICK_MS = 320;
const HOLD_MS = 2600;

const tint = (pct: number) => `color-mix(in oklab, ${TEAL} ${pct}%, var(--surface))`;

export default function GroupsMini() {
  const t = useT().features.mocks.groups;
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [run, setRun] = useState(0);
  const [ticks, setTicks] = useState(0);

  /* Галочки лягають підряд по присутніх: того, кого немає, черга обходить. */
  let seen = 0;
  const roster = t.members.map((name) => {
    const missing = name === t.missing;
    return { name, missing, order: missing ? -1 : seen++ };
  });
  const present = seen;

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
      const still = window.setTimeout(() => setTicks(present), 0);
      return () => clearTimeout(still);
    }
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setTicks(0), 0));
    for (let i = 1; i <= present; i++) {
      timers.push(window.setTimeout(() => setTicks(i), TICK_MS * i));
    }
    timers.push(window.setTimeout(() => setRun((n) => n + 1), TICK_MS * present + HOLD_MS));
    return () => timers.forEach(clearTimeout);
  }, [live, run, present]);

  return (
    <div
      ref={hostRef}
      className="w-full max-w-[460px] mx-auto rounded-[18px] border border-hairline bg-surface overflow-hidden shadow-[0_26px_54px_-36px_rgba(0,40,100,0.5)]"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-2">
        <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TEAL }} />
        <span className="text-[12.5px] font-semibold text-ink-2 leading-none truncate">{t.name}</span>
        <span className="ml-auto shrink-0 text-[11.5px] text-ink-3 leading-none">{t.when}</span>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3.5">
        {/* Тема — те, заради чого люди й прийшли. */}
        <span className="flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={{ background: tint(8) }}>
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: tint(16), color: TEAL }}
          >
            <BookOpen className="w-[14px] h-[14px]" strokeWidth={2.2} />
          </span>
          <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink leading-[1.2] truncate">{t.topic}</span>
        </span>

        {/* Явка поіменно: у кожного своя клітинка, галочка лягає сама. */}
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
          {roster.map(({ name, missing, order }) => {
            const ticked = !missing && order < ticks;
            return (
              <li key={name} className="flex items-center gap-2 py-1">
                <PersonAvatar
                  look={lookFor(name)}
                  size={28}
                  className={cn("w-7 h-7 shrink-0 transition-all duration-300", missing && "grayscale opacity-45")}
                />
                <span
                  className={cn(
                    "flex-1 min-w-0 text-[12.5px] leading-none truncate transition-colors duration-300",
                    missing ? "text-ink-3" : "text-ink font-medium"
                  )}
                >
                  {name}
                </span>
                <span
                  className={cn(
                    "w-[18px] h-[18px] rounded-[6px] border-[1.5px] flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-200",
                    !ticked && "border-hairline-strong bg-surface"
                  )}
                  style={ticked ? { background: TEAL, borderColor: TEAL } : undefined}
                >
                  {ticked && <Check className="pin-in w-3 h-3 text-white" strokeWidth={3.6} />}
                </span>
              </li>
            );
          })}
        </ul>

        <span className="flex items-center gap-1.5 text-[12px] font-semibold leading-none tabular-nums" style={{ color: TEAL }}>
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
          {t.rate}
        </span>
      </div>
    </div>
  );
}
