"use client";

import { Check, Minus } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";

export default function ConsultingScope() {
  const c = useT().consultingPage;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading align="left" eyebrow={c.scopeEyebrow} title={c.scopeTitle} />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5 md:gap-6">
          {/* Included */}
          <FadeIn variant="left">
            <div className="h-full rounded-[22px] border border-hairline bg-page p-6 md:p-8 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">
                {c.includedLabel}
              </span>
              <ul className="flex flex-col gap-3.5">
                {c.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center shrink-0">
                      <Check className="w-[13px] h-[13px] text-brand" strokeWidth={3} />
                    </span>
                    <span className="text-[15.5px] md:text-[16px] text-ink leading-[1.45]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Excluded */}
          <FadeIn variant="right" delay={1}>
            <div className="h-full flex flex-col gap-5 pt-1">
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                {c.excludedLabel}
              </span>
              <div className="flex flex-col gap-5">
                {c.excluded.map((item) => (
                  <div key={item.title} className="flex gap-3.5 pl-4 border-l-2 border-hairline-strong">
                    <span className="mt-1 w-5 h-5 rounded-full border border-hairline-strong flex items-center justify-center shrink-0 text-ink-3">
                      <Minus className="w-[11px] h-[11px]" strokeWidth={3} />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-ink text-[16.5px] leading-[1.3] tracking-[-0.2px]">
                        {item.title}
                      </h3>
                      <p className="text-[14.5px] text-ink-2 leading-[1.5]">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
