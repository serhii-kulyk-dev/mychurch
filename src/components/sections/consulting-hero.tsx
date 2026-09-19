"use client";

import { Fragment } from "react";
import { ArrowRight, Send } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";
import { SITE_TELEGRAM } from "@/lib/seo";

export default function ConsultingHero() {
  const t = useT();
  const c = t.consultingPage;
  const { open } = useDemoModal();

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-14 md:pt-24 pb-14 md:pb-20">
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
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col items-center gap-8 md:gap-10 text-center">
        <FadeIn className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-brand/25 bg-brand-soft pl-2.5 pr-4 py-1.5">
            <span className="relative flex w-2 h-2">
              <span className="pulse-ring absolute inset-0 rounded-full bg-brand" />
              <span className="relative w-2 h-2 rounded-full bg-brand" />
            </span>
            <span className="text-[13px] font-medium text-brand leading-none">{c.badge}</span>
          </span>
          <h1 className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-2px] text-[36px] sm:text-[46px] md:text-[56px] max-w-[880px]">
            {c.title}
          </h1>
          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[660px]">{c.text}</p>
        </FadeIn>

        <FadeIn delay={1} className="flex flex-col items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full sm:w-auto">
            <button
              onClick={open}
              className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-[52px] w-full sm:w-auto px-8 rounded-full overflow-hidden"
            >
              <span className="relative text-white font-semibold text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                {t.consulting.cta}
              </span>
              <ArrowRight className="relative w-[17px] h-[17px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <a
              href={SITE_TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-[52px] w-full sm:w-auto px-7 rounded-full border border-hairline-strong bg-surface text-ink hover:bg-surface-2 transition-colors"
            >
              <Send className="w-[16px] h-[16px] text-ink-2" />
              <span className="font-medium text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                {t.common.telegram}
              </span>
            </a>
          </div>
          <p className="text-[13.5px] text-ink-3 leading-[1.4]">{c.ctaNote}</p>
        </FadeIn>

        <FadeIn delay={2} className="flex flex-wrap items-center justify-center gap-x-7 sm:gap-x-9 gap-y-4 pt-1">
          {c.facts.map((f, i) => (
            <Fragment key={f.label}>
              {i > 0 && <span aria-hidden className="hidden sm:block w-px h-9 bg-hairline-strong" />}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[22px] md:text-[26px] font-semibold text-ink leading-none tracking-[-0.7px] tabular-nums">
                  {f.value}
                </span>
                <span className="text-[12.5px] text-ink-3 leading-none">{f.label}</span>
              </div>
            </Fragment>
          ))}
        </FadeIn>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}
