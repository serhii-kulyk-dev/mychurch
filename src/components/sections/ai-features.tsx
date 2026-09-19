"use client";

import { BellRing, ClipboardList, MessageSquareText, Send, UserRoundSearch, Users } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";

const ICONS = [UserRoundSearch, MessageSquareText, ClipboardList, Users, Send, BellRing];
const ACCENTS = ["#f05b8b", "#007aff", "#8b5bf0", "#12a150", "#f59e0b", "#0ea5e9"];

export default function AiFeatures() {
  const t = useT().ai.features;
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {t.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <FadeIn key={item.title} delay={i % 3} variant="scale" className="h-full">
                <article className="hover-lift h-full rounded-[20px] bg-surface border border-hairline p-6 md:p-7 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                  >
                    <Icon className="w-[22px] h-[22px]" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-ink text-[18px] md:text-[19px] leading-[1.3] tracking-[-0.3px]">{item.title}</h3>
                    <p className="text-[15.5px] text-ink-2 leading-[1.5]">{item.text}</p>
                  </div>
                  <div className="mt-auto pt-1 flex flex-col gap-1.5">
                    <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.exampleLabel}</span>
                    <span className="self-start inline-flex items-center gap-2 rounded-[14px] rounded-bl-[4px] bg-brand-soft px-3.5 py-2 text-[13.5px] font-medium text-brand leading-[1.35]">
                      «{item.example}»
                    </span>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
