"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock, RotateCcw, Sparkles } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Animated number: eases towards the target so every hand-over "counts up". */
function useEased(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (prefersReducedMotion()) {
      const id = setTimeout(() => setValue(target), 0);
      return () => clearTimeout(id);
    }
    let raf = 0;
    const start = performance.now();
    const from = value;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);
  return value;
}

const CONFETTI = ["#007aff", "#12a150", "#f59e0b", "#f05b8b", "#8b5bf0", "#0ea5e9"];

export default function AiRoutine() {
  const t = useT().ai.routine;
  const total = t.items.reduce((sum, i) => sum + i.minutes, 0);
  const [moved, setMoved] = useState<number[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  const freed = moved.reduce((sum, i) => sum + t.items[i].minutes, 0);
  const shown = useEased(freed);
  const all = moved.length === t.items.length;

  useEffect(() => {
    if (!all) return;
    const on = setTimeout(() => setCelebrate(true), 0);
    const off = setTimeout(() => setCelebrate(false), 2600);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [all]);

  const handOver = (i: number) => setMoved((m) => (m.includes(i) ? m : [...m, i]));
  const handOverAll = () => setMoved(t.items.map((_, i) => i));
  const reset = () => setMoved([]);

  const fmt = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return `${m} ${t.minutes}`;
    return m ? `${h} ${t.hours} ${m} ${t.minutes}` : `${h} ${t.hours}`;
  };

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        {/* Counter */}
        <FadeIn variant="scale" className="w-full">
          <div className="relative overflow-hidden rounded-[24px] border border-hairline bg-page px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
            {celebrate && (
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className="confetti-dot absolute w-2 h-2 rounded-full"
                    style={
                      {
                        left: `${8 + ((i * 53) % 84)}%`,
                        top: "50%",
                        backgroundColor: CONFETTI[i % CONFETTI.length],
                        "--dx": `${(i % 2 ? 1 : -1) * (20 + (i * 13) % 60)}px`,
                        "--dy": `${-40 - (i * 17) % 70}px`,
                        animationDelay: `${(i % 6) * 60}ms`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center shrink-0">
                <Clock className="w-[22px] h-[22px] text-brand" strokeWidth={2.2} />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">{t.freed}</span>
                <span className="text-[34px] md:text-[40px] font-semibold text-ink leading-none tracking-[-1.2px] tabular-nums">{fmt(shown)}</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-2.5 rounded-full bg-surface-3 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(freed / total) * 100}%`,
                    background: "linear-gradient(90deg, var(--brand), #12a150)",
                    transition: "width 0.7s var(--ease-out-soft)",
                  }}
                />
              </div>
              <span className={cn("text-[14px] leading-[1.4] transition-colors", all ? "text-ink font-medium" : "text-ink-3")}>
                {all ? t.allDone.replace("{time}", fmt(total)) : `${freed} / ${total} ${t.perWeek}`}
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              {all ? (
                <button
                  type="button"
                  onClick={reset}
                  className="h-10 px-4 rounded-full border border-hairline-strong bg-surface flex items-center justify-center gap-2 text-[14px] font-medium text-ink-2 hover:bg-surface-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={2.2} />
                  {t.reset}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handOverAll}
                  className="btn-brand h-10 px-5 rounded-full flex items-center justify-center gap-2 text-[14px] font-semibold text-white"
                >
                  <Sparkles className="w-4 h-4" strokeWidth={2.4} />
                  {t.handOverAll}
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 items-start">
          {/* Manual list */}
          <FadeIn delay={1} className="min-w-0">
            <div className="rounded-[24px] border border-hairline bg-page overflow-hidden">
              <div className="px-5 py-3.5 border-b border-hairline flex items-center justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.mineTitle}</span>
                <span className="text-[12.5px] text-ink-3 tabular-nums">{t.items.length - moved.length}</span>
              </div>
              <ul className="flex flex-col p-2">
                {t.items.map((item, i) => {
                  const done = moved.includes(i);
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => handOver(i)}
                        disabled={done}
                        aria-pressed={done}
                        className={cn(
                          "group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-300",
                          done ? "opacity-45" : "hover:bg-surface hover:shadow-[0_8px_20px_-14px_rgba(0,0,0,0.35)]"
                        )}
                      >
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300",
                            done ? "bg-[#12a150] border-[#12a150] text-white" : "border-hairline-strong group-hover:border-brand"
                          )}
                        >
                          {done && <Check className="w-3.5 h-3.5" strokeWidth={3.2} />}
                        </span>
                        <span className={cn("flex-1 text-[14.5px] leading-[1.35] transition-colors", done ? "text-ink-3 line-through" : "text-ink")}>{item.label}</span>
                        <span className="text-[12.5px] text-ink-3 tabular-nums shrink-0">{fmt(item.minutes)}</span>
                        {!done && (
                          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1.5 text-[12px] font-semibold text-brand leading-none opacity-0 group-hover:opacity-100 transition-opacity">
                            {t.handOver}
                            <ArrowRight className="w-3 h-3" strokeWidth={2.6} />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </FadeIn>

          {/* Assistant list */}
          <FadeIn delay={2} className="min-w-0">
            <div className="rounded-[24px] border border-brand/25 bg-page overflow-hidden shadow-[0_30px_60px_-40px_rgba(0,122,255,0.45)]">
              <div className="px-5 py-3.5 border-b border-hairline flex items-center justify-between bg-brand-soft/60">
                <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
                  <Image src="/eva.jpg" alt="" width={22} height={22} sizes="22px" className="rounded-full" />
                  {t.botTitle}
                </span>
                <span className="text-[12.5px] text-brand tabular-nums">{moved.length}</span>
              </div>
              <ul className="flex flex-col p-2 min-h-[220px]">
                {moved.length === 0 && (
                  <li className="flex-1 flex items-center justify-center px-6 py-10 text-center text-[14px] text-ink-3 leading-[1.4]">{t.empty}</li>
                )}
                {moved.map((i) => {
                  const item = t.items[i];
                  return (
                    <li key={item.label} className="bubble-in flex items-center gap-3 rounded-xl px-3 py-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#12a150] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={3.2} />
                      </span>
                      <span className="flex-1 text-[14.5px] text-ink leading-[1.35]">{item.label}</span>
                      <span className="text-[12.5px] font-semibold text-[#0e7a3c] dark:text-[#3ddc97] tabular-nums shrink-0">+{fmt(item.minutes)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
