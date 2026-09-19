"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, LayoutGrid, Send } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { findGoal } from "@/content/builder";
import { useDemoModal } from "@/context/demo-modal-context";
import { track } from "@/lib/analytics/client";
import { useT } from "@/lib/lang";
import { SITE_TELEGRAM } from "@/lib/seo";
import { cn } from "@/lib/utils";

/* Шість найчастіших болів із конструктора на /modules. Свідомо підмножина:
   тут не треба зібрати простір — треба з чогось почати розмову на демо.
   Стан живе в пам'яті: жодних параметрів в адресі, щоб не плодити дублі
   тієї самої сторінки в пошуку. */
const PICKS = ["newcomers", "attendance", "requests", "comms", "ministries", "routine"];

/* This panel is intentionally dark in both themes — it is the one high-contrast
   moment on the page, so the white/blue values here are deliberate. */
export default function Cta() {
  const { openWith } = useDemoModal();
  const t = useT();
  const [picked, setPicked] = useState<string[]>([]);
  const labels = t.builder.goals as Record<string, { label: string; note: string }>;

  const toggle = (id: string) => {
    /* Подія — поруч із дією, а не всередині setState: оновлювач стану
       React викликає двічі в режимі розробки, і крок дублювався. */
    const on = !picked.includes(id);
    const next = on ? [...picked, id] : picked.filter((x) => x !== id);
    track(on ? "cta_goal_on" : "cta_goal_off", { id, picked: next.length });
    setPicked(next);
  };

  return (
    <section className="w-full flex flex-col items-center px-5 md:px-8 py-16 md:py-24 bg-page">
      <FadeIn variant="scale" className="w-full max-w-[1120px]">
        <div className="no-theme-transition relative overflow-hidden rounded-[28px] md:rounded-[40px] px-6 py-10 sm:px-8 sm:py-12 md:px-14 md:py-14">
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

          {/* Pitch — left-weighted, action on the right on wide screens */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
            <div className="flex flex-col gap-5 items-start lg:max-w-[620px]">
              <span className="inline-flex items-center gap-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur pl-2.5 pr-4 py-2 md:py-1.5">
                <span className="relative flex w-2 h-2 shrink-0">
                  <span className="pulse-ring absolute inset-0 rounded-full bg-[#8cc2ff]" />
                  <span className="relative w-2 h-2 rounded-full bg-[#8cc2ff]" />
                </span>
                <span className="text-[13px] font-medium text-white/85 leading-[1.35] md:leading-none text-left">{t.cta.badge}</span>
              </span>

              <h2 className="font-semibold text-white text-[30px] md:text-[44px] leading-[1.08] tracking-[-1px] md:tracking-[-1.8px]">
                {t.cta.title}
              </h2>
              <p className="text-[16.5px] md:text-[18px] font-normal text-white/70 leading-[1.55] max-w-[540px]">
                {t.cta.text}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto shrink-0">
              <button
                onClick={() => openWith(picked)}
                data-track="cta"
                data-place="фінальний блок"
                className="btn-primary group relative flex items-center justify-center gap-2 h-[52px] w-full sm:w-auto px-8 rounded-full overflow-hidden shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)]"
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
                className="relative flex items-center justify-center gap-2 h-[52px] w-full sm:w-auto px-8 rounded-full border border-white/25 bg-white/5 backdrop-blur transition-colors duration-200 hover:bg-white/12"
              >
                <Send className="w-[16px] h-[16px] text-white/80" />
                <span className="text-white font-medium text-[16px] tracking-[-0.32px] leading-[1.4] whitespace-nowrap">
                  {t.common.telegram}
                </span>
              </Link>
            </div>
          </div>

          {/* Що болить — один крок перед формою, а не ще одна форма */}
          <div className="mt-10 md:mt-14 pt-8 md:pt-10 border-t border-white/12">
            <span id="cta-picks-label" className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/45">
              {t.cta.pickLabel}
            </span>
            <div role="group" aria-labelledby="cta-picks-label" className="mt-5 flex flex-wrap gap-2">
              {PICKS.map((id) => {
                const Icon = findGoal(id)?.Icon ?? LayoutGrid;
                const active = picked.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(id)}
                    className={cn(
                      "inline-flex items-center gap-2 h-10 pl-3.5 pr-4 rounded-full border text-[14px] font-medium leading-none transition-colors duration-150",
                      active
                        ? "border-white bg-white text-[#06356e]"
                        : "border-white/25 bg-white/5 text-white/80 hover:bg-white/12 hover:text-white"
                    )}
                  >
                    {active ? (
                      <Check className="w-4 h-4 shrink-0" strokeWidth={3} />
                    ) : (
                      <Icon className="w-4 h-4 shrink-0 text-[#8cc2ff]" strokeWidth={2.1} />
                    )}
                    {labels[id]?.label ?? id}
                  </button>
                );
              })}
            </div>
            <p
              aria-live="polite"
              className={cn(
                "mt-4 text-[13.5px] text-white/55 leading-[1.5] transition-opacity duration-200",
                picked.length ? "opacity-100" : "opacity-0"
              )}
            >
              {t.cta.pickNote}
            </p>
          </div>

        </div>
      </FadeIn>
    </section>
  );
}
