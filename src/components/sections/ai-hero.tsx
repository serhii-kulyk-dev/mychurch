"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import EvaChat from "@/components/shared/eva-chat";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";

export default function AiHero() {
  const t = useT();
  const ai = t.ai;
  const { open } = useDemoModal();

  const toScenarios = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("scenarios")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-12 md:pt-20 pb-16 md:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[620px] rounded-full opacity-70"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, #6366f1 22%, transparent), transparent 100%)" }}
        />
        <div
          className="aurora-b absolute top-[120px] -right-[220px] w-[640px] h-[540px] rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 80%, transparent), transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 25%, black 20%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 25%, black 20%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] gap-12 lg:gap-14 items-center">
        <FadeIn className="flex flex-col items-start gap-6 text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface/80 backdrop-blur border border-hairline shadow-[0_1px_2px_rgba(0,0,0,0.04)] pl-2.5 pr-4 py-1.5">
            <Sparkles className="w-[14px] h-[14px] text-brand" strokeWidth={2.2} />
            <span className="text-[13px] font-medium text-ink-2 leading-none">{ai.hero.badge}</span>
          </span>

          <h1 className="font-semibold text-ink leading-[1.06] tracking-[-1.2px] md:tracking-[-2px] text-[38px] sm:text-[48px] md:text-[58px] max-w-[640px]">
            {ai.hero.titleStart} <span className="text-brand">{ai.hero.titleAccent}</span> {ai.hero.titleEnd}
          </h1>

          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[560px]">{ai.hero.text}</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-1">
            <button
              onClick={open}
              className="btn-primary btn-brand btn-sheen group relative flex items-center justify-center h-[52px] w-full sm:w-auto px-8 rounded-full overflow-hidden"
            >
              <span className="relative text-white font-semibold text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                {t.common.bookDemo}
              </span>
            </button>
            <a
              href="#scenarios"
              onClick={toScenarios}
              className="btn-secondary relative flex items-center justify-center gap-2 h-[52px] w-full sm:w-auto px-7 rounded-full overflow-hidden border border-hairline-strong"
            >
              <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
              <span className="relative text-ink-2 font-medium text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                {ai.hero.secondary}
              </span>
              <ArrowRight className="relative w-[17px] h-[17px] text-brand" strokeWidth={2.2} />
            </a>
          </div>

          <ul className="flex flex-col gap-2.5 pt-2">
            {ai.hero.proof.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-soft flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-brand" strokeWidth={3} />
                </span>
                <span className="text-[15px] text-ink-2 leading-[1.4]">{p}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={2} variant="scale" className="w-full">
          <EvaChat />
        </FadeIn>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 w-full h-20 pointer-events-none bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}
