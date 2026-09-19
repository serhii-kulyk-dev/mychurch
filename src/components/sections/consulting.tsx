"use client";

import Link from "next/link";
import { Check, Compass, Lightbulb, Rocket, LifeBuoy, ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";

const STEP_ICONS = [Compass, Lightbulb, Rocket, LifeBuoy];

export default function Consulting() {
  const t = useT().consulting;
  const { open } = useDemoModal();

  return (
    <section id="consulting" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          <div className="overflow-hidden rounded-[24px] md:rounded-[32px] border border-hairline bg-surface grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {/* Copy */}
            <div className="flex flex-col gap-6 p-7 md:p-12">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft pl-2.5 pr-3 py-1">
                    <span className="relative flex w-[7px] h-[7px]">
                      <span className="pulse-ring absolute inset-0 rounded-full bg-brand" />
                      <span className="relative w-[7px] h-[7px] rounded-full bg-brand" />
                    </span>
                    <span className="text-[12.5px] font-medium text-brand leading-none">{t.free}</span>
                  </span>
                </div>
                <h2 className="font-semibold text-ink text-[28px] md:text-[38px] leading-[1.12] tracking-[-0.9px] md:tracking-[-1.3px]">{t.title}</h2>
                <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55]">{t.text}</p>
              </div>

              <ul className="flex flex-col gap-3">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center shrink-0">
                      <Check className="w-[13px] h-[13px] text-brand" strokeWidth={3} />
                    </span>
                    <span className="text-[15.5px] text-ink leading-[1.45]">{p}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={open}
                  className="btn-primary btn-brand group relative inline-flex items-center justify-center gap-2 h-[50px] px-7 rounded-full overflow-hidden"
                >
                  <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.3px] leading-[1.4] whitespace-nowrap">{t.cta}</span>
                  <ArrowRight className="relative w-[16px] h-[16px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
                <Link
                  href="/consulting"
                  className="group inline-flex items-center justify-center gap-2 h-[50px] px-6 rounded-full border border-hairline-strong bg-surface text-ink font-medium text-[15.5px] tracking-[-0.3px] hover:bg-surface-2 transition-colors"
                >
                  {t.more}
                  <ArrowRight className="w-[15px] h-[15px] text-ink-2 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Process */}
            <div
              className="relative flex flex-col justify-center gap-3 p-7 md:p-10 border-t lg:border-t-0 lg:border-l border-hairline"
              style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--brand) 9%, var(--surface)) 0%, var(--surface-2) 100%)" }}
            >
              <div
                aria-hidden
                className="aurora-a absolute -top-32 -right-24 w-[360px] h-[320px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
              />
              {t.steps.map((step, i) => {
                const Icon = STEP_ICONS[i];
                const last = i === t.steps.length - 1;
                return (
                  <FadeIn key={step.title} delay={2 + i} variant="left" className="relative">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="w-11 h-11 rounded-xl bg-surface border border-hairline shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)] flex items-center justify-center text-brand shrink-0">
                          <Icon className="w-[20px] h-[20px]" strokeWidth={2} />
                        </span>
                        {!last && <span className="w-[2px] flex-1 min-h-[16px] my-1 rounded-full bg-hairline-strong" />}
                      </div>
                      <div className={["flex flex-col gap-1 pt-1", last ? "" : "pb-4"].join(" ")}>
                        <div className="flex items-center gap-2">
                          <span className="text-[11.5px] font-semibold text-ink-3 tabular-nums">0{i + 1}</span>
                          <h3 className="font-semibold text-ink text-[16.5px] leading-[1.3] tracking-[-0.2px]">{step.title}</h3>
                        </div>
                        <p className="text-[14.5px] text-ink-2 leading-[1.5]">{step.text}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
