"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Check, FileText, LoaderCircle, Sparkles, UserRoundSearch, Users, Zap } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import type { Dict } from "@/lib/i18n";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

type Scenarios = Dict["ai"]["scenarios"];
type Scenario = Scenarios["items"][number];

const ICONS = [UserRoundSearch, Users, FileText, CalendarCheck];
const ACCENTS = ["#f05b8b", "#007aff", "#8b5bf0", "#12a150"];
const AUTO_MS = 9500;
const STEP_MS = 650;

function StatusDot({ status, accent }: { status: "done" | "running" | "pending"; accent: string }) {
  return (
    <span
      className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
        status === "pending" && "border-2 border-hairline-strong bg-surface",
        status === "running" && "bg-surface",
        status === "done" && "text-white"
      )}
      style={status === "done" ? { backgroundColor: accent } : status === "running" ? { color: accent } : undefined}
    >
      {status === "done" && <Check className="w-[13px] h-[13px]" strokeWidth={3.2} />}
      {status === "running" && <LoaderCircle className="w-[18px] h-[18px] animate-spin" strokeWidth={2.4} />}
    </span>
  );
}

function AiRun({ scenario, labels, accent, run }: { scenario: Scenario; labels: Scenarios; accent: string; run: boolean }) {
  const total = scenario.steps.length;
  const [done, setDone] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!run) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    if (prefersReducedMotion()) {
      at(0, () => {
        setDone(total);
        setFinished(true);
      });
      return () => timers.forEach(clearTimeout);
    }
    for (let i = 0; i < total; i++) at(500 + (i + 1) * STEP_MS, () => setDone(i + 1));
    at(500 + total * STEP_MS + 350, () => setFinished(true));
    return () => timers.forEach(clearTimeout);
  }, [run, total]);

  return (
    <div className="bubble-in rounded-[24px] border border-hairline bg-surface shadow-[0_30px_60px_-40px_rgba(0,50,120,0.4)] overflow-hidden">
      {/* Request */}
      <div className="px-5 md:px-6 pt-5 pb-4 border-b border-hairline bg-surface-2 flex flex-col gap-2.5">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{labels.requestLabel}</span>
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-full bg-[#5b8af0] text-white text-[12px] font-semibold flex items-center justify-center shrink-0" title={labels.requester}>
            {labels.requester[0]}
          </span>
          <p className="rounded-[16px] rounded-tl-[4px] bg-brand text-white px-4 py-2.5 text-[15px] leading-[1.45]">{scenario.request}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr]">
        {/* Steps */}
        <div className="p-5 md:p-6 flex flex-col gap-4 md:border-r border-hairline">
          <span className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
            <Sparkles className="w-3.5 h-3.5 text-brand" strokeWidth={2.4} />
            {labels.stepsLabel}
          </span>
          <ol className="flex flex-col">
            {scenario.steps.map((s, i) => {
              const status = i < done ? "done" : i === done && !finished ? "running" : "pending";
              const last = i === total - 1;
              return (
                <li key={s.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <StatusDot status={status} accent={accent} />
                    {!last && (
                      <span className="relative w-[2px] flex-1 min-h-[16px] bg-surface-3 overflow-hidden">
                        <span
                          className="absolute inset-0 origin-top"
                          style={{
                            backgroundColor: accent,
                            transform: i < done ? "scaleY(1)" : "scaleY(0)",
                            transition: "transform 0.45s var(--ease-out-soft)",
                          }}
                        />
                      </span>
                    )}
                  </div>
                  <div className={cn("flex-1 flex items-start justify-between gap-3", last ? "pb-0" : "pb-4")}>
                    <span className={cn("text-[14.5px] leading-[1.35] pt-0.5 transition-colors duration-300", status === "pending" ? "text-ink-3" : "text-ink")}>
                      {s.label}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border border-hairline bg-surface-2 px-2 py-1 text-[11.5px] font-medium text-ink-2 tabular-nums leading-none transition-all duration-300",
                        status === "done" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                      )}
                    >
                      {s.meta}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Result */}
        <div className="p-5 md:p-6 flex flex-col gap-4 bg-surface-2/60 border-t md:border-t-0 border-hairline">
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{labels.resultLabel}</span>
          <div className={cn("flex flex-col gap-4 flex-1 transition-all duration-500", finished ? "opacity-100 translate-y-0" : "opacity-45 translate-y-1")}>
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                  finished ? "bg-[#12a150] text-white" : "bg-surface border border-hairline text-brand"
                )}
              >
                {finished ? <Check className="w-[18px] h-[18px]" strokeWidth={3} /> : <LoaderCircle className="w-[18px] h-[18px] animate-spin" strokeWidth={2.4} />}
              </span>
              <span className="text-[16px] font-semibold text-ink leading-[1.3] pt-1.5">{finished ? scenario.result : labels.working}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {scenario.stats.map((st) => (
                <div key={st.label} className="rounded-xl bg-surface border border-hairline px-3 py-2.5 flex flex-col gap-1.5 min-w-0">
                  <span className="text-[20px] font-semibold text-ink tabular-nums leading-none tracking-[-0.5px]">{st.value}</span>
                  <span className="text-[11.5px] text-ink-3 leading-none truncate">{st.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-hairline bg-surface p-3">
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="text-ink-3">{labels.manualLabel}</span>
                <span className="text-ink-3 line-through decoration-[#f05b8b]/60 text-right">{scenario.manual}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="text-ink font-medium">{labels.assistantLabel}</span>
                <span className="flex items-center gap-1 font-semibold text-[#0e7a3c] dark:text-[#3ddc97]">
                  <Zap className="w-3.5 h-3.5" strokeWidth={2.6} />
                  {scenario.assistant}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <span className={cn("btn-brand flex-1 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold text-white", finished && "press-pulse")}>
                {labels.confirm}
              </span>
              <span className="h-10 px-4 rounded-full border border-hairline-strong bg-surface flex items-center justify-center text-[14px] font-medium text-ink-2">
                {labels.edit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiScenarios() {
  const t = useT().ai.scenarios;
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const count = t.items.length;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Rotate through the scenarios on its own until the visitor picks one. */
  useEffect(() => {
    if (!inView || touched || prefersReducedMotion()) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % count), AUTO_MS);
    return () => window.clearInterval(id);
  }, [inView, touched, count]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <section id="scenarios" ref={hostRef} className="w-full flex flex-col items-center py-16 md:py-24 bg-page scroll-mt-20">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <FadeIn className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible -mx-5 px-5 lg:mx-0 lg:px-0 pb-2 lg:pb-0 snap-x">
            {t.items.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              const accent = ACCENTS[i % ACCENTS.length];
              const isActive = active === i;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative shrink-0 w-[270px] lg:w-full text-left rounded-2xl border p-4 flex gap-3 overflow-hidden snap-start transition-all duration-300",
                    isActive
                      ? "bg-surface border-brand/40 shadow-[0_18px_40px_-24px_rgba(0,122,255,0.55)]"
                      : "bg-surface/70 border-hairline hover:bg-surface hover:border-hairline-strong"
                  )}
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                  </span>
                  <span className="flex flex-col gap-1 min-w-0">
                    <span className={cn("text-[15px] font-semibold leading-[1.25] transition-colors", isActive ? "text-ink" : "text-ink-2")}>{s.title}</span>
                    <span className="text-[13px] text-ink-3 leading-[1.4] line-clamp-2">«{s.request}»</span>
                  </span>
                  {isActive && !touched && (
                    <span
                      aria-hidden
                      className="autoplay-bar absolute left-0 bottom-0 h-[2px] w-full bg-brand/60"
                      style={{ "--autoplay-ms": `${AUTO_MS}ms` } as React.CSSProperties}
                    />
                  )}
                </button>
              );
            })}
          </FadeIn>

          <FadeIn delay={2} variant="scale" className="min-w-0">
            <AiRun key={active} scenario={t.items[active]} labels={t} accent={ACCENTS[active % ACCENTS.length]} run={inView} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
