"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ClipPlayer from "@/components/shared/clip-player";
import CursorDemo from "@/components/shared/cursor-demo";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { LEAD_AMBASSADOR, LEAD_AMBASSADOR_HREF } from "@/content/ambassadors";
import { useLang, useT } from "@/lib/lang";

/* One real church, shown instead of described: a clip, the church's name and
   two links — nothing else. No figures here: how many people, accounts or
   groups the church keeps in the system is not ours to publish. The longer
   story lives on the church's own page. */

export default function Proof() {
  const { lang } = useLang();
  const t = useT().proof;
  const [playing, setPlaying] = useState(false);

  const church = LEAD_AMBASSADOR;
  const copy = church.copy[lang];
  const accent = church.accent;
  /* Поки ролик не перезалили на YouTube, блок просто без відео — як і
     сторінки модулів. Чужий плеєр у рамці сюди більше не повертаємо. */
  const promo = church.promo?.videoId ? church.promo : undefined;
  /* "Разом — 1,5 року будуємо процеси" is the last of the hero facts. */
  const since = copy.facts[copy.facts.length - 1];

  return (
    <section id="proof" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <SectionHeading
          title={
            <span className="block uppercase text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">
              {t.title}
            </span>
          }
        />

        {/* Спробу зробити блок розрізаною карткою відхилено: відео на всю
            ширину і рядок під ним читаються краще. */}
        {/* Картка виїжджає знизу — відео має «під'їхати», а не просто
            проявитись. Курсор-привид доходить до кнопки й зупиняється на
            ній: справжній клік лишається за відвідувачем, інакше ролик
            почав би вантажитись сам. */}
        <FadeIn variant="up" className="reveal-rise">
          <CursorDemo playKey={`proof-${playing}`} startDelay={1400} accent={accent} className="w-full">
          <article className="rounded-[24px] border border-hairline bg-surface overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {promo && (
              <ClipPlayer
                videoId={promo.videoId}
                poster={promo.poster}
                title={church.name}
                label={`${t.videoPlay}: ${church.name}`}
                accent={accent}
                badge={t.videoBadge}
                cta={t.videoPlay}
                onPlay={() => setPlaying(true)}
              />
            )}

            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-7 md:py-6">
              <div className="flex items-center gap-3.5 min-w-0">
                {church.logo ? (
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-hairline"
                    style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))` }}
                  >
                    <Image src={church.logo} alt={church.name} width={44} height={36} className="w-8 h-auto" />
                  </span>
                ) : (
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold text-[16px] tracking-[-0.3px] shrink-0"
                    style={{ backgroundColor: accent }}
                  >
                    {church.initials}
                  </span>
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="font-semibold text-ink text-[18px] md:text-[20px] leading-[1.25] tracking-[-0.4px]">
                    {church.name}
                  </h3>
                  <span className="text-[13.5px] text-ink-3 leading-[1.35]">
                    {church.city} · {since.value}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:shrink-0">
                <Link
                  href={LEAD_AMBASSADOR_HREF}
                  className="group flex items-center gap-2 h-11 px-5 rounded-full text-white font-semibold text-[15px] tracking-[-0.3px] transition-opacity hover:opacity-90"
                  style={{ background: accent }}
                >
                  {t.cta}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={church.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[14.5px] font-medium transition-opacity hover:opacity-75"
                  style={{ color: accent }}
                >
                  {t.siteCta}
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </article>
          </CursorDemo>
        </FadeIn>
      </div>
    </section>
  );
}
