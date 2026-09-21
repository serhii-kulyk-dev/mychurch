"use client";

import { useState } from "react";
import { ArrowRight, Check, CornerDownRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { moduleAccent } from "@/components/shared/module-icons";
import { SOLVED_CASES } from "@/content/solved";
import { track } from "@/lib/analytics/client";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Було — стало». Один чеклист болів — і більше нічого: правої
   частини з планом тут немає (2026-09-21: «не треба праву
   частину»), бо блок не має бути ще одним демо. Екрани й покрокові
   плани живуть на сторінках модулів.

   Рядок — це чекбокс. Клік ставить галочку, повторний знімає.
   Позначений біль викреслюється, а під ним з'являється рядок про
   те, як стає, — тому й «було — стало». Шкала «беремо на себе»
   росте, і той самий список їде в бриф разом із заявкою, тож
   галочка має наслідок. Повний конструктор — на /modules.
   ──────────────────────────────────────────────────────────────── */

export default function Solved() {
  const t = useT();
  const s = t.solved;
  const { openWith } = useDemoModal();
  /* Позначене, в порядку кліків: у такому ж вигляді поїде в бриф. */
  const [taken, setTaken] = useState<string[]>([]);

  /* Стан рахуємо від попереднього, а не від того, що бачив рендер:
     два швидкі кліки поспіль інакше з'їдають один одного. */
  const mark = (id: string) => {
    setTaken((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    track("solved_mark", { id, place: "home", on: taken.includes(id) ? "off" : "on" });
  };

  const talk = () => {
    track("solved_cta", { id: taken.join(","), place: "home" });
    openWith(taken);
  };

  return (
    <section id="solved" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <FadeIn className="flex flex-col gap-4 max-w-[760px]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{s.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[30px] md:text-[44px] leading-[1.12] tracking-[-1px] md:tracking-[-1.6px]">{s.title}</h2>
        </FadeIn>

        <FadeIn variant="scale">
          <div className="overflow-clip rounded-[24px] md:rounded-[30px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div
              className="flex flex-col gap-4 md:gap-5 p-5 md:p-7"
              style={{ background: "linear-gradient(170deg, color-mix(in oklab, var(--brand) 7%, var(--surface)) 0%, var(--surface-2) 60%)" }}
            >
              {/* Болі. Рядок = чекбокс: клік ставить, повторний знімає. */}
              <div role="group" aria-label={s.pickLabel} className="grid gap-1.5 md:grid-cols-2 md:gap-x-3">
                {SOLVED_CASES.map((c) => {
                  const got = taken.includes(c.id);
                  const tone = moduleAccent(c.modules[0]);
                  const cc = s.cases[c.id as keyof typeof s.cases];
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="checkbox"
                      aria-checked={got}
                      onClick={() => mark(c.id)}
                      className={cn(
                        "group text-left grid grid-cols-[auto_auto_1fr] items-center content-center gap-x-3 gap-y-1.5 rounded-[14px] border px-3 py-2.5 transition-[background-color,border-color] duration-150",
                        !got && "border-hairline bg-surface hover:border-hairline-strong hover:bg-surface-2"
                      )}
                      style={
                        got
                          ? {
                              background: `color-mix(in oklab, ${tone} 8%, var(--surface))`,
                              borderColor: `color-mix(in oklab, ${tone} 32%, transparent)`,
                            }
                          : undefined
                      }
                    >
                      {/* Клітинка: порожня — поки ні, колір модуля — коли так. */}
                      <span
                        aria-hidden
                        className={cn(
                          "w-[21px] h-[21px] rounded-[7px] border-[1.5px] flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150",
                          !got && "bg-surface border-hairline-strong group-hover:border-ink-3"
                        )}
                        style={got ? { background: tone, borderColor: tone } : undefined}
                      >
                        {got && <Check className="pin-in w-[13px] h-[13px] text-white" strokeWidth={3.6} />}
                      </span>

                      <c.Icon
                        className="w-[17px] h-[17px] shrink-0 transition-opacity duration-150"
                        strokeWidth={2.1}
                        style={{ color: tone, opacity: got ? 0.4 : 0.9 }}
                      />

                      {/* Позначений біль викреслюємо — його ми беремо на себе. */}
                      <span
                        className={cn(
                          "text-[14px] md:text-[14.5px] font-medium leading-[1.3] min-w-0 transition-colors duration-150",
                          got ? "text-ink-3 line-through decoration-[1.5px]" : "text-ink"
                        )}
                        style={got ? { textDecorationColor: `color-mix(in oklab, ${tone} 60%, transparent)` } : undefined}
                      >
                        {cc.pain}
                      </span>

                      {got && (
                        <span className="pin-in col-start-3 flex items-start gap-1.5 text-[12.5px] md:text-[13px] text-ink-2 leading-[1.35]">
                          <CornerDownRight className="w-3.5 h-3.5 mt-px shrink-0" strokeWidth={2.4} style={{ color: tone }} />
                          {cc.result}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Шкала: скільки болів уже відмічено. */}
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{s.takeLabel}</span>
                  <span className="text-[12.5px] text-ink-3 tabular-nums leading-none">
                    <span className="text-[15px] font-semibold text-ink">{taken.length}</span> {s.takeOf} {SOLVED_CASES.length}
                  </span>
                </div>
                <span className="relative block h-1.5 rounded-full bg-hairline-strong overflow-hidden">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-500 ease-out"
                    style={{ width: `${(taken.length / SOLVED_CASES.length) * 100}%` }}
                  />
                </span>
              </div>
            </div>

            {/* ── Розмова: кнопка забирає все, що встигли позначити.
                   Речення біля неї прибрано (2026-09-21) — воно нічого
                   не додавало до самої дії. ──────────────────────── */}
            <div className="border-t border-hairline bg-surface p-5 md:p-7">
              <button
                type="button"
                onClick={talk}
                className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 md:h-[54px] w-full rounded-full overflow-hidden"
              >
                <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.32px] leading-[1.4]">{s.cta}</span>
                <ArrowRight className="relative w-[17px] h-[17px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
