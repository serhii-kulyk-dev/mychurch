"use client";

import { useEffect, useRef, useState } from "react";
import { Check, HeartHandshake, Radar, Send } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import IllustratedAvatar, { AVATAR_LOOKS } from "@/components/shared/illustrated-avatar";
import { useT } from "@/lib/lang";

/* The hero shows the mission instead of describing it: a room full of people,
   one of them quietly slips away, the system flags it, the leader reaches out,
   the person comes back. Three people take that turn, one per cycle. */

/* Two staggered rows read as a room; a single wrapping row leaves orphans. */
const ROWS = [
  [0, 3, 1, 6, 2, 7], // index into AVATAR_LOOKS, repeats kept apart
  [4, 5, 0, 6, 3],
];
const FLAT = ROWS.flat();
const TARGETS = [8, 3, 6]; // who slips away, per cycle — flat index
const FLOATS = new Set([1, 5, 9]);

/* calm → slipping → flagged → reached → back */
const STEP_MS = [1500, 1500, 2300, 1500, 2400];
const FLAGGED = 2;

export default function AboutHero() {
  const t = useT().about;
  const attention = useT().preview;

  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const reduced = prefersReducedMotion();
    const id = window.setTimeout(
      () => {
        if (reduced) {
          /* No motion: settle on the frame that carries the whole story. */
          setStep(FLAGGED);
        } else if (step < STEP_MS.length - 1) {
          setStep(step + 1);
        } else {
          setStep(0);
          setCycle((c) => (c + 1) % TARGETS.length);
        }
      },
      reduced ? 0 : STEP_MS[step],
    );
    return () => window.clearTimeout(id);
  }, [inView, step, cycle]);

  const target = TARGETS[cycle];
  const person = attention.attentionRows[cycle];
  const targetLook = AVATAR_LOOKS[FLAT[target] % AVATAR_LOOKS.length];
  const away = step >= 1 && step <= 3;
  const backHome = step === 4;

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-14 md:pt-24 pb-12 md:pb-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--glow), transparent 100%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col items-center gap-10 md:gap-14">
        <FadeIn className="flex flex-col items-center gap-4 text-center">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.hero.eyebrow}</span>
          <h1 className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-2px] text-[36px] sm:text-[46px] md:text-[58px] max-w-[860px]">
            {t.hero.title}
          </h1>
          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[620px]">{t.hero.text}</p>
        </FadeIn>

        <FadeIn delay={2} variant="scale" className="w-full max-w-[900px]">
          <div
            ref={hostRef}
            className="relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-hairline bg-surface-2 flex flex-col items-center justify-center gap-6 md:gap-8 px-4 py-8 sm:px-6 md:px-10 md:py-10 shadow-[0_30px_60px_-40px_rgba(0,50,120,0.35)]"
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 70% at 50% 45%, color-mix(in oklab, var(--brand) 12%, transparent), transparent 70%)",
              }}
            />

            {/* The mission, kept as the quiet anchor above the scene */}
            <div className="relative z-10 flex items-center gap-3 rounded-2xl bg-surface/90 backdrop-blur border border-hairline px-4 py-2.5 md:px-5 md:py-3 shadow-[0_10px_26px_-16px_rgba(0,0,0,0.3)]">
              <span className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-brand flex items-center justify-center shrink-0">
                <HeartHandshake className="w-[17px] h-[17px] md:w-[19px] md:h-[19px] text-white" strokeWidth={2} />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{t.mission.eyebrow}</span>
                <span className="text-[15px] md:text-[17px] font-semibold text-ink leading-[1.2] tracking-[-0.3px]">{t.mission.title}</span>
              </div>
            </div>

            {/* The room */}
            <div className="relative z-10 flex flex-col items-center gap-3 md:gap-4">
              {ROWS.map((row, r) => (
                <div key={r} className="flex items-center justify-center gap-2 sm:gap-3 md:gap-5">
                  {row.map((look, c) => {
                    const i = r === 0 ? c : ROWS[0].length + c;
                    const isTarget = i === target;
                    const dim = isTarget && away;
                    return (
                      <span key={i} className={FLOATS.has(i) ? "float-y" : ""} style={{ animationDelay: `${(i % 5) * -1.3}s` }}>
                        <span
                          className="relative block transition-[opacity,filter,transform] duration-700 ease-out"
                          style={{
                            opacity: dim ? 0.3 : 1,
                            filter: dim ? "grayscale(1)" : "none",
                            transform: dim ? "translateY(8px) scale(0.86)" : "none",
                          }}
                        >
                          <IllustratedAvatar
                            look={AVATAR_LOOKS[look % AVATAR_LOOKS.length]}
                            className="w-10 h-10 sm:w-[52px] sm:h-[52px] md:w-[68px] md:h-[68px] rounded-full"
                          />
                          {dim && (
                            <span aria-hidden className="absolute -inset-1 rounded-full border-2 border-dashed border-ink-3/45" />
                          )}
                          {isTarget && backHome && (
                            <>
                              <span
                                aria-hidden
                                className="pulse-ring absolute inset-0 rounded-full"
                                style={{ background: "color-mix(in oklab, #12a150 45%, transparent)" }}
                              />
                              <span className="pin-in absolute -bottom-0.5 -right-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#12a150] border-2 border-surface-2 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
                              </span>
                            </>
                          )}
                        </span>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* What the system does about it — the dashboard card, in miniature */}
            <div className="relative z-10 w-full max-w-[420px] min-h-[104px] flex items-center justify-center">
              {step < FLAGGED ? (
                <span className="flex items-center gap-2 text-[13.5px] md:text-[14.5px] text-ink-3 text-center">
                  <Radar className="w-4 h-4 shrink-0" strokeWidth={2} />
                  {t.mission.points[0]}
                </span>
              ) : (
                <div
                  key={`${cycle}-${step}`}
                  className="bubble-in w-full flex flex-col gap-2 rounded-2xl bg-surface border border-hairline px-4 py-3.5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.4)]"
                >
                  <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em]">
                    <span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: backHome ? "#12a150" : "#f59e0b" }}
                    />
                    <span style={{ color: backHome ? "#12a150" : "#f59e0b" }}>
                      {backHome ? t.reach.back : attention.attention}
                    </span>
                  </span>

                  <div className="flex items-center gap-3">
                    <IllustratedAvatar look={targetLook} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0" />
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="text-[14.5px] font-semibold text-ink leading-[1.2] truncate">{person.name}</span>
                      <span className="text-[12.5px] text-ink-3 leading-[1.3] truncate">{person.note}</span>
                    </div>

                    {step === FLAGGED && (
                      <span className="flex items-center gap-1.5 rounded-lg bg-[var(--cta-default)] text-white text-[12.5px] font-semibold px-3 py-2 shrink-0">
                        <Send className="w-3.5 h-3.5 hidden sm:block" strokeWidth={2.4} />
                        {t.reach.action}
                      </span>
                    )}
                    {step === 3 && (
                      <span className="press-pulse flex items-center gap-1.5 rounded-lg bg-brand-soft text-brand text-[12.5px] font-semibold px-3 py-2 shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        {t.reach.sent}
                      </span>
                    )}
                    {backHome && (
                      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "color-mix(in oklab, #12a150 14%, var(--surface))" }}>
                        <Check className="w-4 h-4 text-[#0e7a3c]" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}
