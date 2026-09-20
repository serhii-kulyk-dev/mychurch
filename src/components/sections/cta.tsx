"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";
import { SITE_TELEGRAM } from "@/lib/seo";

/* This panel is intentionally dark in both themes — it is the one high-contrast
   moment on the page, so the white/blue values here are deliberate.
   `rollout` folds the consulting steps into the same block: the home page closes
   with one panel instead of a consulting card followed by the same promise. */
export default function Cta({ rollout = false }: { rollout?: boolean }) {
  const { open } = useDemoModal();
  const t = useT();
  const c = t.consulting;

  return (
    <section
      id={rollout ? "consulting" : undefined}
      className="w-full flex flex-col items-center px-5 md:px-8 py-12 sm:py-16 md:py-24 bg-page scroll-mt-24"
    >
      <FadeIn variant="scale" className="w-full max-w-[1120px]">
        <div className="no-theme-transition relative overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[40px] px-5 py-8 sm:px-8 sm:py-12 md:px-14 md:py-14">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{ background: "linear-gradient(115deg, #0a1f3d 0%, #06356e 52%, #0b4f9e 100%)" }}
          />
          <div
            aria-hidden
            className="aurora-a absolute -top-[260px] -left-[120px] w-[720px] h-[520px] rounded-full -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(0,122,255,0.55), transparent 100%)" }}
          />
          <div
            aria-hidden
            className="aurora-b absolute -bottom-[220px] -right-[140px] w-[620px] h-[460px] rounded-full -z-10"
            style={{ background: "radial-gradient(closest-side, rgba(140,194,255,0.30), transparent 100%)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.45) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage: "radial-gradient(ellipse 70% 70% at 22% 25%, black 8%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 22% 25%, black 8%, transparent 78%)",
            }}
          />

          {/* Pitch — left-weighted; with `rollout` the right side carries the steps,
              otherwise it carries the buttons. */}
          <div
            className={
              rollout
                ? "grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,390px)] gap-6 sm:gap-9 lg:gap-14 lg:items-center"
                : "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8 lg:gap-12"
            }
          >
            <div className={["flex flex-col gap-4 sm:gap-5 items-start", rollout ? "" : "lg:max-w-[620px]"].join(" ")}>
              <span className="inline-flex items-center gap-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur pl-2.5 pr-4 py-2 md:py-1.5">
                <span className="relative flex w-2 h-2 shrink-0">
                  <span className="pulse-ring absolute inset-0 rounded-full bg-[#8cc2ff]" />
                  <span className="relative w-2 h-2 rounded-full bg-[#8cc2ff]" />
                </span>
                <span className="text-[13px] font-medium text-white/85 leading-[1.35] md:leading-none text-left">{t.cta.badge}</span>
              </span>

              <h2 className="font-semibold text-white text-[27px] sm:text-[30px] md:text-[44px] leading-[1.08] tracking-[-0.8px] sm:tracking-[-1px] md:tracking-[-1.8px]">
                {t.cta.title}
              </h2>
              <p className="text-[15.5px] sm:text-[16.5px] md:text-[18px] font-normal text-white/70 leading-[1.5] sm:leading-[1.55] max-w-[540px]">
                {t.cta.text}
              </p>

              {rollout && (
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto mt-0.5 sm:mt-1">
                  <Actions open={open} t={t} />
                </div>
              )}
            </div>

            {rollout ? (
              /* How the rollout goes — the consulting promise, in the same breath.
                 Header / numbered rail / footer link: three bands in one card, so the
                 steps read as a path with a start and an end, not as four icon chips. */
              <div className="rounded-[20px] md:rounded-[24px] border border-white/15 bg-white/[0.05] backdrop-blur overflow-hidden">
                <div className="px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5 md:px-7 md:pt-7 border-b border-white/10">
                  <span className="text-[11.5px] font-semibold uppercase tracking-[1.4px] text-white/40">{c.eyebrow}</span>
                  <h3 className="mt-1.5 sm:mt-2 font-semibold text-white text-[18px] sm:text-[20px] md:text-[21px] leading-[1.22] tracking-[-0.5px]">{c.title}</h3>
                  <span className="inline-flex items-center gap-2 mt-2.5 sm:mt-3">
                    <span className="relative flex w-[7px] h-[7px] shrink-0">
                      <span className="pulse-ring absolute inset-0 rounded-full bg-[#8cc2ff]" />
                      <span className="relative w-[7px] h-[7px] rounded-full bg-[#8cc2ff]" />
                    </span>
                    <span className="text-[13px] font-medium text-[#8cc2ff] leading-[1.35]">{c.free}</span>
                  </span>
                </div>

                <ol className="flex flex-col px-4 py-5 sm:px-6 sm:py-6 md:px-7">
                  {c.steps.map((step, i) => {
                    const last = i === c.steps.length - 1;
                    return (
                      <li key={step.title}>
                        <FadeIn delay={2 + i} variant="left" className="relative pl-[32px] sm:pl-[42px]">
                          {!last && (
                            <span
                              aria-hidden
                              className="absolute left-[10px] sm:left-[13px] top-[24px] sm:top-[28px] bottom-0 w-px bg-white/20"
                            />
                          )}
                          <span
                            aria-hidden
                            className="absolute left-0 top-0 w-[21px] h-[21px] sm:w-[27px] sm:h-[27px] rounded-full border border-white/20 bg-white/[0.07] flex items-center justify-center text-[11px] sm:text-[11.5px] font-semibold tabular-nums text-[#8cc2ff]"
                          >
                            {i + 1}
                          </span>
                          <div className={["flex flex-col gap-0.5 sm:gap-1 pt-px sm:pt-[3px]", last ? "" : "pb-3.5 sm:pb-6"].join(" ")}>
                            <h4 className="font-semibold text-white text-[15px] sm:text-[15.5px] leading-[1.3] tracking-[-0.2px]">{step.title}</h4>
                            <p className="text-[13.5px] sm:text-[14px] text-white/60 leading-[1.4] sm:leading-[1.45]">{step.text}</p>
                          </div>
                        </FadeIn>
                      </li>
                    );
                  })}
                </ol>

                <Link
                  href="/consulting"
                  className="group flex items-center justify-between gap-3 px-4 sm:px-6 md:px-7 py-3.5 sm:py-4 border-t border-white/10 text-white/65 font-medium text-[14.5px] tracking-[-0.2px] transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
                >
                  {c.more}
                  <ArrowRight className="w-[15px] h-[15px] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto shrink-0">
                <Actions open={open} t={t} />
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function Actions({ open, t }: { open: () => void; t: ReturnType<typeof useT> }) {
  return (
    <>
      <button
        onClick={open}
        data-track="cta"
        data-place="фінальний блок"
        className="btn-primary group relative flex items-center justify-center gap-2 h-[48px] sm:h-[52px] w-full sm:w-auto px-8 rounded-full overflow-hidden shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)]"
      >
        <span className="absolute inset-0 bg-white rounded-full" />
        <span className="relative text-[#06356e] font-semibold text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
          {t.common.bookDemo}
        </span>
        <ArrowRight className="relative w-[17px] h-[17px] text-[#06356e] transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>

      <Link
        href={SITE_TELEGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center gap-2 h-[48px] sm:h-[52px] w-full sm:w-auto px-8 rounded-full border border-white/25 bg-white/5 backdrop-blur transition-colors duration-200 hover:bg-white/12"
      >
        <Send className="w-[16px] h-[16px] text-white/80" />
        <span className="text-white font-medium text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
          {t.common.telegram}
        </span>
      </Link>
    </>
  );
}
