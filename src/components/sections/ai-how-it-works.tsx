"use client";

import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";

export default function AiHowItWorks() {
  const t = useT().ai.howItWorks;
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
          {/* Connector line on desktop */}
          <div aria-hidden className="hidden md:block absolute left-[16.6%] right-[16.6%] top-[28px] h-[2px]" style={{ backgroundImage: "repeating-linear-gradient(to right, var(--hairline-strong) 0 6px, transparent 6px 12px)" }} />

          {t.steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 2} className="relative flex flex-col gap-4 md:items-center md:text-center">
              <span className="relative z-10 w-14 h-14 rounded-full btn-brand flex items-center justify-center text-white font-semibold text-[20px]">
                {i + 1}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-ink text-[18px] md:text-[19px] leading-[1.3] tracking-[-0.3px]">{step.title}</h3>
                <p className="text-[15.5px] text-ink-2 leading-[1.5] max-w-[320px]">{step.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
