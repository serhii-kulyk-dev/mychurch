"use client";

import { ArrowRight, Sparkles, MessageSquareHeart } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";

const PERK_ICONS = [Sparkles, MessageSquareHeart];

export default function AmbassadorsBecome() {
  const t = useT().ambassadorsPage;
  const { open } = useDemoModal();

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.becomeEyebrow} title={t.becomeTitle} text={t.becomeText} />

        <div className="w-full max-w-[720px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {t.perks.map((perk, i) => {
            const Icon = PERK_ICONS[i] ?? Sparkles;
            return (
              <FadeIn key={perk.title} delay={i} variant="scale" className="h-full">
                <article className="hover-lift h-full rounded-[20px] bg-page border border-hairline p-6 flex flex-col gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-brand/10 text-brand">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.2px]">{perk.title}</h3>
                    <p className="text-[14.5px] text-ink-2 leading-[1.5]">{perk.text}</p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={2} className="flex justify-center">
          <button
            onClick={open}
            className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 px-7 rounded-full overflow-hidden"
          >
            <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.3px] whitespace-nowrap">{t.becomeCta}</span>
            <ArrowRight className="relative w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
