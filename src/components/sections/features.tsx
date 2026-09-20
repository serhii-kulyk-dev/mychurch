"use client";

import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";
import AnalyticsShowcase from "@/components/shared/analytics-showcase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PeopleExplorer from "@/components/shared/people-explorer";

/* Analytics (block 1) is a screen of its own — it rotates through five charts
   instead of listing them, so it brings its own layout. */
const ANALYTICS_BLOCK = 1;

const VISUALS = [
  {
    imageLeft: true,
    tint: "linear-gradient(140deg, color-mix(in oklab, var(--brand) 12%, var(--surface)) 0%, color-mix(in oklab, var(--brand) 5%, var(--surface)) 55%, var(--surface) 100%)",
  },
  {
    imageLeft: false,
    tint: "linear-gradient(140deg, color-mix(in oklab, #8b5bf0 12%, var(--surface)) 0%, color-mix(in oklab, #8b5bf0 5%, var(--surface)) 55%, var(--surface) 100%)",
  },
];

export default function Features() {
  const t = useT().features;
  return (
    <section id="product" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-16">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />

        <div className="flex flex-col gap-5 md:gap-6">
          {t.blocks.map((block, i) => {
            const v = VISUALS[i];
            if (i === ANALYTICS_BLOCK) {
              return (
                <FadeIn key={block.title} variant="scale" delay={1}>
                  <AnalyticsShowcase block={block} tint={v.tint} />
                </FadeIn>
              );
            }
            return (
              <FadeIn key={block.title} variant="scale" delay={0}>
                <article className="overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-[1.35fr_1fr]">
                  <div
                    className={[
                      "relative flex items-center justify-center min-h-[260px] md:min-h-[400px] p-4 md:p-7",
                      v.imageLeft ? "md:order-1" : "md:order-2",
                    ].join(" ")}
                    style={{ background: v.tint }}
                  >
                    <PeopleExplorer />
                  </div>

                  <div
                    className={[
                      "flex flex-col justify-center gap-3 p-7 md:p-10",
                      v.imageLeft ? "md:order-2" : "md:order-1",
                    ].join(" ")}
                  >
                    {/* Одне слово, одне речення, одна дія. Перелік умінь був
                        рядом чипів — його показує сам екран поруч, не підпис. */}
                    <h3 className="font-semibold text-ink text-[44px] md:text-[64px] leading-[0.98] tracking-[-2px]">
                      {block.title}
                    </h3>
                    <p className="text-[16.5px] md:text-[18px] font-normal text-ink-2 leading-[1.5] max-w-[340px]">
                      {block.text}
                    </p>
                    <Link
                      href="/modules/people"
                      className="btn-secondary relative mt-3 inline-flex items-center justify-center gap-2 h-12 w-fit px-7 rounded-full overflow-hidden border border-hairline-strong"
                    >
                      <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
                      <span className="relative text-ink font-medium text-[16px] tracking-[-0.32px] leading-none">
                        {t.open}
                      </span>
                      <ArrowRight className="relative w-[17px] h-[17px] text-brand" strokeWidth={2.2} />
                    </Link>
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
