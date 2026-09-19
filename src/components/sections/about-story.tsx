"use client";

import { Church, Rocket, Users } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

/* Two beats of one story, so they read as a sequence on a rail — not as two
   interchangeable cards side by side. The first beat is the pain (muted),
   the second is the answer (brand). */
const BEATS = [
  { Icon: Users, accent: "var(--ink-3)", soft: false },
  { Icon: Rocket, accent: "var(--brand)", soft: true },
];

export default function AboutStory() {
  const t = useT().about.story;
  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-16 items-start">
        <FadeIn className="flex flex-col gap-4 md:sticky md:top-28">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[30px] md:text-[44px] leading-[1.12] tracking-[-1px] md:tracking-[-1.6px]">
            {t.title}
          </h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55]">{t.text}</p>

          <div className="mt-2 rounded-[20px] border border-hairline bg-surface p-5 md:p-6 flex flex-col gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
              <Church className="w-[19px] h-[19px] text-brand" strokeWidth={2} />
            </span>
            <h3 className="font-semibold text-ink text-[17px] md:text-[18px] leading-[1.3] tracking-[-0.3px]">{t.insider.title}</h3>
            <p className="text-[15px] text-ink-2 leading-[1.55]">{t.insider.text}</p>
          </div>
        </FadeIn>

        <div className="flex flex-col">
          {t.cards.map((card, i) => {
            const { Icon, accent, soft } = BEATS[i];
            const last = i === t.cards.length - 1;
            return (
              <FadeIn key={card.title} delay={i} className="flex items-stretch gap-5 md:gap-7">
                <div className="flex flex-col items-center shrink-0">
                  <span
                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-hairline flex items-center justify-center shadow-[0_14px_30px_-20px_rgba(0,0,0,0.4)]"
                    style={{
                      color: accent,
                      background: soft ? "var(--brand-soft)" : "var(--surface)",
                      borderColor: soft ? "transparent" : undefined,
                    }}
                  >
                    <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.8} />
                  </span>
                  {!last && (
                    <span
                      aria-hidden
                      className="w-px flex-1 my-3"
                      style={{ background: "linear-gradient(to bottom, var(--hairline-strong), var(--brand))" }}
                    />
                  )}
                </div>

                <div className={`flex flex-col gap-2 ${last ? "" : "pb-10 md:pb-12"}`}>
                  <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-3 tabular-nums">
                    {`0${i + 1}`}
                  </span>
                  <h3 className="font-semibold text-ink text-[21px] md:text-[26px] leading-[1.25] tracking-[-0.5px]">{card.title}</h3>
                  <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.55] max-w-[520px]">{card.text}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
