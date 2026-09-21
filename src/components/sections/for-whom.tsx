"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import AnimatedHeadline, { countWords, useHeadlineStage } from "@/components/shared/animated-headline";
import { ROLE_ACCENTS, ROLE_ICONS } from "@/components/shared/role-icons";
import { useT } from "@/lib/lang";

/* Головна, «Для кого»: дев'ять плашок в один ряд — велике ім'я ролі й один
   рядок про те, що вона робить. Ряд гортає сама людина: автоскрол за
   гортанням сторінки пробували й прибрали (2026-09-21) — він смикав
   ряд під руками. Живі екрани ролей лишились на /for-whom. */

export default function ForWhom() {
  const t = useT().audience;
  const hostRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const headStage = useHeadlineStage(countWords(t.titleLines, t.titleAccent), headRef);
  const [progress, setProgress] = useState(0);

  return (
    <section id="for-whom" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24 overflow-hidden">
      {/* Заголовок набирається по словах, коли розділ доходить до екрана. */}
      <div ref={headRef} className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col items-center text-center gap-4">
        <AnimatedHeadline
          as="h2"
          lines={t.titleLines}
          accent={t.titleAccent}
          oneLine
          stage={headStage}
          className="font-semibold text-ink uppercase text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px] max-w-[900px]"
        />
      </div>

      <FadeIn className="w-full mt-10 md:mt-14">
        <div ref={hostRef} className="w-full flex flex-col items-center gap-5">
          <div
            ref={railRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              const max = el.scrollWidth - el.clientWidth;
              setProgress(max > 8 ? el.scrollLeft / max : 0);
            }}
            className="no-scrollbar w-full flex gap-3 md:gap-4 overflow-x-auto overscroll-x-contain snap-x snap-mandatory md:snap-proximity scroll-px-5 px-5 md:scroll-px-8 md:px-8 lg:scroll-px-[max(2rem,calc((100vw-1120px)/2))] lg:px-[max(2rem,calc((100vw-1120px)/2))] pb-1"
          >
            {t.roles.map((role) => {
              const accent = ROLE_ACCENTS[role.id];
              const Icon = ROLE_ICONS[role.id];
              return (
                <Link
                  key={role.id}
                  href={`/for-whom/${role.id}`}
                  style={
                    {
                      "--accent": accent,
                      "--accent-soft": `color-mix(in oklab, ${accent} 12%, var(--surface))`,
                      "--accent-line": `color-mix(in oklab, ${accent} 32%, var(--surface))`,
                      /* Плашка живе в кольорі своєї ролі — градієнтом, що
                         стікає до білого, як у картках модулів. */
                      background: `linear-gradient(145deg, color-mix(in oklab, ${accent} 9%, var(--surface)) 0%, color-mix(in oklab, ${accent} 3.5%, var(--surface)) 45%, var(--surface) 100%)`,
                      borderColor: `color-mix(in oklab, ${accent} 20%, var(--surface))`,
                    } as React.CSSProperties
                  }
                  className="group snap-start shrink-0 w-[80vw] max-w-[330px] md:w-[380px] md:max-w-none min-h-[176px] md:min-h-[196px] rounded-[26px] border p-6 md:p-7 flex flex-col gap-3.5 transition-colors duration-200 hover:border-[var(--accent-line)]"
                >
                  {/* Слово «Детальніше» під кожною з дев'яти плашок читалось
                      дев'ять разів поспіль — лишилась сама стрілка, яка
                      заливається кольором ролі, коли на плашку наводять. */}
                  <span className="flex items-center justify-between gap-3">
                    <span
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
                    >
                      <Icon className="w-[22px] h-[22px]" strokeWidth={2.1} />
                    </span>
                    <span
                      aria-hidden
                      className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center shrink-0 text-ink-3 transition-colors duration-200 group-hover:bg-[var(--accent-soft)] group-hover:border-[var(--accent-line)] group-hover:text-[var(--accent)]"
                    >
                      <ArrowUpRight className="w-[17px] h-[17px]" strokeWidth={2.2} />
                    </span>
                  </span>
                  <h3 className="font-semibold text-ink text-[36px] md:text-[46px] leading-[1.02] tracking-[-1.6px]">
                    {role.short}
                  </h3>
                  <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.45] truncate">{role.tagline}</p>
                </Link>
              );
            })}
          </div>

          {/* Смужка замість стрілок: видно, що ряд довший за екран і де ми в ньому. */}
          <div aria-hidden className="h-[3px] w-[120px] rounded-full bg-hairline overflow-hidden">
            <span
              className="block h-full w-1/3 rounded-full bg-ink-3 transition-transform duration-150 ease-out"
              style={{ transform: `translateX(${progress * 200}%)` }}
            />
          </div>
        </div>
      </FadeIn>

      <div className="mt-8 md:mt-10 w-full max-w-[1120px] px-5 md:px-8 flex justify-center">
        <Link href="/for-whom" className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ink-2 hover:text-ink transition-colors">
          {t.allRoles}
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
