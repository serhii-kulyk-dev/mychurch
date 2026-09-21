"use client";

import { type ReactNode } from "react";
import AnimatedHeadline, { countWords, softIn, useHeadlineStage } from "@/components/shared/animated-headline";
import { useT } from "@/lib/lang";

/* The first screen of /modules: the promise ("module by module") and the thing
   it all hangs on (one person's profile) share one screen — the heading frames
   the map, the map proves it. `children` is the map, rendered inside the same
   background so they read as a single block.

   The headline lands word by word; the roles that used to cycle here now
   live on «Для кого» — here the tail just wears the brand gradient. */
export default function ModulesHero({ children }: { children?: ReactNode }) {
  const t = useT().modules;
  const [leadStart, leadEnd] = t.text.split("{core}");
  const stage = useHeadlineStage(countWords(t.titleLines, t.titleAccent));

  return (
    <section className="relative w-full overflow-hidden bg-page flex flex-col items-center pt-14 md:pt-24 pb-10 md:pb-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--glow), transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 18%, black 18%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 18%, black 18%, transparent 72%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col items-center gap-4 text-center">
        <span
          className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand"
          style={softIn(stage >= 1, 8)}
        >
          {t.eyebrow}
        </span>

        <AnimatedHeadline
          lines={t.titleLines}
          accent={t.titleAccent}
          stage={stage}
          className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-1.8px] text-[34px] sm:text-[44px] md:text-[54px] max-w-[780px]"
        />

        <p
          className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55] max-w-[600px]"
          style={softIn(stage >= 2)}
        >
          {leadStart}
          <span className="font-semibold text-ink decoration-brand decoration-2 underline-offset-[5px] underline">{t.core}</span>
          {leadEnd}
        </p>

      </div>

      {children && <div className="relative z-10 w-full mt-9 md:mt-14">{children}</div>}
    </section>
  );
}
