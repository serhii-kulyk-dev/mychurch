"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check, X } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import { MODULE_ICONS, moduleAccent } from "@/components/shared/module-icons";
import { SOLVED_CASES } from "@/content/solved";
import { track } from "@/lib/analytics/client";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   «Було — стало». Ліворуч людина обирає свій біль, праворуч —
   те, що ми пропонуємо: сам біль, план із трьох кроків, які
   відмічаються галочками один за одним, підсумок і модулі.

   Макет системи свідомо не показуємо (2026-09-20: «пункти як це
   вирішуємо і не показувати систему») — екрани живуть в інших
   блоках сторінки, а тут важить сам план.

   На телефоні права частина — не просто вміст, що підміняється,
   а сторінки: усі ситуації стоять поруч у стрічці зі snap, тож
   сторінка їде за пальцем і чипи вгорі підхоплюють ту, на якій
   палець зупинився. На десктопі стрічка не гортається — там видно
   лише активну сторінку, а перемикає її список ліворуч.

   Один біль за раз: дві позначки на один план — це вибір без
   наслідку. Повний конструктор бажань лишається на /modules.
   ──────────────────────────────────────────────────────────────── */

/* ── План: кроки відмічаються один за одним ────────────────────
   Галочки йдуть тільки на активній сторінці: сусідня стоїть
   невідміченою, тож коли її витягуєш пальцем — план складається
   вже в неї на очах. Скидає план перемонтування (key міняється
   разом з активністю), тому тут лишаються самі таймери. Зі
   зменшеною анімацією вони спрацьовують одразу — план просто
   стоїть відмічений. */
function Plan({
  lines, icons, result, accent, label, active,
}: {
  lines: readonly string[]; icons: readonly LucideIcon[]; result: string; accent: string; label: string; active: boolean;
}) {
  const [ticked, setTicked] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduced = prefersReducedMotion();
    const ids = lines.map((_, i) => setTimeout(() => setTicked(i + 1), reduced ? 0 : 420 + i * 640));
    return () => ids.forEach(clearTimeout);
  }, [lines, active]);

  const done = ticked >= lines.length;

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{label}</span>

      <ol className="relative flex flex-col gap-3.5">
        {/* Рейка між кроками зафарбовується разом із галочками. */}
        <span aria-hidden className="absolute left-[21px] top-6 bottom-6 w-px bg-hairline-strong" />
        <span
          aria-hidden
          className="absolute left-[21px] top-6 w-px transition-[height] duration-500 ease-out"
          style={{ height: `calc((100% - 48px) * ${Math.max(0, ticked - 1) / Math.max(1, lines.length - 1)})`, background: accent }}
        />

        {lines.map((line, i) => {
          const on = i < ticked;
          const Icon = icons[i];
          return (
            <li key={line} className="relative flex items-center gap-3.5">
              <span
                className="relative z-10 w-[42px] h-[42px] rounded-[14px] border flex items-center justify-center shrink-0 transition-[background-color,border-color,color] duration-400"
                style={
                  on
                    ? { background: accent, borderColor: accent, color: "#fff" }
                    : { background: "var(--surface)", borderColor: "var(--hairline-strong)", color: "var(--ink-3)" }
                }
              >
                <Icon className="w-[19px] h-[19px]" strokeWidth={2} />
                {on && (
                  <span className="pin-in absolute -right-1 -bottom-1 w-[17px] h-[17px] rounded-full bg-surface flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3.4} style={{ color: accent }} />
                  </span>
                )}
              </span>
              <span className={cn("text-[14.5px] md:text-[15px] leading-[1.4] transition-colors duration-400", on ? "text-ink" : "text-ink-3")}>
                {line}
              </span>
            </li>
          );
        })}
      </ol>

      <div
        className="flex items-start gap-2.5 rounded-[14px] px-3.5 py-3 transition-opacity duration-500"
        style={{ background: `color-mix(in oklab, ${accent} 9%, var(--surface))`, opacity: done ? 1 : 0 }}
      >
        <Check className="w-4 h-4 mt-px shrink-0" strokeWidth={3.2} style={{ color: accent }} />
        <span className="text-[14.5px] md:text-[15px] font-medium text-ink leading-[1.4]">{result}</span>
      </div>
    </div>
  );
}

export default function Solved() {
  const t = useT();
  const s = t.solved;
  const { openWith } = useDemoModal();
  const [active, setActive] = useState(SOLVED_CASES[0].id);

  const index = Math.max(0, SOLVED_CASES.findIndex((c) => c.id === active));

  /* Назви модулів живуть у каталозі — тут лише чипи під планом. */
  const moduleNames = new Map<string, string>();
  for (const g of t.modules.groups) for (const i of g.items) moduleNames.set(i.id, i.name);

  const pick = useCallback(
    (id: string, via: "tap" | "swipe" = "tap") => {
      setActive((prev) => {
        if (id === prev) return prev;
        track("solved_pick", { id, place: "home", via });
        return id;
      });
    },
    [],
  );

  /* На телефоні список — стрічка: активний чип під'їжджає в поле зору,
     інакше після перемикання він може лишитись за краєм екрана. */
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = strip.current;
    const chip = box?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (!box || !chip || box.scrollWidth <= box.clientWidth) return;
    /* Скрол миттєвий: плавний браузер ковтає, поки блок сам виїжджає
       (reveal). Кадр після коміту і ще раз трохи згодом — на випадок,
       коли ширина стрічки в перший момент ще не та. */
    const run = () => box.scrollTo({ left: chip.offsetLeft - (box.clientWidth - chip.offsetWidth) / 2 });
    const frame = requestAnimationFrame(run);
    const late = setTimeout(run, 280);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(late);
    };
  }, [active]);

  /* ── Сторінки ────────────────────────────────────────────────
     Гортає їх сам браузер (snap), ми лише слухаємо, де палець
     зупинився, і підхоплюємо чип. Тому жест і гальмування рідні:
     нічого не перехоплюємо і не малюємо рух руками. */
  const pager = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = pager.current;
    if (!box) return;
    let idle: number;
    const onScroll = () => {
      window.clearTimeout(idle);
      /* Подія приходить на кожен кадр руху — беремо ситуацію, коли
         стрічка вже стала (snap довозить її до краю сторінки). */
      idle = window.setTimeout(() => {
        if (box.scrollWidth <= box.clientWidth) return;
        const c = SOLVED_CASES[Math.round(box.scrollLeft / box.clientWidth)];
        if (c) pick(c.id, "swipe");
      }, 90);
    };
    box.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      box.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, [pick]);

  /* Вибір чипом — стрічка сама доїжджає до потрібної сторінки.
     Коли її пригортав палець, вона вже там: не смикаємо. */
  useEffect(() => {
    const box = pager.current;
    if (!box || box.scrollWidth <= box.clientWidth) return;
    const left = index * box.clientWidth;
    if (Math.abs(box.scrollLeft - left) < 8) return;
    box.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [index]);

  const talk = () => {
    track("solved_cta", { id: active, place: "home" });
    openWith([active]);
  };

  return (
    <section id="solved" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <FadeIn className="flex flex-col gap-4 max-w-[760px]">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{s.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[30px] md:text-[44px] leading-[1.12] tracking-[-1px] md:tracking-[-1.6px]">{s.title}</h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55]">{s.lead}</p>
        </FadeIn>

        <FadeIn variant="scale">
          <div className="overflow-clip rounded-[24px] md:rounded-[30px] border border-hairline bg-surface grid grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {/* ── Вибір болю ─────────────────────────────────── */}
            <div
              className="flex flex-col gap-4 p-5 md:p-7 border-b lg:border-b-0 lg:border-r border-hairline"
              style={{ background: "linear-gradient(170deg, color-mix(in oklab, var(--brand) 7%, var(--surface)) 0%, var(--surface-2) 60%)" }}
            >
              <h3 className="text-[15px] font-semibold text-ink leading-[1.3]">{s.pickLabel}</h3>

              {/* Телефон — стрічка чипів, десктоп — колонка рядків. */}
              <div
                ref={strip}
                role="radiogroup"
                aria-label={s.pickLabel}
                className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0 lg:overflow-visible"
              >
                {SOLVED_CASES.map((c) => {
                  const on = c.id === active;
                  const tone = moduleAccent(c.modules[0]);
                  const cc = s.cases[c.id as keyof typeof s.cases];
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => pick(c.id)}
                      className={cn(
                        "group shrink-0 lg:w-full text-left flex items-center gap-2 lg:gap-3 rounded-full lg:rounded-[14px] border px-2.5 lg:px-3 py-2 lg:py-2.5 transition-[background-color,border-color] duration-150",
                        on ? "border-brand bg-brand-soft" : "border-hairline bg-surface hover:border-hairline-strong hover:bg-surface-2"
                      )}
                    >
                      <span
                        className="w-7 h-7 lg:w-8 lg:h-8 rounded-full lg:rounded-[10px] border flex items-center justify-center shrink-0 transition-colors duration-150"
                        style={
                          on
                            ? { background: tone, borderColor: tone, color: "#fff" }
                            : { background: `color-mix(in oklab, ${tone} 12%, var(--surface))`, borderColor: "var(--hairline)", color: tone }
                        }
                      >
                        <c.Icon className="w-[15px] h-[15px] lg:w-4 lg:h-4" strokeWidth={2.1} />
                      </span>
                      <span className={cn("text-[13.5px] lg:text-[14.5px] text-ink leading-[1.3] min-w-0 flex-1 whitespace-nowrap lg:whitespace-normal", on ? "font-semibold" : "font-medium")}>
                        <span className="lg:hidden">{cc.chip}</span>
                        <span className="hidden lg:inline">{cc.pain}</span>
                      </span>
                      <ArrowRight
                        className={cn("hidden lg:block w-4 h-4 shrink-0 transition-opacity duration-150", on ? "opacity-100 text-brand" : "opacity-0 group-hover:opacity-40 text-ink-3")}
                        strokeWidth={2.4}
                      />
                    </button>
                  );
                })}
              </div>

              <Link
                href="/modules"
                className="inline-flex items-center gap-1.5 self-start mt-auto text-[12.5px] font-medium text-brand hover:opacity-80 transition-opacity duration-150"
              >
                {s.more}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.4} />
              </Link>
            </div>

            {/* ── Що ми пропонуємо: сторінка на ситуацію ──────── */}
            <div className="bg-surface-2/40 flex flex-col">
              <div
                ref={pager}
                className="flex overflow-x-auto overscroll-x-contain snap-x snap-mandatory no-scrollbar lg:overflow-visible"
              >
                {SOLVED_CASES.map((c) => {
                  const on = c.id === active;
                  const cc = s.cases[c.id as keyof typeof s.cases];
                  const tone = moduleAccent(c.modules[0]);
                  return (
                    <div
                      key={c.id}
                      aria-hidden={!on}
                      className={cn(
                        "w-full shrink-0 snap-center flex flex-col justify-center gap-5 p-5 md:p-7",
                        !on && "lg:hidden"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-[18px] h-[18px] rounded-full bg-surface-3 text-ink-3 flex items-center justify-center shrink-0 mt-px">
                          <X className="w-2.5 h-2.5" strokeWidth={3.2} />
                        </span>
                        <span className="text-[12.5px] text-ink-3 leading-[1.4]">
                          <span className="font-semibold uppercase tracking-[0.08em] text-[10px] mr-1.5">{s.nowLabel}</span>
                          {cc.now}
                        </span>
                      </div>

                      <Plan
                        key={on ? "on" : "off"}
                        lines={cc.auto}
                        icons={c.steps}
                        result={cc.result}
                        accent={tone}
                        label={s.autoLabel}
                        active={on}
                      />

                      <div className="flex flex-wrap items-center gap-1.5">
                        {c.modules.map((id) => {
                          const Icon = MODULE_ICONS[id] ?? Check;
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 text-[11.5px] font-medium text-ink-2 leading-none"
                            >
                              <Icon className="w-3.5 h-3.5" strokeWidth={2.2} style={{ color: moduleAccent(id) }} />
                              {moduleNames.get(id) ?? id}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Розмова спільна для всіх сторінок — вона не їде. */}
              <div className="flex flex-col gap-2.5 px-5 md:px-7 pb-5 md:pb-7">
                <p className="text-[13px] text-ink-2 leading-[1.45]">{s.ctaLead}</p>
                <button
                  type="button"
                  onClick={talk}
                  className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 w-full rounded-full overflow-hidden"
                >
                  <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.32px] leading-[1.4]">{s.cta}</span>
                  <ArrowRight className="relative w-[17px] h-[17px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
