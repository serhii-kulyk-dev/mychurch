"use client";

import { Check } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import MyPhrase from "@/components/shared/my-phrase";
import { useT } from "@/lib/lang";

export default function AboutWhyMy() {
  const t = useT().about.why;
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 md:grid-cols-[0.82fr_1.18fr] gap-10 md:gap-14 items-start">
        <FadeIn className="flex flex-col gap-5 md:sticky md:top-28">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[34px] md:text-[46px] leading-[1.12] tracking-[-1.1px] md:tracking-[-1.6px]">
            <MyPhrase items={t.titleWords} accentClassName="text-brand" />
          </h2>
          <p className="text-[16.5px] md:text-[17.5px] text-ink-2 leading-[1.55]">{t.text}</p>
          <blockquote className="border-l-2 border-brand pl-4 md:pl-5 text-[16px] md:text-[17px] text-ink leading-[1.5]">
            {t.quote}
          </blockquote>
        </FadeIn>

        <div className="flex flex-col gap-5">
          <FadeIn variant="scale" delay={1}>
            <div className="overflow-hidden rounded-[24px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="hidden sm:grid grid-cols-2 border-b border-hairline">
                <div className="px-6 md:px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                  {t.columns.theirs}
                </div>
                <div className="px-6 md:px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand bg-brand-soft border-l border-hairline">
                  {t.columns.mine}
                </div>
              </div>

              {t.rows.map((row, i) => (
                <div key={row.mine} className={`grid grid-cols-1 sm:grid-cols-2 ${i > 0 ? "border-t border-hairline" : ""}`}>
                  <div className="flex items-start gap-3 px-6 md:px-7 py-4 md:py-5">
                    <span aria-hidden className="mt-[3px] w-[18px] h-[18px] rounded-full border border-hairline-strong shrink-0" />
                    <span className="flex flex-col gap-1">
                      <span className="sm:hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                        {t.columns.theirs}
                      </span>
                      <span className="text-[15.5px] text-ink-3 leading-[1.45]">{row.theirs}</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-3 px-6 md:px-7 py-4 md:py-5 bg-brand-soft border-t border-hairline sm:border-t-0 sm:border-l">
                    <span aria-hidden className="mt-[3px] w-[18px] h-[18px] rounded-full bg-brand/15 flex items-center justify-center shrink-0">
                      <Check className="w-[11px] h-[11px] text-brand" strokeWidth={3} />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="sm:hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                        {t.columns.mine}
                      </span>
                      <span className="text-[15.5px] font-medium text-ink leading-[1.45]">{row.mine}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn variant="scale" delay={2}>
            <div className="rounded-[24px] border border-hairline bg-surface p-6 md:p-7 flex flex-col gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <h3 className="font-semibold text-ink text-[18px] md:text-[20px] leading-[1.3] tracking-[-0.3px]">{t.footTitle}</h3>
              <p className="text-[15.5px] md:text-[16px] text-ink-2 leading-[1.55]">{t.footText}</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
