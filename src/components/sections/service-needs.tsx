"use client";

import { useState } from "react";
import { Baby, Bus, ClipboardList, Languages, Music4, Presentation, Sparkles, UtensilsCrossed, Volume2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Хто потрібен на подію. Не список ролей, а стан набору: кожна
   позиція — ряд крапок, зелені вже закриті, пунктирні ще шукають
   людину. Подію обирають зліва, картка праворуч перемальовується.
   Живе на сторінці модуля «Планування служіння» — на головній це
   зайвий екран поверх самого плану.
   ──────────────────────────────────────────────────────────────── */

const ROLE_ICONS: Record<string, LucideIcon> = {
  sound: Volume2, slides: Presentation, worship: Music4, registration: ClipboardList,
  translation: Languages, decor: Sparkles, kids: Baby, transport: Bus, kitchen: UtensilsCrossed,
};

export default function ServiceNeeds({ accent = "var(--brand)" }: { accent?: string }) {
  const needs = useT().servicePlanning.needs;
  const [event, setEvent] = useState(0);

  const ev = needs.events[event];
  const openOf = (e: typeof ev) => e.roles.reduce((sum, r) => sum + Math.max(0, r.need - r.filled), 0);
  const evOpen = openOf(ev);

  return (
    <section id="needs" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
        <FadeIn className="flex flex-col gap-4">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>{needs.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[28px] md:text-[40px] leading-[1.06] tracking-[-1px] md:tracking-[-1.6px]">{needs.title}</h2>

          <ul className="flex flex-col gap-2 pt-2">
            {needs.events.map((e, i) => {
              const open = openOf(e);
              return (
                <li key={e.name}>
                  <button
                    onClick={() => setEvent(i)}
                    aria-pressed={event === i}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors",
                      event === i
                        ? "bg-surface border-hairline-strong shadow-[0_10px_24px_-20px_rgba(0,0,0,0.5)]"
                        : "bg-transparent border-hairline hover:border-hairline-strong"
                    )}
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={cn("text-[14px] font-medium leading-none truncate", event === i ? "text-ink" : "text-ink-2")}>{e.name}</span>
                      <span className="text-[12px] text-ink-3 leading-none mt-1.5">{e.date}</span>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold leading-none",
                        open === 0 ? "bg-[#12a150]/12 text-[#0e7a3c] dark:text-[#3ddc97]" : "bg-[#ff9500]/14 text-[#c46a00] dark:text-[#ffb454]"
                      )}
                    >
                      {open === 0 ? needs.closed : `+${open}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FadeIn>

        <FadeIn delay={2} className="rounded-[24px] border border-hairline bg-surface-2 overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-hairline bg-surface">
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-semibold text-ink leading-none truncate">{ev.name}</span>
              <span className="text-[12.5px] text-ink-3 leading-none mt-1.5">{ev.date}</span>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold leading-none",
                evOpen === 0 ? "bg-[#12a150]/12 text-[#0e7a3c] dark:text-[#3ddc97]" : "bg-[#ff9500]/14 text-[#c46a00] dark:text-[#ffb454]"
              )}
            >
              {evOpen === 0 ? needs.allClosed : needs.openLabel.replace("{n}", String(evOpen))}
            </span>
          </div>

          <ul key={event} className="px-5 py-2">
            {ev.roles.map((role, i) => {
              const Icon = ROLE_ICONS[role.kind] ?? ClipboardList;
              const covered = role.filled >= role.need;
              return (
                <li
                  key={role.name}
                  className="plan-slot-on flex items-center gap-3 py-3 border-b border-hairline last:border-b-0"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span className="w-8 h-8 rounded-xl bg-surface border border-hairline flex items-center justify-center shrink-0">
                    <Icon className="w-[15px] h-[15px] text-ink-2" strokeWidth={2} />
                  </span>
                  <span className="w-[92px] sm:w-[120px] shrink-0 text-[14px] font-medium text-ink leading-none truncate">{role.name}</span>

                  <span className="flex items-center gap-1.5 flex-1 flex-wrap">
                    {Array.from({ length: role.need }, (_, sl) => (
                      <span
                        key={sl}
                        className={cn(
                          "w-[11px] h-[11px] rounded-full",
                          sl < role.filled ? "bg-[#12a150]" : "border border-dashed border-[#c46a00] dark:border-[#ffb454]"
                        )}
                      />
                    ))}
                  </span>

                  <span className={cn("shrink-0 text-[12px] font-semibold leading-none tabular-nums", covered ? "text-[#0e7a3c] dark:text-[#3ddc97]" : "text-ink-3")}>
                    {covered ? needs.closed : needs.of.replace("{filled}", String(role.filled)).replace("{need}", String(role.need))}
                  </span>
                </li>
              );
            })}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
