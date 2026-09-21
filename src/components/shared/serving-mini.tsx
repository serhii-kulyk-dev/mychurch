"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2, Plus } from "lucide-react";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Служіння в блоці огляду — графік однієї неділі: рядок на команду,
   обличчя в ряд і одне порожнє коло там, де людини бракує. Хтось із
   церкви закриває цю позицію на очах — і все повторюється.

   Три колонки з наліплених облич читались як плями (2026-09-21:
   «має бути чітка візуалізація») — тепер це рядки, як у справжньому
   графіку: назва команди ліворуч, люди посередині, підпис праворуч.
   Велике демо з п'яти служінь лишилось на сторінці модуля.
   ──────────────────────────────────────────────────────────────── */

const ORANGE = "#f97316";
/* Колір курсора людини, яка закриває відкриту позицію. */
const CURSOR = "#0d9488";
const FILL_MS = 2100;
const HOLD_MS = 3200;

export default function ServingMini() {
  const t = useT().features.mocks.serving;
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [run, setRun] = useState(0);
  /* Відкрита позиція закрита: замість порожнього кола — обличчя. */
  const [full, setFull] = useState(false);

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
      const still = window.setTimeout(() => setFull(true), 0);
      return () => clearTimeout(still);
    }
    const fill = window.setTimeout(() => setFull(true), FILL_MS);
    const again = window.setTimeout(() => {
      setFull(false);
      setRun((n) => n + 1);
    }, FILL_MS + HOLD_MS);
    return () => {
      clearTimeout(fill);
      clearTimeout(again);
    };
  }, [live, run]);

  return (
    <div
      ref={hostRef}
      className="w-full max-w-[460px] mx-auto rounded-[18px] border border-hairline bg-surface overflow-hidden shadow-[0_26px_54px_-36px_rgba(0,40,100,0.5)]"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-2">
        <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ORANGE }} />
        <span className="text-[12.5px] font-semibold text-ink-2 leading-none truncate">{t.caption}</span>
        <span className="ml-auto shrink-0 text-[11.5px] text-ink-3 leading-none tabular-nums">
          {full ? t.countFull : t.count}
        </span>
      </div>

      <ul className="mock-on flex flex-col divide-y divide-hairline">
        {t.teams.map((team, i) => (
          <li
            key={team.name}
            className="mock-row relative flex items-center gap-3 px-4 py-3.5"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <span className="w-[86px] sm:w-[104px] shrink-0 text-[12.5px] sm:text-[13.5px] font-semibold text-ink leading-[1.2] truncate">
              {team.name}
            </span>

            <span className="relative flex items-center gap-1.5 min-w-0">
              {team.people.map((p) => (
                <PersonAvatar key={p} look={lookFor(p)} size={36} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              ))}

              {/* Порожнє коло — це і є відкрита позиція: її видно, а не
                  написано словами. */}
              {team.need &&
                (full ? (
                  <PersonAvatar
                    key="joined"
                    look={lookFor(t.joins)}
                    size={36}
                    className="pin-in w-8 h-8 sm:w-9 sm:h-9 shrink-0"
                  />
                ) : (
                  <span
                    className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface border-[1.5px] border-dashed flex items-center justify-center"
                    style={{ borderColor: ORANGE, color: ORANGE }}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.6} />
                  </span>
                ))}

              {/* Курсор того, хто закриває позицію: підлітає до кола і тисне. */}
              {team.need && !full && (
                <span
                  key={run}
                  aria-hidden
                  className="plan-cursor absolute -right-6 -bottom-5 z-10 flex items-center gap-1.5 pointer-events-none"
                  style={{ color: CURSOR, animationDelay: "900ms", animationDuration: "1300ms" }}
                >
                  <MousePointer2
                    className="w-[18px] h-[18px] fill-current drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
                    strokeWidth={1.5}
                  />
                  <span
                    className="rounded-full px-2 py-[3px] text-[10.5px] font-semibold text-white leading-none whitespace-nowrap shadow-[0_6px_14px_-8px_rgba(0,0,0,0.6)]"
                    style={{ background: CURSOR }}
                  >
                    {t.joins}
                  </span>
                </span>
              )}
            </span>

            <span
              className={cn(
                "ml-auto shrink-0 text-[11.5px] leading-none tabular-nums",
                team.need && !full ? "font-semibold" : "text-ink-3"
              )}
              style={team.need && !full ? { color: ORANGE } : undefined}
            >
              {team.need && full ? team.noteFull : team.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
