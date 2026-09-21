"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Radar, Send } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Шапка «Про нас» показує місію, а не переказує її.

   До 2026-09-21 тут стояв ряд кружечків-облич: одне тьмяніло, під ним
   спливала картка. Кружечки нічого не доводили — це була картинка про
   людей, а не про те, звідки система взагалі знає, що людина зникла.

   Тепер це журнал явки: вісім тижнів крапками, рядок на людину. У
   когось із рядків гаснуть три останні тижні — і система сама каже про
   це лідеру. Лідер пише, наступний тиждень стає зеленим. Три людини
   по черзі беруть на себе цю роль, по одній за цикл.
   ──────────────────────────────────────────────────────────────── */

/* Скільки тижнів у рядку і скільки останніх гасне у того, хто зник. */
const WEEKS = 8;
const TAIL = 3;

/* Базова явка: у кожного свій пропуск, щоб рядки не були близнюками.
   true — був. Індекс рядка збігається з `preview.attentionRows`. */
const BASE = [
  [true, true, true, true, true, true, true, true],
  [true, true, false, true, true, true, true, true],
  [true, true, true, true, false, true, true, true],
  [false, true, true, true, true, true, true, true],
];

/* спокій → зникає → система помітила → лідер написав → повернулась */
const STEP_MS = [1600, 1500, 2300, 1500, 2400];
const FLAGGED = 2;
const SENT = 3;
const BACK = 4;

/* Скільки людей по черзі беруть роль тієї, хто зник. */
const CYCLES = 3;

const AMBER = "#f59e0b";
const GREEN = "#12a150";

export default function AboutHero() {
  const t = useT().about;
  const preview = useT().preview;

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
          /* Без руху завмираємо на кадрі, який несе всю історію. */
          setStep(FLAGGED);
        } else if (step < STEP_MS.length - 1) {
          setStep(step + 1);
        } else {
          setStep(0);
          setCycle((c) => (c + 1) % CYCLES);
        }
      },
      reduced ? 0 : STEP_MS[step],
    );
    return () => window.clearTimeout(id);
  }, [inView, step, cycle]);

  const rows = preview.attentionRows.slice(0, BASE.length);
  const person = preview.attentionRows[cycle];
  const backHome = step === BACK;

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

        <FadeIn delay={2} variant="scale" className="w-full max-w-[820px]">
          <div
            ref={hostRef}
            className="relative overflow-hidden rounded-[24px] md:rounded-[30px] border border-hairline bg-surface shadow-[0_34px_70px_-45px_rgba(0,50,120,0.5)]"
          >
            {/* Шапка журналу */}
            <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 md:px-7 py-4 md:py-5">
              <span className="flex items-center gap-2.5 min-w-0">
                <span aria-hidden className="w-2 h-2 rounded-full bg-brand shrink-0" />
                <span className="text-[15px] md:text-[17px] font-semibold text-ink leading-[1.2] tracking-[-0.3px] truncate">
                  {preview.attendance}
                </span>
              </span>
              <span className="text-[12.5px] md:text-[13.5px] text-ink-3 whitespace-nowrap">{preview.attendanceSub}</span>
            </div>

            {/* Рядок на людину: обличчя, ім'я і вісім тижнів крапками */}
            <div className="flex flex-col">
              {rows.map((row, r) => {
                const isTarget = r === cycle;
                const flagged = isTarget && step >= FLAGGED && !backHome;
                const returned = isTarget && backHome;
                return (
                  <div
                    key={row.name}
                    className={`flex items-center gap-3 md:gap-4 px-5 md:px-7 py-3 md:py-3.5 transition-colors duration-500 ${r > 0 ? "border-t border-hairline" : ""}`}
                    style={{
                      background: flagged
                        ? `color-mix(in oklab, ${AMBER} 9%, var(--surface))`
                        : returned
                          ? `color-mix(in oklab, ${GREEN} 9%, var(--surface))`
                          : "var(--surface)",
                    }}
                  >
                    <PersonAvatar look={lookFor(row.name)} className="w-9 h-9 md:w-10 md:h-10 rounded-full shrink-0" />
                    <span className="text-[14px] md:text-[15.5px] text-ink leading-[1.25] truncate flex-1 min-w-0">
                      {row.name}
                    </span>

                    <span aria-hidden className="flex items-center gap-[5px] md:gap-2 shrink-0">
                      {BASE[r].map((was, w) => {
                        const tail = isTarget && w >= WEEKS - TAIL;
                        const lastWeek = w === WEEKS - 1;
                        /* Хвіст рядка живе за кроками сцени, решта — за базою. */
                        const on = tail ? (step === 0 ? true : returned && lastWeek) : was;
                        const fresh = returned && lastWeek;
                        return (
                          <span
                            key={w}
                            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors duration-500"
                            style={{
                              background: fresh
                                ? GREEN
                                : on
                                  ? "color-mix(in oklab, var(--brand) 78%, var(--surface))"
                                  : "var(--hairline-strong)",
                            }}
                          />
                        );
                      })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Що система робить із цим — нижня смуга того самого екрана */}
            <div className="border-t border-hairline bg-surface-2 px-5 md:px-7 py-3.5 md:py-4 min-h-[68px] md:min-h-[74px] flex items-center">
              {step < FLAGGED ? (
                <span className="flex items-center gap-2.5 text-[13.5px] md:text-[14.5px] text-ink-3">
                  <Radar className="w-4 h-4 shrink-0" strokeWidth={2} />
                  {t.mission.points[0]}
                </span>
              ) : (
                <div key={`${cycle}-${step}`} className="bubble-in w-full flex items-center gap-3 md:gap-4">
                  <span className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em]">
                      <span
                        aria-hidden
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: backHome ? GREEN : AMBER }}
                      />
                      <span style={{ color: backHome ? GREEN : AMBER }}>
                        {backHome ? t.reach.back : preview.attention}
                      </span>
                    </span>
                    <span className="text-[13.5px] md:text-[15px] text-ink leading-[1.3] truncate">
                      <span className="font-semibold">{person.name}</span>
                      <span className="text-ink-3"> · {person.note}</span>
                    </span>
                  </span>

                  {step === FLAGGED && (
                    <span className="flex items-center gap-1.5 rounded-lg bg-[var(--cta-default)] text-white text-[12.5px] font-semibold px-3 py-2 shrink-0">
                      <Send className="w-3.5 h-3.5 hidden sm:block" strokeWidth={2.4} />
                      {t.reach.action}
                    </span>
                  )}
                  {step === SENT && (
                    <span className="press-pulse flex items-center gap-1.5 rounded-lg bg-brand-soft text-brand text-[12.5px] font-semibold px-3 py-2 shrink-0">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      {t.reach.sent}
                    </span>
                  )}
                  {backHome && (
                    <span
                      className="pin-in w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in oklab, ${GREEN} 14%, var(--surface))` }}
                    >
                      <Check className="w-4 h-4" strokeWidth={3} style={{ color: "#0e7a3c" }} />
                    </span>
                  )}
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
