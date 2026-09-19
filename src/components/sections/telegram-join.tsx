"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import CursorDemo from "@/components/shared/cursor-demo";
import FadeIn from "@/components/shared/fade-in";
import { AVATAR_LOOKS } from "@/components/shared/illustrated-avatar";
import SectionHeading from "@/components/shared/section-heading";
import { TgHeader, TgInline, TgMessage } from "@/components/shared/tg-screen";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Три екрани поспіль: гість подає, лідер вирішує, обоє бачать результат.
   Примарний курсор іде по активному кроці й сам передає хід далі. */

const ACCENTS = ["#f05b8b", "#007aff", "#12a150"];
const LOOKS = [AVATAR_LOOKS[1], AVATAR_LOOKS[3], AVATAR_LOOKS[5]];

export default function TelegramJoin() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].join;
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  const next = () => {
    setStep((s) => (s + 1) % t.steps.length);
    setRun((r) => r + 1);
  };

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} align="left" />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 items-stretch">
          {t.steps.map((s, i) => {
            const on = i === step;
            const accent = ACCENTS[i % ACCENTS.length];
            /* Курсор тисне головну кнопку кроку — останній крок просто показує підсумок. */
            const target = s.screen.buttons.flat().find((b) => b.primary || b.tone === "green")?.t;

            return (
              <FadeIn key={s.id} delay={i * 2} variant="scale" className="min-w-0 flex flex-col gap-4 relative">
                {/* Стрілка між панелями — лише на широкому екрані */}
                {i < t.steps.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden md:flex absolute -right-3 lg:-right-5 top-[150px] z-10 w-7 h-7 rounded-full bg-surface border border-hairline items-center justify-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-ink-3" strokeWidth={2.6} />
                  </span>
                )}

                <div className="flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold text-white shrink-0 transition-opacity duration-300"
                    style={{ background: accent, opacity: on ? 1 : 0.45 }}
                  >
                    {s.badge}
                  </span>
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 truncate">{s.who}</span>
                </div>

                <CursorDemo
                  playKey={`join-${i}-${run}`}
                  active={on}
                  startDelay={900}
                  onDone={on ? next : undefined}
                  label={s.who.split(",")[0]}
                  look={LOOKS[i % LOOKS.length]}
                  accent={accent}
                  mode="touch"
                  className={cn(
                    "rounded-[22px] border bg-surface overflow-hidden transition-all duration-400",
                    on
                      ? "shadow-[0_30px_60px_-42px_rgba(0,50,120,0.55)]"
                      : "opacity-[0.72] shadow-none"
                  )}
                >
                  <div
                    className="rounded-[22px] overflow-hidden border"
                    style={{ borderColor: on ? `color-mix(in oklab, ${accent} 45%, transparent)` : "var(--hairline)" }}
                  >
                    <TgHeader title={s.screen.header} sub={s.screen.sub} />
                    <div className="tg-wallpaper p-4 flex flex-col gap-2.5 min-h-[248px] justify-end">
                      <TgMessage lines={s.screen.lines} />
                      <TgInline rows={s.screen.buttons} className="pl-1 pr-6" demo={on ? target : undefined} />
                    </div>
                  </div>
                </CursorDemo>

                <div className="flex flex-col gap-2">
                  <h3 className="text-[17px] font-semibold text-ink leading-[1.3]">{s.title}</h3>
                  <p className="text-[14.5px] text-ink-2 leading-[1.5]">{s.text}</p>
                  <p
                    className="mt-1 pl-3 border-l-2 text-[13px] text-ink-3 leading-[1.45]"
                    style={{ borderColor: `color-mix(in oklab, ${accent} 50%, transparent)` }}
                  >
                    {s.screen.result}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn className="max-w-[720px] text-[14px] text-ink-3 leading-[1.55]">{t.footnote}</FadeIn>
      </div>
    </section>
  );
}
