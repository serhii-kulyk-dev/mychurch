"use client";

import { ArrowRight, Check } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   «Як це починалось» — два такти однієї історії.

   Іконку-ракету й іконку-людей прибрано (2026-09-21): вони нічого не
   показували. Замість них сама картина того, що сталось: розрізнені
   папірці, які церква веде руками, — і один екран, у який вони
   зійшлись. Тексти під половинами лишились ті самі, нових рядків
   картинка не просить: у ній немає жодного слова.
   ──────────────────────────────────────────────────────────────── */

/* Три папірці: кут нахилу, зсув по горизонталі й по вертикалі. */
const SHEETS = [
  { deg: -9, x: -52, y: 12 },
  { deg: 4, x: 0, y: -8 },
  { deg: 12, x: 52, y: 16 },
];

/* Довжини рядків у папірці — щоб три копії не були однаковими. */
const SCRIBBLE = [
  ["86%", "62%", "74%"],
  ["70%", "88%", "54%"],
  ["58%", "76%", "68%"],
];

function Sheets() {
  return (
    <>
      {SHEETS.map((s, i) => (
        <span
          key={s.deg}
          className="absolute w-[140px] md:w-[158px] rounded-[14px] border border-hairline-strong bg-surface p-3.5 flex flex-col gap-2.5 shadow-[0_20px_36px_-22px_rgba(0,0,0,0.55)]"
          style={{ transform: `translate(${s.x}px, ${s.y}px) rotate(${s.deg}deg)` }}
        >
          <span aria-hidden className="h-1.5 w-9 rounded-full bg-ink-3/45" />
          {SCRIBBLE[i].map((w) => (
            <span key={w} aria-hidden className="h-1.5 rounded-full bg-hairline-strong" style={{ width: w }} />
          ))}
        </span>
      ))}
    </>
  );
}

function Screen() {
  return (
    <span className="relative w-[210px] md:w-[240px] rounded-[16px] border border-hairline bg-surface overflow-hidden shadow-[0_24px_44px_-26px_rgba(0,50,120,0.5)]">
      <span className="flex items-center gap-2 border-b border-hairline px-3.5 py-2.5">
        <span aria-hidden className="w-2 h-2 rounded-full bg-brand" />
        <span aria-hidden className="h-1.5 w-16 rounded-full bg-hairline-strong" />
      </span>
      <span className="flex flex-col">
        {["78%", "58%", "68%"].map((w, i) => (
          <span key={w} className={`flex items-center gap-2.5 px-3.5 py-2.5 ${i > 0 ? "border-t border-hairline" : ""}`}>
            <span aria-hidden className="w-5 h-5 rounded-full bg-brand-soft shrink-0" />
            <span aria-hidden className="h-1.5 rounded-full bg-hairline flex-1" style={{ maxWidth: w }} />
            <span aria-hidden className="w-4 h-4 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-brand" strokeWidth={3.5} />
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

export default function AboutStory() {
  const t = useT().about.story;
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      {/* Одна колонка, один напрям: заголовок → картинка → два такти під нею. */}
      <div className="w-full max-w-[1000px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <FadeIn className="flex flex-col gap-4 max-w-[680px]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[32px] md:text-[48px] leading-[1.08] tracking-[-1.1px] md:tracking-[-1.8px]">
            {t.title}
          </h2>
          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.5]">{t.text}</p>
        </FadeIn>

        <FadeIn variant="scale" delay={1}>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-[26px] md:rounded-[30px] border border-hairline bg-surface">
            {/* Як було: те саме, що й тепер лежить по чатах і зошитах. */}
            <div className="relative flex items-center justify-center min-h-[230px] md:min-h-[270px] bg-surface-2 overflow-hidden">
              <Sheets />
            </div>

            {/* Як стало: усі три папірці — рядками одного екрана. */}
            <div
              className="relative flex items-center justify-center min-h-[230px] md:min-h-[270px] border-t sm:border-t-0 sm:border-l border-hairline overflow-hidden"
              style={{
                background:
                  "linear-gradient(150deg, color-mix(in oklab, var(--brand) 12%, var(--surface)) 0%, color-mix(in oklab, var(--brand) 4%, var(--surface)) 55%, var(--surface) 100%)",
              }}
            >
              <Screen />
            </div>

            {/* Перехід стоїть на самому стику половин. */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex w-10 h-10 rounded-full bg-surface border border-hairline items-center justify-center shadow-[0_10px_24px_-14px_rgba(0,0,0,0.45)]"
            >
              {/* На телефоні половини стоять одна під одною — стрілка лягає донизу. */}
              <ArrowRight className="w-[17px] h-[17px] text-brand rotate-90 sm:rotate-0" strokeWidth={2.2} />
            </span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6 md:gap-10">
          {t.cards.map((card, i) => (
            <FadeIn key={card.title} delay={i + 1} className="flex flex-col gap-2.5">
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] tabular-nums" style={{ color: i === 0 ? "var(--ink-3)" : "var(--brand)" }}>
                {`0${i + 1}`}
              </span>
              <h3 className="font-semibold text-ink text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.5px]">
                {card.title}
              </h3>
              <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.5]">{card.text}</p>
            </FadeIn>
          ))}
        </div>

        {/* Хто за цим стоїть — рядок з лінією, а не третя картка з іконкою. */}
        <FadeIn delay={2} className="border-l-2 border-brand pl-4 md:pl-5">
          <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.55]">
            <strong className="font-semibold text-ink">{t.insider.title}.</strong> {t.insider.text}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
