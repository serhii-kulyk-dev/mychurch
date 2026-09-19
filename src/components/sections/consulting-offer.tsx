"use client";

import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";

export default function ConsultingOffer() {
  const c = useT().consultingPage;
  const { open } = useDemoModal();

  return (
    <section id="offer" className="w-full flex flex-col items-center py-16 md:py-24 bg-page scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8">
        <FadeIn variant="scale">
          <div
            className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-hairline grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]"
            style={{ background: "linear-gradient(150deg, color-mix(in oklab, var(--brand) 10%, var(--surface)) 0%, var(--surface) 62%)" }}
          >
            <div
              aria-hidden
              className="aurora-a absolute -top-32 -left-24 w-[420px] h-[360px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
            />

            {/* Copy */}
            <div className="relative flex flex-col gap-5 p-7 md:p-12">
              <span className="self-start inline-flex items-center rounded-full border border-brand/25 bg-brand-soft px-3.5 py-1.5 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-brand">
                {c.offerBadge}
              </span>
              <h2 className="font-semibold text-ink text-[28px] md:text-[38px] leading-[1.12] tracking-[-0.9px] md:tracking-[-1.3px]">
                {c.offerTitle}
              </h2>
              <p className="text-[16px] md:text-[17.5px] text-ink-2 leading-[1.55]">{c.offerText}</p>
              <p className="text-[13.5px] text-ink-3 leading-[1.5]">{c.offerNote}</p>
            </div>

            {/* Price list */}
            <div className="relative flex flex-col justify-center gap-5 p-7 md:p-12 border-t lg:border-t-0 lg:border-l border-hairline bg-surface/60 backdrop-blur-sm">
              <ul className="flex flex-col">
                {c.offerRows.map((row, i) => (
                  <li
                    key={row.label}
                    className={[
                      "flex items-baseline justify-between gap-4 py-3.5",
                      i === c.offerRows.length - 1 ? "" : "border-b border-hairline",
                    ].join(" ")}
                  >
                    <span className="text-[15px] md:text-[15.5px] text-ink leading-[1.4]">{row.label}</span>
                    <span className="text-[16px] font-semibold text-brand leading-none tabular-nums shrink-0">
                      {row.price}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={open}
                className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-[50px] w-full rounded-full overflow-hidden"
              >
                <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.3px] leading-[1.4] whitespace-nowrap">
                  {c.offerCta}
                </span>
                <ArrowRight className="relative w-[16px] h-[16px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
