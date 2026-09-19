"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileSpreadsheet } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { MODULE_ICONS, moduleAccent } from "@/components/shared/module-icons";
import { IMPORT_COPY } from "@/content/import";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Колонки файлу зліва, модулі системи справа, між ними — дроти.
   Геометрія фіксована: рядок файлу 56px, рядок модуля 112px, тому
   кінці дротів завжди сходяться з центрами рядків. Наведення на
   будь-який бік підсвічує всю пару.
   ──────────────────────────────────────────────────────────────── */

const ROW_H = 56;
const WIRE_W = 96;
const MID = WIRE_W / 2;
const R = 10;

/* Порядок збігається з `mapping.targets` у копії — обидві мови. */
const TARGET_IDS = ["people", "family", "groups", "ministries"];

function wire(y1: number, y2: number) {
  if (Math.abs(y1 - y2) < 1) return `M 0 ${y1} H ${WIRE_W}`;
  const s = y2 > y1 ? 1 : -1;
  return `M 0 ${y1} H ${MID - R} Q ${MID} ${y1} ${MID} ${y1 + s * R} V ${y2 - s * R} Q ${MID} ${y2} ${MID + R} ${y2} H ${WIRE_W}`;
}

export default function ImportMapping() {
  const { lang } = useLang();
  const c = IMPORT_COPY[lang].mapping;
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [hoverTarget, setHoverTarget] = useState<number | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const targetOf = (moduleName: string) => c.targets.findIndex((t) => t.module === moduleName);
  const rightH = (c.columns.length * ROW_H) / c.targets.length;
  const totalH = c.columns.length * ROW_H;

  /* Пара «колонка ↔ модуль» підсвічена, якщо навели на будь-який її бік. */
  const colActive = (i: number) =>
    hoverCol === i || (hoverTarget !== null && targetOf(c.columns[i].module) === hoverTarget);
  const targetActive = (j: number) =>
    hoverTarget === j || (hoverCol !== null && targetOf(c.columns[hoverCol].module) === j);
  const idle = hoverCol === null && hoverTarget === null;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-b border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading align="left" eyebrow={c.eyebrow} title={c.title} text={c.text} />

        {/* Десктоп — схема з дротами */}
        <FadeIn className="hidden md:block">
          <div
            ref={canvasRef}
            className="grid items-start"
            style={{ gridTemplateColumns: `minmax(0,1fr) ${WIRE_W}px minmax(0,360px)` }}
          >
            {/* Заголовки трьох колонок — щоб рядки нижче збігались по висоті */}
            <div className="h-11 flex items-center gap-2 px-4 rounded-t-2xl border border-b-0 border-hairline bg-surface-2">
              <FileSpreadsheet className="w-[15px] h-[15px] text-ink-3 shrink-0" strokeWidth={1.9} />
              <span className="text-[13px] font-semibold text-ink leading-none truncate">{c.fileName}</span>
              <span className="text-[11.5px] text-ink-3 leading-none ml-auto shrink-0">{c.fileLabel}</span>
            </div>
            <div className="h-11" />
            <div className="h-11 flex items-center px-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">{c.targetLabel}</span>
            </div>

            {/* Ліва колонка — рядки файлу */}
            <div className="rounded-b-2xl border border-hairline bg-surface overflow-hidden">
              {c.columns.map((col, i) => {
                const accent = moduleAccent(TARGET_IDS[targetOf(col.module)] ?? "people");
                const active = colActive(i);
                return (
                  <div
                    key={col.head}
                    onMouseEnter={() => setHoverCol(i)}
                    onMouseLeave={() => setHoverCol(null)}
                    className="flex items-center gap-3 px-4 border-b border-hairline last:border-b-0 transition-colors duration-200"
                    style={{
                      height: ROW_H,
                      background: active ? `color-mix(in oklab, ${accent} 9%, var(--surface))` : "var(--surface)",
                    }}
                  >
                    <span
                      className="text-[13px] font-semibold leading-none shrink-0 w-[92px] truncate transition-colors duration-200"
                      style={{ color: active ? accent : "var(--ink)" }}
                    >
                      {col.head}
                    </span>
                    <span className="text-[13px] text-ink-2 leading-none truncate flex-1 min-w-0">{col.sample}</span>
                    <span
                      className={cn(
                        "text-[12px] leading-none shrink-0 transition-opacity duration-200 hidden lg:inline",
                        active ? "opacity-100" : "opacity-0"
                      )}
                      style={{ color: accent }}
                    >
                      {col.field}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Дроти */}
            <svg
              width={WIRE_W}
              height={totalH}
              viewBox={`0 0 ${WIRE_W} ${totalH}`}
              fill="none"
              aria-hidden
              className="overflow-visible"
            >
              {c.columns.map((col, i) => {
                const j = targetOf(col.module);
                const accent = moduleAccent(TARGET_IDS[j] ?? "people");
                /* +1 — обидві картки мають рамку в 1px, з нею центри рядків збігаються */
                const y1 = i * ROW_H + ROW_H / 2 + 1;
                const y2 = j * rightH + rightH / 2 + 1;
                const active = colActive(i);
                const stroke = active ? accent : `color-mix(in oklab, ${accent} 42%, transparent)`;
                return (
                  <g key={col.head}>
                    <path
                      d={wire(y1, y2)}
                      stroke={stroke}
                      strokeWidth={active ? 2 : 1.4}
                      pathLength={1}
                      className={on ? "flow-wire-on" : undefined}
                      style={on ? { animationDelay: `${160 + i * 90}ms` } : undefined}
                    />
                    <circle cx={0} cy={y1} r={2.6} fill={stroke} />
                    <circle cx={WIRE_W} cy={y2} r={2.6} fill={stroke} />
                  </g>
                );
              })}
            </svg>

            {/* Права колонка — модулі системи */}
            <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
              {c.targets.map((tg, j) => {
                const id = TARGET_IDS[j];
                const Icon = MODULE_ICONS[id];
                const accent = moduleAccent(id);
                const active = targetActive(j);
                const hoveredField = hoverCol !== null ? c.columns[hoverCol].field : null;
                return (
                  <div
                    key={tg.module}
                    onMouseEnter={() => setHoverTarget(j)}
                    onMouseLeave={() => setHoverTarget(null)}
                    className={cn(
                      "flex flex-col justify-center gap-2 px-4 border-b border-hairline last:border-b-0 transition-all duration-200",
                      active || idle ? "opacity-100" : "opacity-55"
                    )}
                    style={{
                      height: rightH,
                      background: active ? `color-mix(in oklab, ${accent} 7%, var(--surface))` : "var(--surface)",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white"
                        style={{ background: accent }}
                      >
                        {Icon && <Icon className="w-[14px] h-[14px]" strokeWidth={2.1} />}
                      </span>
                      <span className="text-[14.5px] font-semibold text-ink leading-none">{tg.module}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tg.fields.map((f) => {
                        const lit = hoveredField === f;
                        return (
                          <span
                            key={f}
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-[11.5px] leading-none whitespace-nowrap transition-colors duration-200 border",
                              lit
                                ? "border-transparent text-white"
                                : "border-hairline bg-surface-2 text-ink-2"
                            )}
                            style={lit ? { background: accent } : undefined}
                          >
                            {f}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Мобільний — той самий зміст списком */}
        <div className="md:hidden flex flex-col rounded-2xl border border-hairline bg-surface overflow-hidden">
          <div className="flex items-center gap-2 px-4 h-11 bg-surface-2 border-b border-hairline">
            <FileSpreadsheet className="w-[15px] h-[15px] text-ink-3 shrink-0" strokeWidth={1.9} />
            <span className="text-[13px] font-semibold text-ink leading-none truncate">{c.fileName}</span>
          </div>
          {c.columns.map((col) => {
            const j = targetOf(col.module);
            const accent = moduleAccent(TARGET_IDS[j] ?? "people");
            return (
              <div key={col.head} className="flex flex-col gap-1.5 px-4 py-3 border-b border-hairline last:border-b-0">
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="text-[13px] font-semibold text-ink leading-none shrink-0">{col.head}</span>
                  <span className="text-[12.5px] text-ink-3 leading-none truncate">{col.sample}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <ArrowRight className="w-[13px] h-[13px] shrink-0" strokeWidth={2} style={{ color: accent }} />
                  <span className="text-[12.5px] leading-none truncate" style={{ color: accent }}>
                    {col.module} · {col.field}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 max-w-[760px]">
          <FadeIn delay={1}>
            <p className="text-[15px] text-ink-2 leading-[1.55]">{c.fix}</p>
          </FadeIn>
          <FadeIn delay={2}>
            <p className="text-[14.5px] text-ink-3 leading-[1.55] pl-4 border-l-2 border-brand/40">{c.note}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
