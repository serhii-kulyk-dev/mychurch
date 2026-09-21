"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BarChart3, CalendarCheck, Check, FileBarChart, FileDown, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useT } from "@/lib/lang";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useCountUp } from "@/components/shared/use-count-up";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

/* The analytics block is one screen whose chart keeps changing. Three views,
   three shapes, three colours — bars, a line, a donut — and each one also
   plays itself out, so the motion shows how the numbers are read. */

type Block = Dict["features"]["blocks"][number];
type Tone = "up" | "warn";

const CYCLE_MS = 3600;
const BLUE = "var(--brand)";
const GREEN = "#12a150";
const VIOLET = "#8b5bf0";
const SKY = "#0ea5e9";
const AMBER = "#f59e0b";
const PINK = "#e0559b";

/* Every view owns a colour: the chip, the card icon and the progress bar follow it. */
const VIEWS = [
  { icon: CalendarCheck, color: BLUE },
  { icon: TrendingUp, color: GREEN },
  { icon: FileBarChart, color: VIOLET },
];
const SERIES_COLORS = [BLUE, VIOLET];
const KPI_COLORS = [BLUE, GREEN, AMBER];
const SLICE_COLORS = [VIOLET, BLUE, SKY, PINK];
const STAT_COLORS = [GREEN, SKY, AMBER];
const TONE_TEXT: Record<Tone, string> = {
  up: "text-[#0e7a3c] dark:text-[#3ddc97]",
  warn: "text-[#d97a00] dark:text-[#ffb340]",
};
const EASE = "cubic-bezier(0.16,0.84,0.44,1)";

/* Numbers live here; every label comes from the dictionary (same index). */
const ATTENDANCE = {
  kpis: [312, 24, 7],
  tones: ["up", "up", "warn"] as Tone[],
  services: [148, 156, 151, 167, 172],
  groups: [96, 102, 99, 111, 118],
  prevAvg: 154,
  max: 180,
};
const GROWTH = {
  totals: [254, 261, 270, 283, 297, 312],
  stats: [24, 9, 7],
  tones: ["up", "up", "warn"] as Tone[],
};
const REPORT = { total: 312, slices: [42, 27, 18, 13] };

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* Walks through `count` slots every `ms`, starting after `delay`; -1 until it
   starts. `loop` goes back to the first slot, otherwise it rests on the last. */
function useStep(count: number, ms: number, delay = 0, loop = false) {
  const [i, setI] = useState(-1);
  useEffect(() => {
    if (prefersReducedMotion()) {
      const skip = setTimeout(() => setI(count - 1), 0);
      return () => clearTimeout(skip);
    }
    let tick: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setI(0);
      tick = setInterval(() => setI((p) => (p + 1 >= count ? (loop ? 0 : p) : p + 1)), ms);
    }, delay);
    return () => {
      clearTimeout(start);
      if (tick) clearInterval(tick);
    };
  }, [count, ms, delay, loop]);
  return i;
}

/* A smooth line through the points (Catmull-Rom as beziers). */
function smoothPath(pts: { x: number; y: number }[]) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }
  return d;
}

/* ── View 1: attendance — the weeks read themselves out ──────── */
function Kpi({ label, value, delta, tone, color, delay }: { label: string; value: number; delta: string; tone: Tone; color: string; delay: number }) {
  const shown = useCountUp(value, true, 650);
  return (
    <div
      className="mock-pop min-w-0 rounded-xl bg-surface-2 border border-hairline px-2 sm:px-3 py-2.5 flex flex-col gap-1.5"
      style={{ animationDelay: `${delay}ms`, borderTop: `2px solid ${color}` }}
    >
      <span className="text-[10.5px] sm:text-[11px] text-ink-3 leading-none truncate">{label}</span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-[22px] font-semibold leading-none tracking-[-0.5px] tabular-nums" style={{ color }}>{shown}</span>
        <span className={cn("text-[11px] font-medium leading-none", TONE_TEXT[tone])}>{delta}</span>
      </span>
    </div>
  );
}

function AttendanceView({ t }: { t: Dict["features"]["mocks"]["analytics"]["attendance"] }) {
  const d = ATTENDANCE;
  const auto = useStep(d.services.length, 520, 350, true);
  const [manual, setManual] = useState<number | null>(null);
  const active = manual ?? (auto >= 0 ? auto : null);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {t.kpis.map((label, i) => (
          <Kpi key={label} label={label} value={d.kpis[i]} delta={t.deltas[i]} tone={d.tones[i]} color={KPI_COLORS[i]} delay={60 + i * 60} />
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-end gap-2.5 text-[10.5px] text-ink-3 leading-none">
          {t.series.map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-[3px]" style={{ background: SERIES_COLORS[i] }} />
              {s}
            </span>
          ))}
          <span className="flex items-center gap-1">
            <span className="w-3 border-t border-dashed border-ink-3" />
            {t.prevMonth}
          </span>
        </div>
        <div
          className="relative h-[124px] flex items-end gap-2.5 sm:gap-3"
          onPointerLeave={(e) => e.pointerType === "mouse" && setManual(null)}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="absolute left-0 right-0 border-t border-hairline" style={{ bottom: `${(i / 2) * 100}%` }} />
          ))}
          <span
            className="mock-area absolute left-0 right-0 border-t border-dashed z-[1] pointer-events-none"
            style={{ bottom: `${(d.prevAvg / d.max) * 100}%`, borderColor: "color-mix(in oklab, var(--ink) 45%, transparent)", animationDelay: "600ms" }}
          >
            <span className="absolute right-0 -top-[13px] text-[9.5px] text-ink-3 leading-none tabular-nums">{d.prevAvg}</span>
          </span>
          {d.services.map((v, i) => {
            const g = d.groups[i];
            const on = active === i;
            const top = (Math.max(v, g) / d.max) * 100;
            /* Tall bars leave no room above — the readout drops just under the top instead. */
            const place: CSSProperties = top > 62 ? { top: `calc(${100 - top}% + 6px)` } : { bottom: `calc(${top}% + 8px)` };
            return (
              <div
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`${t.weeks[i]}: ${t.series[0]} ${v}, ${t.series[1]} ${g}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setManual(i)}
                onClick={(e) => {
                  e.preventDefault();
                  setManual((w) => (w === i ? null : i));
                }}
                onFocus={() => setManual(i)}
                onBlur={() => setManual(null)}
                className="relative flex-1 h-full flex items-end justify-center gap-[3px] cursor-pointer outline-none transition-opacity duration-300"
                style={{ opacity: active !== null && !on ? 0.5 : 1 }}
              >
                <span className="mock-bar w-full max-w-[18px] rounded-[4px] origin-bottom" style={{ height: `${(v / d.max) * 100}%`, background: SERIES_COLORS[0], animationDelay: `${180 + i * 50}ms` }} />
                <span className="mock-bar w-full max-w-[18px] rounded-[4px] origin-bottom" style={{ height: `${(g / d.max) * 100}%`, background: SERIES_COLORS[1], animationDelay: `${215 + i * 50}ms` }} />
                {on && (
                  <div
                    className={cn(
                      "pin-in absolute z-10 rounded-lg bg-ink text-surface px-2 py-1.5 flex flex-col gap-1 whitespace-nowrap shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] pointer-events-none",
                      i === 0 ? "left-0" : i === d.services.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
                    )}
                    style={place}
                  >
                    <span className="text-[10px] font-semibold leading-none opacity-80 tabular-nums">{t.weeks[i]}</span>
                    {[v, g].map((n, k) => (
                      <span key={k} className="flex items-center gap-1.5 text-[11px] leading-none tabular-nums">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: SERIES_COLORS[k] }} />
                        {t.series[k]} <b className="font-semibold">{n}</b>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2.5 sm:gap-3">
          {t.weeks.map((w, i) => (
            <span key={w} className={cn("flex-1 text-center text-[10px] leading-none tabular-nums transition-colors duration-300", active === i ? "text-ink font-semibold" : "text-ink-3")}>{w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── View 2: growth — the number climbs with the line ────────── */
const W = 300, H = 118, PAD = 6;

function GrowthView({ t }: { t: Dict["features"]["mocks"]["analytics"]["growth"] }) {
  const n = GROWTH.totals.length;
  const step = useStep(n, 170, 150);
  const at = step < 0 ? 0 : step;
  const total = useCountUp(GROWTH.totals[at], true, 220);
  const lo = 240, hi = 325;
  const pts = GROWTH.totals.map((v, i) => ({
    x: PAD + (i / (n - 1)) * (W - PAD * 2),
    y: PAD + (1 - (v - lo) / (hi - lo)) * (H - PAD * 2),
  }));
  const line = smoothPath(pts);
  const head = pts[at];
  const done = step >= n - 1;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-end justify-between gap-3">
        <span className="flex flex-col gap-1.5 min-w-0">
          <span className="text-[11px] text-ink-3 leading-none truncate">{t.totalLabel}</span>
          <span className="text-[30px] font-semibold leading-none tracking-[-1px] tabular-nums" style={{ color: GREEN }}>{total}</span>
        </span>
        <span
          className={cn("flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11.5px] font-medium leading-none transition-all duration-300", TONE_TEXT.up)}
          style={{ background: `color-mix(in oklab, ${GREEN} 12%, var(--surface))`, opacity: done ? 1 : 0, transform: done ? "none" : "translateY(4px)" }}
        >
          <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.4} />{t.delta}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-[118px] overflow-visible" role="img" aria-label={t.totalLabel}>
          <defs>
            <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0.3" />
              <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((f) => (
            <line key={f} x1="0" x2={W} y1={PAD + f * (H - PAD * 2)} y2={PAD + f * (H - PAD * 2)} stroke="var(--hairline)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <path className="mock-area" d={`${line} L ${pts[n - 1].x} ${H} L ${pts[0].x} ${H} Z`} fill="url(#growth-fill)" style={{ animationDelay: "350ms" }} />
          <path className="mock-line" d={line} fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} style={{ strokeDasharray: 1, animationDuration: `${n * 170}ms`, animationDelay: "150ms" }} />
          {/* the head of the line — it moves month by month as the line is drawn */}
          <line x1={head.x} x2={head.x} y1={PAD} y2={H - PAD} stroke={GREEN} strokeWidth="1" strokeDasharray="3 3" opacity={done ? 0 : 0.35} vectorEffect="non-scaling-stroke" style={{ transition: `all 200ms ${EASE}` }} />
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y} r={i === at ? 4.5 : 3}
              fill="var(--surface)" stroke={GREEN} strokeWidth="2.5" vectorEffect="non-scaling-stroke"
              opacity={i <= at ? 1 : 0}
              style={{ transition: `opacity 160ms linear, r 200ms ${EASE}` }}
            />
          ))}
        </svg>
        <div className="flex">
          {t.months.map((m, i) => (
            <span key={m} className={cn("flex-1 text-center text-[10px] leading-none transition-colors duration-300", i === at ? "text-ink font-semibold" : "text-ink-3")}>{m}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {t.stats.map((label, i) => (
          <div
            key={label}
            className="mock-row rounded-xl border px-2.5 py-2 flex flex-col gap-1.5"
            style={{
              animationDelay: `${1000 + i * 90}ms`,
              background: `color-mix(in oklab, ${STAT_COLORS[i]} 8%, var(--surface-2))`,
              borderColor: `color-mix(in oklab, ${STAT_COLORS[i]} 24%, transparent)`,
            }}
          >
            <span className="text-[10.5px] text-ink-3 leading-none truncate">{label}</span>
            <span className="flex items-center gap-1 text-[16px] font-semibold leading-none tabular-nums" style={{ color: STAT_COLORS[i] }}>
              {GROWTH.tones[i] === "up" ? <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.6} /> : <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.6} />}
              {GROWTH.tones[i] === "up" ? "+" : "−"}{GROWTH.stats[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── View 3: the board report — the donut reads out its slices ── */
function ReportView({ t }: { t: Dict["features"]["mocks"]["analytics"]["report"] }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const R = 34, C = 2 * Math.PI * R;
  const reading = useStep(REPORT.slices.length + 1, 520, 300, true);
  const slice = reading >= 0 && reading < REPORT.slices.length ? reading : null;
  const center = slice === null ? REPORT.total : Math.round((REPORT.total * REPORT.slices[slice]) / 100);
  const shown = useCountUp(center, true, 320);

  /* The export runs itself once the view is up — that is the whole point of it. */
  useEffect(() => {
    const a = setTimeout(() => setState("busy"), 1400);
    const b = setTimeout(() => setState("done"), 2100);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const offsets = REPORT.slices.map((_, i) => REPORT.slices.slice(0, i).reduce((a, x) => a + x, 0));
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none">{t.caption}</span>
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="relative w-[92px] h-[92px] sm:w-[112px] sm:h-[112px] shrink-0 mock-pop" style={{ animationDelay: "60ms" }}>
          <svg viewBox="0 0 96 96" className="w-full h-full">
            <circle cx="48" cy="48" r={R} fill="none" stroke="var(--hairline)" strokeWidth="12" />
            {REPORT.slices.map((pct, i) => (
              <circle
                key={i}
                cx="48" cy="48" r={R} fill="none" stroke={SLICE_COLORS[i]}
                strokeWidth={slice === i ? 15 : 12}
                opacity={slice === null || slice === i ? 1 : 0.4}
                transform="rotate(-90 48 48)"
                strokeDasharray={`${(pct / 100) * C} ${C}`}
                strokeDashoffset={-(offsets[i] / 100) * C}
                className="mock-ring"
                style={{ ["--ring-len" as string]: `${C}`, ["--ring-off" as string]: `${-(offsets[i] / 100) * C}`, animationDelay: `${160 + i * 120}ms`, transition: `stroke-width 220ms ${EASE}, opacity 220ms linear` } as CSSProperties}
              />
            ))}
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-3 text-center">
            <span
              className="text-[19px] font-semibold leading-none tracking-[-0.5px] tabular-nums transition-colors duration-300"
              style={{ color: slice === null ? "var(--ink)" : SLICE_COLORS[slice] }}
            >
              {shown}
            </span>
            <span key={slice} className="pin-in text-[9.5px] text-ink-3 leading-[1.2] truncate max-w-full">{slice === null ? t.totalLabel : t.slices[slice]}</span>
          </span>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {t.slices.map((label, i) => (
            <span
              key={label}
              className={cn("mock-row flex items-center gap-2 rounded-lg -mx-1.5 px-1.5 py-1 text-[12px] leading-none transition-colors duration-300", slice === i ? "text-ink" : "text-ink-2")}
              style={{ animationDelay: `${280 + i * 80}ms`, background: slice === i ? `color-mix(in oklab, ${SLICE_COLORS[i]} 11%, transparent)` : "transparent" }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SLICE_COLORS[i] }} />
              <span className="truncate">{label}</span>
              <span className="ml-auto tabular-nums text-ink font-medium shrink-0">{Math.round((REPORT.total * REPORT.slices[i]) / 100)}</span>
              <span className="tabular-nums text-ink-3 w-[34px] text-right shrink-0">{REPORT.slices[i]}%</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {[t.pdf, t.excel].map((label, i) => (
          <span
            key={label}
            className={cn(
              "mock-pop flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium leading-none transition-colors duration-300",
              i === 0
                ? state === "done" ? "text-white" : "btn-brand"
                : "border border-hairline-strong text-ink-2"
            )}
            style={{ animationDelay: `${600 + i * 90}ms`, ...(i === 0 && state === "done" ? { background: GREEN } : null) }}
          >
            {i === 0 && state === "busy" ? <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2.2} /> : i === 0 && state === "done" ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <FileDown className="w-3.5 h-3.5" strokeWidth={2.2} />}
            {i === 0 ? (state === "busy" ? t.exporting : state === "done" ? t.exported : label) : label}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-ink-3 leading-none">{t.note}</span>
      </div>
    </div>
  );
}

/* ── The block: story on the left, the rotating screen on the right ── */
export default function AnalyticsShowcase({ block, tint }: { block: Block; tint: string }) {
  const t = useT().features.mocks.analytics;
  const { ref, inView } = useInView<HTMLElement>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  /* One label per view, never more: the dictionary must not be able to ask
     for a chart that does not exist. */
  const views = block.points.slice(0, VIEWS.length);
  const accent = VIEWS[active].color;

  useEffect(() => {
    if (!inView || paused || prefersReducedMotion()) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % views.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [inView, paused, active, views.length]);

  return (
    <article ref={ref} className="overflow-hidden rounded-[24px] md:rounded-[28px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      {/* Розповідь праворуч: екран стоїть ліворуч, щоб блоки огляду
          й далі йшли шахівницею (перед цим «Планування» і «Аналітика»
          обидва мали екран праворуч). */}
      <div className="flex flex-col justify-center gap-3 p-7 md:p-10 md:order-2">
        {/* Кегль той самий, що в решти блоків огляду (features.tsx): у аналітики
            був свій, менший — і назва модуля випадала з ряду. */}
        <h3 className="font-semibold text-ink text-[34px] sm:text-[48px] md:text-[64px] leading-[1.0] tracking-[-1px] md:tracking-[-2.2px]">{block.title}</h3>
        <p className="text-[16.5px] md:text-[18px] font-normal text-ink-2 leading-[1.5]">{block.text}</p>

      </div>

      {/* The screen: same chrome, a different chart every few seconds */}
      <div
        className="relative flex items-center justify-center min-h-[280px] md:min-h-[440px] p-5 md:p-8 md:order-1"
        style={{ background: tint }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      >
        <div className="w-full max-w-[420px] flex flex-col items-center">
          <div className="w-full rounded-[20px] bg-surface border border-hairline shadow-[0_30px_60px_-30px_rgba(0,50,120,0.35)] p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center transition-colors duration-300"
                  style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                >
                  <BarChart3 className="w-4 h-4" strokeWidth={2.2} />
                </span>
                <span className="flex flex-col gap-1 min-w-0">
                  <span className="text-[14px] font-semibold text-ink leading-none truncate">{t.title}</span>
                  <span className="text-[11px] text-ink-3 leading-none truncate">{t.subtitle}</span>
                </span>
              </span>
              <span className="flex items-center gap-1 shrink-0">
                {views.map((v, i) => (
                  <span key={v} aria-hidden className="h-[5px] rounded-full transition-all duration-300" style={{ width: i === active ? 16 : 5, background: i === active ? VIEWS[i].color : "var(--hairline-strong)" }} />
                ))}
              </span>
            </div>

            <div key={active} className={cn("min-h-[272px] flex flex-col justify-center", inView && "mock-on view-in")}>
              {active === 0 && <AttendanceView t={t.attendance} />}
              {active === 1 && <GrowthView t={t.growth} />}
              {active === 2 && <ReportView t={t.report} />}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
