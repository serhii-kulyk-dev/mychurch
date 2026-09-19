"use client";

import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  HeartHandshake,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import { useCountUp } from "@/components/shared/use-count-up";
import { useT } from "@/lib/lang";

/* Design canvas — the whole mock is laid out at these exact pixels
   and then uniformly scaled to whatever width the frame gets. */
const CANVAS_W = 960;
const CANVAS_H = 592;

const NAV_ICONS = [LayoutDashboard, Users, UsersRound, HeartHandshake, CalendarDays, BarChart3];
const STAT_VALUES = [428, 23, 9];
const BARS = [52, 64, 58, 71, 66, 79, 74, 88];
const WEEKS = ["3.03", "10.03", "17.03", "24.03", "31.03", "7.04", "14.04", "21.04"];
const ATTENTION_COLORS = ["#f0825b", "#5b8af0", "#8b5bf0", "#f05b8b"];
const GROUP_PCT = [92, 78, 85];

function StatCard({
  label,
  value,
  trend,
  run,
  delay,
}: {
  label: string;
  value: number;
  trend: string;
  run: boolean;
  delay: number;
}) {
  const shown = useCountUp(value, run);
  return (
    <div
      className="mock-pop flex-1 rounded-[12px] bg-surface border border-hairline px-[16px] py-[13px] flex flex-col gap-[6px]"
      style={{ animationDelay: `${delay}ms`, boxShadow: "0 1px 2px var(--hairline)" }}
    >
      <span className="text-[12px] text-ink-3 leading-none">{label}</span>
      <div className="flex items-end gap-[8px]">
        <span className="text-[26px] font-semibold text-ink leading-none tracking-[-0.6px] tabular-nums">
          {shown}
        </span>
        <span className="text-[11px] font-medium text-[#0e7a3c] dark:text-[#3ddc97] leading-none pb-[3px]">
          {trend}
        </span>
      </div>
    </div>
  );
}

export default function AppPreview() {
  const all = useT();
  const t = all.preview;
  const hostRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  /* Uniform scale: the mock is authored at 960×592 and scaled to fit. */
  useEffect(() => {
    const host = hostRef.current;
    const inner = innerRef.current;
    if (!host || !inner) return;
    const apply = () => {
      inner.style.transform = `scale(${host.clientWidth / CANVAS_W})`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  /* Start the in-mock animations once the frame is on screen. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const ringLen = 2 * Math.PI * 34;
  const ringOff = ringLen * (1 - 0.87);

  return (
    <div ref={hostRef} className="w-full h-full overflow-hidden bg-surface" aria-hidden>
      <div
        ref={innerRef}
        className={run ? "mock-on" : undefined}
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transformOrigin: "top left",
          willChange: "transform",
        }}
      >
        {/* ── Window chrome ─────────────────────────────── */}
        <div className="h-[40px] w-full bg-surface-2 border-b border-hairline flex items-center px-[16px] gap-[10px]">
          <div className="flex gap-[6px]">
            <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="h-[22px] min-w-[240px] rounded-[6px] bg-surface-3 flex items-center justify-center gap-[6px] px-[12px]">
              <span className="w-[8px] h-[8px] rounded-full bg-[#12a150]" />
              <span className="text-[11px] text-ink-3 leading-none">{t.url}</span>
            </div>
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="w-[20px] h-[20px] rounded-full bg-surface-3" />
            <span className="w-[20px] h-[20px] rounded-full bg-brand" />
          </div>
        </div>

        <div className="flex h-[552px]">
          {/* ── Sidebar ─────────────────────────────────── */}
          <aside className="w-[196px] shrink-0 border-r border-hairline bg-surface-2 px-[12px] py-[14px] flex flex-col gap-[14px]">
            <div className="flex items-center gap-[9px] px-[8px]">
              <span className="text-[14px] font-semibold text-ink leading-none">{all.common.brand}</span>
            </div>

            <div className="flex flex-col gap-[2px]">
              {t.nav.map((label, i) => {
                const Icon = NAV_ICONS[i];
                const active = i === 0;
                return (
                  <div
                    key={label}
                    className={[
                      "mock-row h-[32px] rounded-[8px] px-[10px] flex items-center gap-[9px]",
                      /* Активний пункт несе білий текст — заливка темніша за --brand. */
                      active ? "bg-[var(--cta-default)]" : "",
                    ].join(" ")}
                    style={{ animationDelay: `${120 + i * 45}ms` }}
                  >
                    <Icon
                      className={[
                        "w-[14px] h-[14px] shrink-0",
                        active ? "text-white" : "text-ink-3",
                      ].join(" ")}
                      strokeWidth={2}
                    />
                    <span
                      className={[
                        "text-[13px] leading-none",
                        active ? "text-white font-medium" : "text-ink-2",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto rounded-[10px] bg-surface border border-hairline p-[12px] flex flex-col gap-[6px]">
              <span className="text-[11px] text-ink-3 leading-none">{t.nextEvent}</span>
              <span className="text-[12px] font-medium text-ink leading-[1.3]">{t.nextEventName}</span>
              <span className="text-[11px] text-brand leading-none">{t.nextEventTime}</span>
            </div>
          </aside>

          {/* ── Main ────────────────────────────────────── */}
          <main className="flex-1 p-[22px] flex flex-col gap-[14px] bg-surface">
            <div className="h-[36px] flex items-center justify-between">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[17px] font-semibold text-ink leading-none tracking-[-0.3px]">
                  {t.title}
                </span>
                <span className="text-[11px] text-ink-3 leading-none">{t.updated}</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="h-[28px] px-[12px] rounded-full border border-hairline-strong flex items-center">
                  <span className="text-[12px] text-ink-2 leading-none">{t.month}</span>
                </div>
                <div className="h-[28px] px-[14px] rounded-full btn-brand flex items-center">
                  <span className="text-[12px] font-medium text-white leading-none">{t.addPerson}</span>
                </div>
              </div>
            </div>

            {/* Stat row */}
            <div className="flex gap-[12px] h-[78px]">
              {t.stats.map((s, i) => (
                <StatCard
                  key={s.label}
                  label={s.label}
                  value={STAT_VALUES[i]}
                  trend={s.trend}
                  run={run}
                  delay={80 + i * 80}
                />
              ))}
            </div>

            {/* Chart + side column */}
            <div className="flex gap-[14px] flex-1">
              {/* Attendance chart */}
              <div className="w-[452px] rounded-[12px] bg-surface border border-hairline p-[16px] flex flex-col shadow-[0_1px_2px_var(--hairline)]">
                <div className="flex items-start justify-between mb-[14px]">
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[13px] font-semibold text-ink leading-none">{t.attendance}</span>
                    <span className="text-[11px] text-ink-3 leading-none">{t.attendanceSub}</span>
                  </div>
                  <div className="relative w-[76px] h-[76px] shrink-0">
                    <svg width="76" height="76" viewBox="0 0 76 76">
                      <circle cx="38" cy="38" r="34" fill="none" stroke="var(--hairline)" strokeWidth="7" />
                      <circle
                        className="mock-ring"
                        cx="38"
                        cy="38"
                        r="34"
                        fill="none"
                        stroke="var(--brand)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        transform="rotate(-90 38 38)"
                        strokeDasharray={ringLen}
                        strokeDashoffset={ringLen}
                        style={
                          {
                            "--ring-len": `${ringLen}`,
                            "--ring-off": `${ringOff}`,
                            animationDelay: "320ms",
                          } as React.CSSProperties
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[16px] font-semibold text-ink leading-none tabular-nums">87%</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex gap-[10px]">
                  {BARS.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-[7px]">
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className="mock-bar w-full rounded-[5px] origin-bottom"
                          style={{
                            height: `${h}%`,
                            background:
                              i === BARS.length - 1
                                ? "linear-gradient(180deg, color-mix(in oklab, var(--brand) 82%, white), var(--brand))"
                                : "linear-gradient(180deg, color-mix(in oklab, var(--brand) 32%, var(--surface)), color-mix(in oklab, var(--brand) 22%, var(--surface)))",
                            animationDelay: `${300 + i * 70}ms`,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-ink-3 leading-none">{WEEKS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs attention + groups */}
              <div className="flex-1 flex flex-col gap-[14px]">
                <div className="rounded-[12px] bg-surface border border-hairline p-[14px] flex flex-col gap-[10px] shadow-[0_1px_2px_var(--hairline)]">
                  <div className="flex items-center gap-[7px]">
                    <span className="relative flex w-[7px] h-[7px]">
                      <span className="pulse-ring absolute inset-0 rounded-full bg-[#ff9500]" />
                      <span className="relative w-[7px] h-[7px] rounded-full bg-[#ff9500]" />
                    </span>
                    <span className="text-[13px] font-semibold text-ink leading-none">{t.attention}</span>
                  </div>
                  <div className="flex flex-col gap-[9px]">
                    {t.attentionRows.map((p, i) => (
                      <div
                        key={p.name}
                        className="mock-row flex items-center gap-[9px]"
                        style={{ animationDelay: `${420 + i * 90}ms` }}
                      >
                        <div
                          className="w-[24px] h-[24px] rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-semibold"
                          style={{ backgroundColor: ATTENTION_COLORS[i] }}
                        >
                          {p.name[0]}
                        </div>
                        <div className="flex flex-col gap-[2px] min-w-0">
                          <span className="text-[11.5px] font-medium text-ink leading-none truncate">{p.name}</span>
                          <span className="text-[10px] text-ink-3 leading-none">{p.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 rounded-[12px] bg-surface border border-hairline p-[14px] flex flex-col gap-[10px] shadow-[0_1px_2px_var(--hairline)]">
                  <span className="text-[13px] font-semibold text-ink leading-none">{t.groups}</span>
                  <div className="flex flex-col gap-[10px]">
                    {t.groupRows.map((g, i) => (
                      <div
                        key={g.name}
                        className="mock-row flex flex-col gap-[5px]"
                        style={{ animationDelay: `${520 + i * 90}ms` }}
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11.5px] font-medium text-ink leading-none">{g.name}</span>
                          <span className="text-[10px] text-ink-3 leading-none tabular-nums">{g.people}</span>
                        </div>
                        <div className="h-[5px] rounded-full bg-surface-3 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand origin-left"
                            style={{
                              width: `${GROUP_PCT[i]}%`,
                              transform: run ? "scaleX(1)" : "scaleX(0)",
                              transition: `transform 900ms cubic-bezier(0.16,0.84,0.44,1) ${600 + i * 110}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
