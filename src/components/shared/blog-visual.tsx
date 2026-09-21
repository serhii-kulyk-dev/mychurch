"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, Check, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ModuleMock from "@/components/shared/module-mock";
import { useCountUp } from "@/components/shared/use-count-up";
import type { BlogVisual as Visual } from "@/content/blog/types";

/* ────────────────────────────────────────────────────────────────
   Картинка в тілі статті: лійка, зведення джерел, графік із ціллю,
   кільце самоперевірки або справжній екран продукту.

   Малюється один раз, коли доїхала до екрана, — той самий клас-вимикач
   `vis-on`, що й у продуктових макетах. Текст картинки живе в статті,
   цей файл відповідає лише за вигляд і рух.
   ──────────────────────────────────────────────────────────────── */

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

/* Чи дозволений рух. Читаємо системну настройку так, щоб перший кадр
   клієнта збігався з тим, що віддав сервер: без руху, а далі — як у людини. */
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useMotionAllowed() {
  return useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(MOTION_QUERY).matches,
    () => false
  );
}

/** Число, яке набігає до свого значення разом із картинкою. */
function Count({ value, run }: { value: number; run: boolean }) {
  return <>{useCountUp(value, run)}</>;
}

function tint(accent: string, percent: number) {
  return `color-mix(in oklab, ${accent} ${percent}%, var(--surface))`;
}

/* ── Доріжка: шлях людини зі зупинками ─────────────────────────
   Дорога веде від першого візиту до останнього етапу, зупинки на ній
   зменшуються разом із кількістю людей, а точка проходить весь шлях —
   видно і напрямок, і де він звужується.

   Дві геометрії з одного списку: на широкому екрані дорога йде хвилею
   зліва направо, на телефоні — згори вниз. */

interface Point {
  x: number;
  y: number;
}

/** Плавна крива через задані точки (Катмулл-Ром у кубічні Безьє). */
function smoothPath(points: Point[]) {
  if (points.length < 2) return "";
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function Road({
  v,
  accent,
  on,
  moving,
  vertical,
  id,
}: {
  v: Extract<Visual, { type: "path" }>;
  accent: string;
  on: boolean;
  moving: boolean;
  vertical: boolean;
  id: string;
}) {
  const count = v.stages.length;
  const max = Math.max(...v.stages.map((s) => s.value));
  const width = vertical ? 320 : 1000;
  const height = vertical ? count * 88 + 28 : 260;

  const points: Point[] = v.stages.map((_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    if (vertical) return { x: i % 2 ? 48 : 28, y: 48 + i * 88 };
    /* Крайні зупинки трохи глибше в картці: підпис ширший за саму зупинку. */
    return { x: 88 + t * (width - 176), y: i % 2 ? 194 : 78 };
  });

  const d = smoothPath(points);
  /* Зупинка тим більша, чим більше людей на етапі. */
  const radius = (value: number) => (vertical ? 9 : 11) + (value / max) * (vertical ? 6 : 11);

  return (
    <div className={["relative", vertical ? "md:hidden" : "hidden md:block"].join(" ")}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible" aria-hidden>
        <defs>
          <path id={id} d={d} fill="none" />
        </defs>
        {/* Полотно дороги */}
        <path d={d} fill="none" stroke={tint(accent, 16)} strokeWidth={vertical ? 13 : 18} strokeLinecap="round" />
        {/* Розмітка: малюється від першої зупинки до останньої */}
        <path
          className="vis-wire"
          d={d}
          pathLength={1}
          fill="none"
          stroke={accent}
          strokeWidth={vertical ? 2 : 2.5}
          strokeLinecap="round"
          strokeOpacity={0.75}
        />
        {points.map((point, i) => (
          <g key={v.stages[i].title}>
            <circle cx={point.x} cy={point.y} r={radius(v.stages[i].value)} fill="var(--surface)" stroke={accent} strokeWidth={2} />
            <circle cx={point.x} cy={point.y} r={radius(v.stages[i].value) - 5} fill={tint(accent, 70 - i * 9)} />
          </g>
        ))}
        {/* Людина, яка йде цим шляхом */}
        {on && moving && (
          <g>
            <circle r={vertical ? 5 : 6} fill={accent} />
            <circle r={vertical ? 11 : 13} fill={accent} opacity={0.18} />
            <animateMotion dur={`${Math.max(5, count * 1.2)}s`} repeatCount="indefinite" rotate="auto">
              {/* xlink:href — для старших WebKit, які не знають SVG2-атрибута href. */}
              <mpath href={`#${id}`} xlinkHref={`#${id}`} />
            </animateMotion>
          </g>
        )}
      </svg>

      {/* Підписи — звичайним текстом поверх дороги, а не всередині SVG */}
      <div className="absolute inset-0">
        {v.stages.map((stage, i) => {
          const point = points[i];
          const drop = i > 0 ? Math.round((1 - stage.value / v.stages[i - 1].value) * 100) : 0;
          const above = point.y > height / 2;
          const common = { left: `${(point.x / width) * 100}%`, top: `${(point.y / height) * 100}%` };

          const value = (
            <span className="flex items-baseline gap-1.5 shrink-0">
              <span className="text-[14.5px] md:text-[15px] font-semibold text-ink tabular-nums leading-none">
                <Count value={stage.value} run={on} />
              </span>
              {drop > 0 && <span className="text-[11.5px] text-ink-3 tabular-nums leading-none">−{drop}%</span>}
            </span>
          );

          if (vertical) {
            return (
              <div key={stage.title} className="absolute left-0 right-0" style={{ top: common.top, transform: "translateY(-50%)" }}>
                <div
                  className="vis-row flex items-baseline justify-between gap-2 pl-[62px] pr-1"
                  style={{ animationDelay: `${220 + i * 120}ms` }}
                >
                  <span className="text-[13.5px] font-medium text-ink leading-[1.25]">{stage.title}</span>
                  {value}
                </div>
              </div>
            );
          }

          return (
            <div
              key={stage.title}
              className="absolute w-[132px]"
              style={{ ...common, transform: above ? "translate(-50%, calc(-100% - 26px))" : "translate(-50%, 26px)" }}
            >
              <div
                className="vis-row flex flex-col items-center gap-1 text-center"
                style={{ animationDelay: `${220 + i * 120}ms` }}
              >
                <span className="text-[13.5px] font-medium text-ink leading-[1.25]">{stage.title}</span>
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PathVisual({ v, accent, on }: { v: Extract<Visual, { type: "path" }>; accent: string; on: boolean }) {
  const id = useId().replace(/:/g, "");
  /* Точка їде дорогою лише там, де рух узагалі доречний. */
  const moving = useMotionAllowed();

  return (
    <div className="flex flex-col gap-3">
      <Road v={v} accent={accent} on={on} moving={moving} vertical={false} id={`road-${id}`} />
      <Road v={v} accent={accent} on={on} moving={moving} vertical id={`road-v-${id}`} />
      <span className="text-[12px] text-ink-3 leading-none">{v.unit}</span>
    </div>
  );
}

/* ── Зведення: п'ять місць і один список ────────────────────────
   Розкидані картки вирівнюються, лінії добігають до картки — це і є
   вся розповідь про «дані в різних місцях». */
function Merge({ v, accent }: { v: Extract<Visual, { type: "merge" }>; accent: string }) {
  const count = v.sources.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,190px)_68px_minmax(0,1fr)] gap-4 md:gap-0 md:items-stretch">
      <div className="flex flex-wrap md:flex-col justify-center gap-2 md:gap-2.5">
        {v.sources.map((source, i) => (
          <span
            key={source}
            className="vis-tilt rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-[12.5px] md:text-[13px] text-ink-2 leading-[1.2]"
            style={{ "--tilt": `${i % 2 ? 1.8 : -2.2}deg`, animationDelay: `${120 + i * 90}ms` } as CSSProperties}
          >
            {source}
          </span>
        ))}
      </div>

      {/* Лінії малюються з кожного джерела в один вузол. На телефоні для
          них немає ширини — там замість них стрілка. */}
      <svg aria-hidden viewBox="0 0 68 100" preserveAspectRatio="none" className="hidden md:block w-full h-full">
        {v.sources.map((source, i) => {
          const y = ((i + 0.5) / count) * 100;
          return (
            <path
              key={source}
              d={`M0 ${y} C 30 ${y}, 34 50, 68 50`}
              className="vis-wire"
              pathLength={1}
              fill="none"
              stroke={accent}
              strokeOpacity={0.55}
              strokeWidth={1.4}
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${300 + i * 90}ms` }}
            />
          );
        })}
      </svg>
      <span aria-hidden className="md:hidden flex justify-center text-ink-3">
        <ArrowDown className="w-5 h-5" strokeWidth={2} />
      </span>

      <div className="rounded-[18px] border border-hairline bg-surface overflow-hidden self-center">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline" style={{ background: tint(accent, 7) }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <span className="text-[13px] font-semibold text-ink leading-none">{v.target.title}</span>
        </div>
        <ul className="flex flex-col">
          {v.target.rows.map((row, i) => (
            <li
              key={row.title}
              className="vis-row flex items-center gap-3 px-4 py-2.5 border-b border-hairline last:border-b-0"
              style={{ animationDelay: `${620 + i * 110}ms` }}
            >
              <span
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-semibold"
                style={{ background: tint(accent, 16), color: accent }}
              >
                {row.title.slice(0, 1)}
              </span>
              <span className="flex-1 min-w-0 text-[13.5px] text-ink leading-[1.3] truncate">{row.title}</span>
              <span className="text-[12px] text-ink-3 leading-none whitespace-nowrap">{row.meta}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Графік: ціль або досягнута, або ні ─────────────────────────── */
function Chart({ v, accent, on }: { v: Extract<Visual, { type: "chart" }>; accent: string; on: boolean }) {
  const ceiling = Math.max(v.goal, ...v.bars.map((b) => b.value)) * 1.22;
  const height = (value: number) => `${(value / ceiling) * 100}%`;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative h-[170px] md:h-[200px] flex items-end gap-2 md:gap-3 pt-7">
        <span
          aria-hidden
          className="vis-line absolute left-0 right-0 border-t border-dashed"
          style={{ bottom: height(v.goal), borderColor: accent, animationDelay: "120ms" }}
        />
        {/* Ліворуч: праворуч позначка накривала підпис останнього стовпчика. */}
        <span
          className="vis-pop absolute left-0 translate-y-1/2 rounded-full px-2.5 py-1 text-[11px] md:text-[11.5px] font-semibold leading-none whitespace-nowrap"
          style={{ bottom: height(v.goal), background: tint(accent, 15), color: accent, animationDelay: "420ms" }}
        >
          {v.goalLabel}
        </span>

        {v.bars.map((bar, i) => {
          const hit = bar.value >= v.goal;
          return (
            <span key={bar.label} className="flex-1 h-full flex flex-col items-center justify-end gap-1.5">
              <span
                className="vis-pop text-[11.5px] md:text-[12.5px] font-semibold leading-none tabular-nums"
                style={{ color: hit ? accent : "var(--ink-3)", animationDelay: `${520 + i * 90}ms` }}
              >
                <Count value={bar.value} run={on} />
              </span>
              <span
                className="vis-bar w-full shrink-0 rounded-t-[7px]"
                style={{
                  height: height(bar.value),
                  background: hit ? accent : tint(accent, 22),
                  animationDelay: `${220 + i * 90}ms`,
                }}
              />
            </span>
          );
        })}
      </div>

      <div className="flex gap-2 md:gap-3 border-t border-hairline pt-2.5">
        {v.bars.map((bar) => (
          <span key={bar.label} className="flex-1 text-center text-[11.5px] md:text-[12.5px] text-ink-3 leading-[1.2]">
            {bar.label}
          </span>
        ))}
      </div>
      <span className="text-[12px] text-ink-3 leading-none">{v.unit}</span>
    </div>
  );
}

/* ── Кільце самоперевірки ───────────────────────────────────────
   П'ять сегментів — п'ять питань. Зафарбовані ті, на які церква вже
   відповідає «так». */
function Score({ v, accent, on }: { v: Extract<Visual, { type: "score" }>; accent: string; on: boolean }) {
  const total = v.items.length;
  const done = v.items.filter((i) => i.ok).length;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  /* Заокруглені кінці «з'їдають» проміжок, тож він має бути помітно більшим
     за саму лінію розриву. */
  const segment = circumference / total - 18;

  return (
    <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
      <div className="relative w-[148px] h-[148px] shrink-0">
        <svg aria-hidden viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          {v.items.map((item, i) => (
            <circle
              key={item.label}
              className="vis-ring"
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              strokeWidth={11}
              strokeLinecap="round"
              stroke={item.ok ? accent : "color-mix(in oklab, var(--ink-3) 26%, var(--surface))"}
              strokeDasharray={`${segment} ${circumference}`}
              transform={`rotate(${(i * 360) / total} 70 70)`}
              style={
                {
                  "--ring-len": `${segment}`,
                  "--ring-off": "0",
                  animationDelay: `${180 + i * 150}ms`,
                } as CSSProperties
              }
            />
          ))}
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-[34px] font-semibold text-ink leading-none tabular-nums">
            <Count value={done} run={on} />
          </span>
          <span className="text-[12.5px] text-ink-3 leading-none">{v.totalLabel}</span>
        </span>
      </div>

      <ul className="flex-1 w-full flex flex-col gap-2">
        {v.items.map((item, i) => (
          <li
            key={item.label}
            className="vis-row flex items-center gap-2.5 text-[13.5px] md:text-[14.5px] leading-[1.3]"
            style={{ animationDelay: `${260 + i * 120}ms` }}
          >
            <span
              className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
              style={
                item.ok
                  ? { background: tint(accent, 16), color: accent }
                  : { background: "color-mix(in oklab, var(--ink-3) 14%, var(--surface))", color: "var(--ink-3)" }
              }
            >
              {item.ok ? <Check className="w-3 h-3" strokeWidth={3} /> : <Minus className="w-3 h-3" strokeWidth={3} />}
            </span>
            <span className={item.ok ? "text-ink" : "text-ink-3"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BlogVisual({
  visual,
  caption,
  accent,
  Icon,
}: {
  visual: Visual;
  caption?: string;
  accent: string;
  Icon: LucideIcon;
}) {
  const { ref, on } = useInView<HTMLElement>();

  /* Екран продукту приходить у власній рамці — обгортати його ще однією
     карткою немає сенсу. */
  if (visual.type === "screen") {
    return (
      <figure className="flex flex-col gap-3 my-1">
        <ModuleMock spec={visual.spec} accent={accent} Icon={Icon} />
        {caption && <figcaption className="text-[13.5px] text-ink-3 leading-[1.5] text-center">{caption}</figcaption>}
      </figure>
    );
  }

  let body: ReactNode;
  switch (visual.type) {
    case "path": body = <PathVisual v={visual} accent={accent} on={on} />; break;
    case "merge": body = <Merge v={visual} accent={accent} />; break;
    case "chart": body = <Chart v={visual} accent={accent} on={on} />; break;
    case "score": body = <Score v={visual} accent={accent} on={on} />; break;
  }

  return (
    <figure ref={ref} className={["flex flex-col gap-3", on ? "vis-on" : ""].join(" ")}>
      <div
        className="rounded-[22px] border border-hairline bg-surface p-5 md:p-7 flex flex-col gap-5 md:gap-6"
        style={{ background: `linear-gradient(150deg, ${tint(accent, 6)}, var(--surface) 60%)` }}
      >
        <span className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: tint(accent, 14), color: accent }}
          >
            <Icon className="w-4 h-4" strokeWidth={2} />
          </span>
          <span className="text-[13.5px] md:text-[15px] font-semibold text-ink leading-[1.3]">{visual.title}</span>
        </span>
        {body}
      </div>
      {caption && <figcaption className="text-[13.5px] text-ink-3 leading-[1.5]">{caption}</figcaption>}
    </figure>
  );
}
