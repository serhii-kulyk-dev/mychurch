"use client";

import AnimatedHeadline, { countWords, softIn, useHeadlineStage } from "@/components/shared/animated-headline";
import { ROLE_ROTATE_ACCENTS } from "@/components/shared/role-icons";
import { useT } from "@/lib/lang";

/* Перший екран /for-whom: заголовок набирається по словах і далі сам називає,
   для кого система — роль за роллю, кожна своїм кольором із палітри ролей. */
export function AudienceHero() {
  const t = useT().audience;
  const stage = useHeadlineStage(countWords(t.page.titleLines, undefined, t.titleRotate));

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-10 md:pt-16 pb-8 md:pb-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-a absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-70" style={{ background: "radial-gradient(closest-side, var(--glow), transparent 100%)" }} />
      </div>
      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col items-center gap-3.5 text-center">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand" style={softIn(stage >= 1, 8)}>{t.page.eyebrow}</span>
        <AnimatedHeadline
          lines={t.page.titleLines}
          rotate={t.titleRotate}
          rotateShort={t.titleRotateShort}
          colors={ROLE_ROTATE_ACCENTS}
          stage={stage}
          className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-2px] text-[38px] sm:text-[48px] md:text-[60px] max-w-[820px]"
        />
        <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[640px]" style={softIn(stage >= 2)}>{t.page.text}</p>
      </div>
      <div aria-hidden className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}
