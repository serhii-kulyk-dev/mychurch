"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useLang } from "@/lib/lang";
import { SUPPORT_COPY } from "@/content/support";

/* Специфікація, а не картки: рядки через волосяну лінію в одній панелі.
   Іконок тут навмисно немає — вище вже є ряд каналів з іконками, і два
   такі блоки поспіль читались би як одна довга таблиця.

   Під панеллю — три місця, де відповідь уже є. Окремим блоком із
   власним заголовком вони не варті екрана: це підпис, а не розділ. */

export default function SupportCare() {
  const { lang } = useLang();
  const c = SUPPORT_COPY[lang].care;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,400px)_1fr] gap-10 lg:gap-16 items-start">
        <SectionHeading
          align="left"
          eyebrow={c.eyebrow}
          title={c.title}
          text={c.text}
          className="lg:sticky lg:top-28"
        />

        <div className="flex flex-col gap-5">
          <FadeIn variant="right" delay={1}>
            <div className="rounded-[22px] border border-hairline bg-surface overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              {c.items.map((item, i) => (
                <div
                  key={item.title}
                  className={[
                    "flex flex-col gap-1.5 p-6 md:px-8 md:py-6",
                    i === c.items.length - 1 ? "" : "border-b border-hairline",
                  ].join(" ")}
                >
                  <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.3px]">
                    {item.title}
                  </h3>
                  <p className="text-[15px] text-ink-2 leading-[1.55]">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn variant="right" delay={2} className="flex flex-col gap-3">
            <p className="text-[14.5px] text-ink-3 leading-[1.5]">{c.selfText}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {c.selfLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex-1 flex items-start justify-between gap-3 rounded-2xl border border-hairline bg-surface px-5 py-4 hover:border-brand/40 hover:bg-surface-3 transition-colors"
                >
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-ink text-[15.5px] leading-[1.3] tracking-[-0.2px]">
                      {link.label}
                    </span>
                    <span className="text-[13px] text-ink-3 leading-[1.4]">{link.text}</span>
                  </span>
                  <ArrowRight
                    className="mt-0.5 w-[15px] h-[15px] text-ink-3 shrink-0 transition-all duration-200 group-hover:text-brand group-hover:translate-x-0.5"
                    strokeWidth={2.2}
                  />
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
