"use client";

import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   «Місія» — три принципи, які слоган зобов'язує виконувати.

   Було: темна картка з іконкою-серцем і дві однакові плитки збоку.
   Стало (2026-09-21): маніфест смугами — номер, великий заголовок і
   одне речення, розділені волосинами на всю ширину. Живу картинку в
   цьому місці показувати нічим: рівно над блоком стоїть анімований
   екран шапки, і другий підряд зробив би зі сторінки стіну демо.
   ──────────────────────────────────────────────────────────────── */

export default function AboutMission() {
  const t = useT().about.mission;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <div className="flex flex-col">
          {t.points.map((point, i) => (
            <FadeIn
              key={point}
              delay={i}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr_1.02fr] gap-x-7 lg:gap-x-12 gap-y-3 border-t border-hairline py-7 md:py-10"
            >
              {/* Перший принцип несе всю місію — тільки його номер у кольорі. */}
              <span
                className="flex items-center gap-2.5 self-start text-[12.5px] font-semibold uppercase tracking-[0.16em] tabular-nums md:pt-[11px]"
                style={{ color: i === 0 ? "var(--brand)" : "var(--ink-3)" }}
              >
                <span
                  aria-hidden
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: i === 0 ? "var(--brand)" : "var(--hairline-strong)" }}
                />
                {`0${i + 1}`}
              </span>

              <h3 className="font-semibold text-ink text-[24px] md:text-[32px] leading-[1.13] tracking-[-0.6px] md:tracking-[-0.9px] max-w-[420px]">
                {point}
              </h3>

              <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.6] max-w-[520px] md:pt-1.5">
                {t.details[i]}
              </p>
            </FadeIn>
          ))}
          {/* Остання волосина закриває перелік, щоб він не обривався в повітрі. */}
          <span aria-hidden className="border-t border-hairline" />
        </div>
      </div>
    </section>
  );
}
