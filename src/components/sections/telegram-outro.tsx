"use client";

import { Check } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useLang } from "@/lib/lang";

/* Закриваючий абзац: бот — не окремий продукт, а та сама база. */

export default function TelegramOutro() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].outro;

  return (
    <section className="w-full flex flex-col items-center py-14 md:py-20 bg-surface border-t border-hairline">
      <FadeIn className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] gap-8 md:gap-14 items-start">
        <div className="flex flex-col gap-4">
          <h2 className="text-[26px] md:text-[32px] font-semibold text-ink leading-[1.2] tracking-[-0.8px]">{t.title}</h2>
          <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.55] max-w-[600px]">{t.text}</p>
        </div>
        <ul className="flex flex-col gap-3 md:pt-2">
          {t.points.map((p) => (
            <li key={p} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" strokeWidth={3.2} />
              </span>
              <span className="text-[14.5px] text-ink-2 leading-[1.45]">{p}</span>
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  );
}
