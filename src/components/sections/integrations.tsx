"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Viber has no PNG in /public — a small inline mark in its brand purple. */
function ViberMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden className="rounded-[10px] shrink-0">
      <rect width="36" height="36" rx="8" fill="#7360f2" />
      <path
        d="M18 8.5c-5.6 0-9.5 3.4-9.5 8.4 0 2.9 1.4 5.2 3.6 6.6v3.9l3.5-1.9c.8.1 1.6.2 2.4.2 5.6 0 9.5-3.4 9.5-8.4S23.6 8.5 18 8.5Z"
        fill="#fff"
      />
      <path
        d="M14.6 13.3c.3-.3.8-.3 1.1 0l1.2 1.4c.3.3.2.8-.1 1.1l-.6.5c.5 1.1 1.3 2 2.4 2.5l.5-.6c.3-.3.8-.4 1.1-.1l1.4 1.1c.3.3.4.8.1 1.1l-.6.7c-.5.5-1.3.7-2 .4-2.5-1-4.3-2.9-5.2-5.3-.3-.7-.1-1.5.4-2l.3-.8Z"
        fill="#7360f2"
      />
    </svg>
  );
}

type Logo = { src: string } | { viber: true };
const LOGOS: Logo[] = [
  { src: "/telegram.png" },
  { viber: true },
  { src: "/twilio.png" },
  { src: "/turbo-sms.png" },
  { src: "/google-sheets.png" },
  { src: "/google-calendar.png" },
];

function LogoImg({ logo, size, alt }: { logo: Logo; size: number; alt: string }) {
  if ("viber" in logo) return <ViberMark size={size} />;
  return <Image src={logo.src} alt={alt} width={size} height={size} sizes={`${size}px`} loading="lazy" className="rounded-[10px] shrink-0" />;
}

/* Satellite positions on the hub (percent of the box); MyChurch sits at 50/50.
   Six points on a ring, starting at the top and going clockwise. */
const R = 40;
const SATS = LOGOS.map((_, i) => {
  const a = (-90 + i * (360 / LOGOS.length)) * (Math.PI / 180);
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
});

const STEP_MS = 2400;

export default function Integrations() {
  const all = useT();
  const t = all.integrations;
  const { open } = useDemoModal();
  const [hover, setHover] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);

  /* When nothing is hovered the hub lights one connection at a time. */
  useEffect(() => {
    if (prefersReducedMotion() || hover !== null) return;
    const id = setInterval(() => setAuto((a) => (a + 1) % LOGOS.length), STEP_MS);
    return () => clearInterval(id);
  }, [hover]);

  const active = hover ?? auto;

  return (
    <section id="integrations" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] gap-12 lg:gap-16 items-center">
        {/* ── Copy + list ─────────────────────────────── */}
        <div className="flex flex-col gap-8">
          <SectionHeading align="left" eyebrow={t.eyebrow} title={t.title} text={t.text} />

          <FadeIn delay={1}>
            <ul className="flex flex-col divide-y divide-hairline border-y border-hairline" onMouseLeave={() => setHover(null)}>
              {t.cards.map((card, i) => (
                <li
                  key={card.title}
                  onMouseEnter={() => setHover(i)}
                  className={cn(
                    "flex items-center gap-3.5 py-2.5 -mx-3 px-3 rounded-xl transition-colors duration-200",
                    active === i && "bg-brand-soft/60"
                  )}
                >
                  <LogoImg logo={LOGOS[i]} size={36} alt="" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-ink text-[15.5px] leading-[1.3] tracking-[-0.2px]">{card.title}</span>
                    <span className="text-[13.5px] text-ink-2 leading-[1.4]">{card.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={2} className="flex items-center gap-3">
            <span className="text-[15px] font-semibold text-ink">{t.customTitle}</span>
            <button
              onClick={open}
              className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-brand whitespace-nowrap"
            >
              {t.customCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
            </button>
          </FadeIn>
        </div>

        {/* ── Hub ─────────────────────────────────────── */}
        <FadeIn variant="scale" delay={1} className="flex flex-col items-center gap-5">
          <div className="relative w-full max-w-[400px] aspect-square select-none">
            {/* Ambient glow */}
            <div
              aria-hidden
              className="absolute inset-[18%] rounded-full -z-10 blur-3xl opacity-70"
              style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
            />

            {/* Ring + spokes */}
            <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
              <circle cx="50" cy="50" r={R} fill="none" stroke="var(--hairline-strong)" strokeWidth="1" strokeDasharray="1.2 2.4" vectorEffect="non-scaling-stroke" />
              {SATS.map((s, i) => {
                const on = active === i;
                return (
                  <g key={i}>
                    <line
                      x1="50" y1="50" x2={s.x} y2={s.y}
                      stroke={on ? "var(--brand)" : "var(--hairline-strong)"}
                      strokeWidth={on ? 2 : 1}
                      vectorEffect="non-scaling-stroke"
                      style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                    />
                    {on && (
                      <circle r="1.6" fill="var(--brand)" className="hub-dot">
                        <animateMotion dur="1.2s" repeatCount="indefinite" path={`M ${s.x} ${s.y} L 50 50`} />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Centre */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <div className="w-[84px] h-[84px] rounded-[24px] bg-surface border border-hairline shadow-[0_18px_40px_-20px_rgba(0,50,120,0.45)] flex items-center justify-center">
                {/* Поки без знака — центр тримає словесна частина бренду. */}
                <span className="font-brand font-extrabold tracking-[-0.04em] text-[15px] leading-[1.1] text-ink text-center">
                  {all.common.brand.split(" ").map((word, wi) => (
                    <span key={word} className={`block ${wi === 0 ? "text-brand" : ""}`}>
                      {word}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* Satellites */}
            {SATS.map((s, i) => {
              const on = active === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <div
                    className={cn(
                      "w-[60px] h-[60px] rounded-[18px] bg-surface border flex items-center justify-center transition-all duration-300",
                      on
                        ? "border-brand shadow-[0_14px_30px_-14px_rgba(0,122,255,0.55)] scale-[1.06]"
                        : "border-hairline shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    )}
                  >
                    <LogoImg logo={LOGOS[i]} size={32} alt={t.cards[i].title} />
                  </div>
                  <span className={cn("text-[11.5px] font-medium leading-none whitespace-nowrap transition-colors", on ? "text-ink" : "text-ink-3")}>
                    {t.cards[i].title}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[12.5px] font-medium uppercase tracking-[0.14em] text-ink-3">{t.hubCaption}</p>
        </FadeIn>
      </div>
    </section>
  );
}
