"use client";

import { PenLine, Search, Wrench, CheckCheck } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useLang } from "@/lib/lang";
import { SUPPORT_COPY } from "@/content/support";

const STEP_ICONS = [PenLine, Search, Wrench, CheckCheck];

export default function SupportFlow() {
  const { lang } = useLang();
  const c = SUPPORT_COPY[lang].flow;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} text={c.text} />

        {/* One horizontal track on desktop, a vertical thread on phones. */}
        <div className="relative">
          <span
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-[22px] h-px bg-hairline-strong"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {c.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? PenLine;
              const last = i === c.steps.length - 1;
              return (
                <FadeIn key={step.title} delay={i} className="relative">
                  <div className="flex md:flex-col gap-4 md:gap-4 md:pr-4">
                    {/* Marker column — on phones it carries the thread */}
                    <div className="flex flex-col items-center md:items-start md:flex-row md:gap-3 shrink-0">
                      <span className="relative z-10 w-11 h-11 rounded-full bg-surface border border-hairline-strong flex items-center justify-center text-brand shadow-[0_8px_20px_-14px_rgba(0,0,0,0.4)]">
                        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                      </span>
                      {!last && (
                        <span aria-hidden className="md:hidden flex-1 w-px bg-hairline-strong mt-2" />
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pb-2 md:pb-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[12px] font-semibold text-brand tabular-nums tracking-[0.1em]">
                          0{i + 1}
                        </span>
                        <h3 className="font-semibold text-ink text-[18px] md:text-[19px] leading-[1.25] tracking-[-0.35px]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-[15px] text-ink-2 leading-[1.55]">{step.text}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        <FadeIn delay={2}>
          <p className="text-[14.5px] text-ink-3 leading-[1.55] max-w-[720px] pl-4 border-l-2 border-brand/40">
            {c.note}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
