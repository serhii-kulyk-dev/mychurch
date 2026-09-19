"use client";

import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";
import { GroupsMock } from "@/components/shared/feature-mocks";
import AnalyticsShowcase from "@/components/shared/analytics-showcase";
import {
  IdCard, UserX, NotebookPen, Route, Search,
  Users, ClipboardCheck, CalendarDays, Send, ArrowRightLeft,
} from "lucide-react";
import PeopleExplorer from "@/components/shared/people-explorer";

/* Analytics (block 1) is a screen of its own — it rotates through five charts
   instead of listing them, so it brings its own layout. */
const ANALYTICS_BLOCK = 1;

/* One icon per point, in dictionary order */
const PEOPLE_ICONS = [IdCard, UserX, NotebookPen, Route, Search];
const GROUP_ICONS = [Users, ClipboardCheck, CalendarDays, Send, ArrowRightLeft];
const ACCENTS = ["var(--brand)", "#8b5bf0", "#12a150"];

const VISUALS = [
  {
    imageLeft: true,
    tint: "linear-gradient(140deg, color-mix(in oklab, var(--brand) 12%, var(--surface)) 0%, color-mix(in oklab, var(--brand) 5%, var(--surface)) 55%, var(--surface) 100%)",
  },
  {
    imageLeft: false,
    tint: "linear-gradient(140deg, color-mix(in oklab, #8b5bf0 12%, var(--surface)) 0%, color-mix(in oklab, #8b5bf0 5%, var(--surface)) 55%, var(--surface) 100%)",
  },
  {
    imageLeft: true,
    tint: "linear-gradient(140deg, color-mix(in oklab, #12a150 12%, var(--surface)) 0%, color-mix(in oklab, #12a150 5%, var(--surface)) 55%, var(--surface) 100%)",
  },
];

export default function Features() {
  const t = useT().features;
  return (
    <section id="product" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-16">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

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
            const Mock = i === 0 ? PeopleExplorer : GroupsMock;
            const icons = i === 0 ? PEOPLE_ICONS : GROUP_ICONS;
            return (
              <FadeIn key={block.title} variant="scale" delay={i === 0 ? 0 : 1}>
                <article className={["overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)] grid grid-cols-1", i === 0 ? "md:grid-cols-[1.35fr_1fr]" : "md:grid-cols-2"].join(" ")}>
                  <div
                    className={[
                      "relative flex items-center justify-center min-h-[260px] md:min-h-[400px]",
                      i === 0 ? "p-4 md:p-7" : "p-6 md:p-10",
                      v.imageLeft ? "md:order-1" : "md:order-2",
                    ].join(" ")}
                    style={{ background: v.tint }}
                  >
                    <Mock />
                  </div>

                  <div
                    className={[
                      "flex flex-col justify-center gap-3 p-7 md:p-10",
                      v.imageLeft ? "md:order-2" : "md:order-1",
                    ].join(" ")}
                  >
                    <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">
                      {block.eyebrow}
                    </span>
                    <h3 className="font-semibold text-ink text-[22px] md:text-[28px] leading-[1.2] tracking-[-0.6px]">
                      {block.title}
                    </h3>
                    <p className="text-[15.5px] font-normal text-ink-2 leading-[1.55]">{block.text}</p>
                    <ul className="flex flex-col gap-3 pt-2">
                      {block.points.map((pt, k) => {
                        const PIcon = icons[k];
                        return (
                          <li key={pt.title} className="flex items-start gap-3">
                            <span
                              className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `color-mix(in oklab, ${ACCENTS[i]} 13%, var(--surface))`, color: ACCENTS[i] }}
                            >
                              <PIcon className="w-4 h-4" strokeWidth={2.2} />
                            </span>
                            <span className="flex flex-col gap-0.5">
                              <span className="text-[15px] font-semibold text-ink leading-[1.3] tracking-[-0.2px]">{pt.title}</span>
                              <span className="text-[13.5px] text-ink-2 leading-[1.45]">{pt.text}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
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
