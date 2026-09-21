"use client";

import Link from "next/link";
import { ArrowUpRight, Send } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { SITE_EMAIL, SITE_TELEGRAM } from "@/lib/seo";

/* ────────────────────────────────────────────────────────────────
   Питання та відповіді.

   До 2026-09-21 сторінка була однаковими картками з плюсами, а над
   ними — ще й ряд чипів із тими самими назвами рубрик, що й заголовки
   нижче. Тепер це документ: рубрика заголовком, під нею рядки «питання
   ліворуч — відповідь праворуч». Акордеон зник разом із довгими
   відповідями: ховати два рядки за плюсом немає сенсу.
   ──────────────────────────────────────────────────────────────── */

export default function Faq() {
  const t = useT().faq;
  const common = useT().common;

  return (
    <div className="w-full bg-page">
      {/* Шапка: заголовок і один рядок. Ряд чипів із рубриками прибрано —
          ті самі назви стоять заголовками нижче. */}
      <section className="relative w-full bg-surface pt-14 md:pt-24 pb-12 md:pb-16 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="aurora-a absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-70"
            style={{ background: "radial-gradient(closest-side, var(--glow), transparent 100%)" }}
          />
        </div>
        <div className="relative z-10 w-full max-w-[1120px] mx-auto px-5 md:px-8 flex flex-col items-center gap-8 text-center">
          <FadeIn className="flex flex-col items-center gap-4">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
            <h1 className="font-semibold text-ink text-[36px] md:text-[56px] leading-[1.1] tracking-[-1.1px] md:tracking-[-1.8px]">
              {t.title}
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[560px]">{t.text}</p>
          </FadeIn>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-page pointer-events-none" />
      </section>

      <div className="w-full max-w-[1000px] mx-auto px-5 md:px-8 py-12 md:py-16 flex flex-col gap-12 md:gap-16">
        {t.categories.map((category, ci) => (
          <section key={category.title} className="flex flex-col">
            <FadeIn className="flex items-baseline gap-3 pb-4">
              <span className="text-[12.5px] font-semibold uppercase tracking-[0.16em] tabular-nums text-ink-3">
                {`0${ci + 1}`}
              </span>
              <h2 className="text-[22px] md:text-[28px] font-semibold text-ink leading-[1.15] tracking-[-0.6px]">
                {category.title}
              </h2>
            </FadeIn>

            {/* Питання ліворуч, відповідь праворуч — нічого не ховаємо за
                плюсом: відповіді короткі, а сховане не потрапляє на очі
                тому, хто гортає, і гірше читається пошуковиками. */}
            <div className="flex flex-col border-t border-hairline">
              {category.items.map((item, i) => (
                <FadeIn
                  key={item.id}
                  delay={i}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-1.5 md:gap-10 border-b border-hairline py-5 md:py-6"
                >
                  <h3 className="text-[16.5px] md:text-[18px] font-semibold text-ink leading-[1.35] tracking-[-0.25px]">
                    {item.question}
                  </h3>
                  <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.6]">{item.answer}</p>
                </FadeIn>
              ))}
            </div>
          </section>
        ))}

        {/* Не знайшли відповідь — смуга, а не ще одна картка. */}
        <FadeIn className="border-t border-hairline pt-8 md:pt-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-ink text-[20px] md:text-[24px] leading-[1.2] tracking-[-0.5px]">
              {t.stillQuestions}
            </h2>
            <p className="text-[15.5px] text-ink-2 leading-[1.5]">{t.stillQuestionsText}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 shrink-0">
            <Link
              href={SITE_TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 px-6 rounded-full overflow-hidden"
            >
              <Send className="relative w-4 h-4 text-white" strokeWidth={2.2} />
              <span className="relative text-white font-semibold text-[15px] tracking-[-0.3px] whitespace-nowrap">
                {common.telegram}
              </span>
            </Link>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="group inline-flex items-center gap-1.5 text-[15px] text-ink-3 hover:text-ink transition-colors whitespace-nowrap"
            >
              {SITE_EMAIL}
              <ArrowUpRight className="w-4 h-4 text-brand transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
