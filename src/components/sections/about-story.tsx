"use client";

import { ArrowRight, Church, Rocket, Users } from "lucide-react";
import { Fragment } from "react";
import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

/* Two beats of one story. The first is the pain (muted), the second is the
   answer (brand), so they read as «спочатку → потім», not as two cards. */
const BEATS = [
  { Icon: Users, accent: "var(--ink-3)", soft: false },
  { Icon: Rocket, accent: "var(--brand)", soft: true },
];

export default function AboutStory() {
  const t = useT().about.story;
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      {/* One column, one direction: heading → the two beats → who is behind it.
          The old sticky-left / scrolling-right split made the eye bounce. */}
      <div className="w-full max-w-[1000px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <FadeIn className="flex flex-col gap-4 max-w-[680px]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[32px] md:text-[48px] leading-[1.08] tracking-[-1.1px] md:tracking-[-1.8px]">
            {t.title}
          </h2>
          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.5]">{t.text}</p>
        </FadeIn>

        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-0">
          {t.cards.map((card, i) => {
            const { Icon, accent, soft } = BEATS[i];
            const last = i === t.cards.length - 1;
            return (
              <Fragment key={card.title}>
                <FadeIn delay={i} className="flex-1 flex flex-col gap-3 md:max-w-[420px]">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-12 h-12 rounded-2xl border border-hairline flex items-center justify-center shrink-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.4)]"
                      style={{
                        color: accent,
                        background: soft ? "var(--brand-soft)" : "var(--surface)",
                        borderColor: soft ? "transparent" : undefined,
                      }}
                    >
                      <Icon className="w-6 h-6" strokeWidth={1.8} />
                    </span>
                    <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-3 tabular-nums">
                      {`0${i + 1}`}
                    </span>
                  </div>
                  <h3 className="font-semibold text-ink text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.5px]">
                    {card.title}
                  </h3>
                  <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.5]">{card.text}</p>
                </FadeIn>

                {!last && (
                  <div
                    aria-hidden
                    /* Stacked on mobile (a 48px box, so it sits under the icon),
                       laid along the row on desktop, level with the icons. */
                    className="flex w-12 md:w-auto flex-col md:flex-row items-center gap-2 md:gap-3 self-start md:self-auto md:px-8 md:pt-4"
                  >
                    <span className="w-px h-5 md:h-px md:w-6 bg-hairline-strong" />
                    <ArrowRight className="w-4 h-4 text-ink-3 rotate-90 md:rotate-0" />
                    <span className="w-px h-5 md:h-px md:w-6 bg-hairline-strong" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Who is behind it — one line, not a third card to read. */}
        <FadeIn
          delay={2}
          className="flex items-start md:items-center gap-4 rounded-[20px] border border-hairline bg-surface px-5 py-4 md:px-6 md:py-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
            <Church className="w-[19px] h-[19px] text-brand" strokeWidth={2} />
          </span>
          <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.5]">
            <strong className="font-semibold text-ink">{t.insider.title}.</strong> {t.insider.text}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
