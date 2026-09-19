"use client";

import { HeartHandshake, ShieldCheck, Zap } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";

/* The slogan already lives in the hero, so this block is not a second
   statement of it — it is what the slogan obliges us to do, principle by
   principle. The first one carries the whole mission, so it gets the panel;
   the other two sit beside it. */
const SIDE_ICONS = [Zap, ShieldCheck];

export default function AboutMission() {
  const t = useT().about.mission;
  const [lead, ...side] = t.points;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-4 md:gap-5 items-stretch">
          <FadeIn variant="scale" className="h-full">
            <article
              className="relative h-full overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline flex flex-col justify-end gap-4 p-7 md:p-10 min-h-[320px] md:min-h-[380px]"
              style={{ background: "linear-gradient(160deg, #0a1f3d 0%, #06356e 45%, #0b4f9e 100%)" }}
            >
              <div
                aria-hidden
                className="aurora-a absolute -top-24 -right-16 w-[380px] h-[320px] rounded-full"
                style={{ background: "radial-gradient(closest-side, rgba(0,122,255,0.6), transparent)" }}
              />
              <span className="float-y relative w-20 h-20 md:w-24 md:h-24 rounded-[26px] bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] mb-2">
                <HeartHandshake className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.6} />
              </span>
              <h3 className="relative font-semibold text-white text-[24px] md:text-[30px] leading-[1.18] tracking-[-0.8px] max-w-[440px]">
                {lead}
              </h3>
              <p className="relative text-[15.5px] md:text-[16.5px] text-white/70 leading-[1.55] max-w-[460px]">{t.details[0]}</p>
            </article>
          </FadeIn>

          <div className="flex flex-col gap-4 md:gap-5">
            {side.map((point, i) => {
              const Icon = SIDE_ICONS[i];
              return (
                <FadeIn key={point} variant="scale" delay={i + 1} className="flex-1">
                  <article className="h-full rounded-[24px] border border-hairline bg-surface p-6 md:p-7 flex flex-col gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <span className="w-11 h-11 rounded-2xl bg-brand-soft flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand" strokeWidth={2} />
                    </span>
                    <h3 className="font-semibold text-ink text-[18px] md:text-[20px] leading-[1.28] tracking-[-0.3px]">{point}</h3>
                    <p className="text-[15.5px] text-ink-2 leading-[1.55]">{t.details[i + 1]}</p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
