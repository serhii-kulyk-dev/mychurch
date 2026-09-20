"use client";

import { useState } from "react";
import { ArrowRight, Check, Send, Sparkles, UserPlus, Zap } from "lucide-react";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { useT } from "@/lib/lang";

/* Екрани блоку «Було — стало». Кожен показує не модуль, а закриту
   ситуацію: живі імена, дати й одна дія, яку можна натиснути. */

type Screens = ReturnType<typeof useT>["solved"]["screens"];
type Props<K extends keyof Screens> = { s: Screens[K]; accent: string };

const WARN = "#ff9500";
const OK = "#12a150";

/* ── Спільні дрібниці ─────────────────────────────────────────── */

function Tile({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <div className="mock-pop rounded-xl bg-surface-2 border border-hairline px-3 py-2.5 flex flex-col gap-1 min-w-0" style={{ animationDelay: `${delay}ms` }}>
      <span className="text-[19px] font-semibold text-ink leading-none tracking-[-0.4px] tabular-nums">{value}</span>
      <span className="text-[11px] text-ink-3 leading-[1.2]">{label}</span>
    </div>
  );
}

/* Смуга з проблемним рядком і однією дією: доки не натиснули — видно,
   що саме «висить»; після натискання смуга сама стає відповіддю. */
function ActionBar({
  text, doneText, cta, done, onClick, accent, icon: Icon, delay,
}: {
  text: string; doneText: string; cta: string; done: boolean; onClick: () => void; accent: string; icon: typeof Send; delay: number;
}) {
  const tone = done ? OK : WARN;
  return (
    <div
      className="mock-pop flex flex-wrap items-center justify-between gap-2.5 rounded-xl border px-3 py-2.5"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: `color-mix(in oklab, ${tone} 40%, transparent)`,
        background: `color-mix(in oklab, ${tone} 9%, var(--surface))`,
        transition: "background-color 0.4s, border-color 0.4s",
      }}
    >
      <span className="flex items-center gap-2 text-[12.5px] text-ink leading-[1.35] min-w-0">
        {done && <Check className="w-4 h-4 shrink-0" strokeWidth={3} style={{ color: OK }} />}
        {done ? doneText : text}
      </span>
      {!done && (
        <button
          type="button"
          onClick={onClick}
          data-demo="click"
          className="ml-auto inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-full text-[13px] font-semibold text-white transition-transform duration-200 hover:-translate-y-px"
          style={{ background: accent, boxShadow: `0 10px 22px -12px ${accent}` }}
        >
          <Icon className="w-4 h-4" strokeWidth={2.4} />
          {cta}
        </button>
      )}
    </div>
  );
}

/* ── 1. Новенькі: кожен на своєму кроці ───────────────────────── */
export function NewcomersScreen({ s, accent }: Props<"newcomers">) {
  const [done, setDone] = useState(false);
  const last = s.people.length - 1;
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {s.stats.map((st, i) => <Tile key={st.label} value={st.value} label={st.label} delay={80 + i * 80} />)}
      </div>

      <div className="rounded-xl border border-hairline bg-surface-2 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_184px] gap-3 px-3 py-2 border-b border-hairline">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.who}</span>
          <div className="grid grid-cols-4 gap-1">
            {s.steps.map((step) => (
              <span key={step} className="text-[9.5px] text-ink-3 leading-none truncate text-center">{step}</span>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-hairline">
          {s.people.map((p, i) => {
            const warn = i === last && !done;
            const step = i === last && done ? p.step + 1 : p.step;
            return (
              <li key={p.name} className="mock-row grid grid-cols-[minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_184px] items-center gap-2 sm:gap-3 px-3 py-2.5" style={{ animationDelay: `${260 + i * 110}ms` }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <PersonAvatar look={lookFor(p.name)} size={26} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-medium text-ink leading-none truncate">{p.name}</span>
                    <span className="text-[11px] leading-[1.25] mt-1 truncate" style={{ color: warn ? WARN : "var(--ink-3)" }}>
                      {i === last && done ? s.doneNote : p.note}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {s.steps.map((label, j) => {
                    const on = j < step;
                    return (
                      <span
                        key={label}
                        className="h-1.5 rounded-full transition-colors duration-500"
                        style={{ background: on ? accent : "var(--surface-3)" }}
                      />
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <ActionBar
        text={s.alert}
        doneText={s.done}
        cta={s.cta}
        done={done}
        onClick={() => setDone(true)}
        accent={accent}
        icon={UserPlus}
        delay={620}
      />
    </div>
  );
}

/* ── 2. Явка: графік і ті, хто зник ───────────────────────────── */
const BARS = [96, 88, 92, 74, 80, 62, 58, 48];

export function AttendanceScreen({ s, accent }: Props<"attendance">) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2" style={{ animationDelay: "80ms" }}>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.chartLabel}</span>
        <div className="flex items-end gap-1.5 h-[62px]">
          {BARS.map((h, i) => (
            <div
              key={i}
              className="mock-bar flex-1 rounded-[3px] origin-bottom"
              style={{ height: `${h}%`, background: i >= BARS.length - 2 ? accent : `color-mix(in oklab, ${accent} 26%, var(--surface))`, animationDelay: `${220 + i * 55}ms` }}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-hairline bg-surface-2 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-hairline">
          <span className="relative flex w-1.5 h-1.5">
            <span className="pulse-ring absolute inset-0 rounded-full" style={{ background: WARN }} />
            <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: WARN }} />
          </span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.listTitle}</span>
        </div>
        <ul className="divide-y divide-hairline">
          {s.people.map((p, i) => (
            <li key={p.name} className="mock-row flex items-center gap-2.5 px-3 py-2.5" style={{ animationDelay: `${420 + i * 110}ms` }}>
              <PersonAvatar look={lookFor(p.name)} size={26} />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[13px] font-medium text-ink leading-none truncate">{p.name}</span>
                <span className="text-[11px] text-ink-3 leading-[1.25] mt-1 truncate">{p.note}</span>
              </div>
              <span
                className="pin-in shrink-0 rounded-full px-2 py-1 text-[10.5px] font-semibold leading-none"
                style={{ animationDelay: `${640 + i * 140}ms`, background: `color-mix(in oklab, ${WARN} 14%, var(--surface))`, color: "#c46a00" }}
              >
                {3 + i} {s.weeks}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ActionBar text={s.alert} doneText={s.done} cta={s.cta} done={done} onClick={() => setDone(true)} accent={accent} icon={Send} delay={820} />
    </div>
  );
}

/* ── 3. Заявки: скринька з відповідальними ────────────────────── */
export function RequestsScreen({ s, accent }: Props<"requests">) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {s.tabs.map((tab, i) => (
          <span
            key={tab.label}
            className="mock-pop inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium leading-none"
            style={{
              animationDelay: `${80 + i * 80}ms`,
              borderColor: i === 0 ? `color-mix(in oklab, ${accent} 45%, transparent)` : "var(--hairline)",
              background: i === 0 ? `color-mix(in oklab, ${accent} 10%, var(--surface))` : "var(--surface-2)",
              color: i === 0 ? accent : "var(--ink-2)",
            }}
          >
            {tab.label}
            <span className="tabular-nums opacity-70">{i === 0 && done ? String(Number(tab.count) - 1) : tab.count}</span>
          </span>
        ))}
      </div>

      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline overflow-hidden">
        {s.items.map((item, i) => {
          const warn = i === 1 && !done;
          return (
            <li key={item.title} className="mock-row flex items-start gap-2.5 px-3 py-2.5" style={{ animationDelay: `${260 + i * 110}ms` }}>
              <PersonAvatar look={lookFor(item.who)} size={26} className="mt-0.5" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[13px] font-medium text-ink leading-[1.25] truncate">{item.title}</span>
                <span className="text-[11px] leading-[1.25] mt-1 truncate" style={{ color: warn ? WARN : "var(--ink-3)" }}>
                  {item.who} · {i === 1 && done ? s.doneNote : item.meta}
                </span>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-1 text-[10.5px] font-semibold leading-none"
                style={{
                  background: warn ? `color-mix(in oklab, ${WARN} 14%, var(--surface))` : `color-mix(in oklab, ${OK} 12%, var(--surface))`,
                  color: warn ? "#c46a00" : OK,
                }}
              >
                {i === 1 && done ? item.taken : item.state}
              </span>
            </li>
          );
        })}
      </ul>

      <ActionBar text={s.alert} doneText={s.done} cta={s.cta} done={done} onClick={() => setDone(true)} accent={accent} icon={Check} delay={620} />
    </div>
  );
}

/* ── 4. Служіння: графік неділі з однією діркою ───────────────── */
export function MinistriesScreen({ s, accent }: Props<"ministries">) {
  const [done, setDone] = useState(false);
  const gap = 2;
  return (
    <div className="flex flex-col gap-3">
      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline overflow-hidden">
        {s.rows.map((row, i) => {
          const warn = i === gap && !done;
          return (
            <li key={row.name} className="mock-row flex items-center gap-3 px-3 py-2.5" style={{ animationDelay: `${120 + i * 110}ms` }}>
              <div className="flex flex-col min-w-0 w-[104px] sm:w-[128px] shrink-0">
                <span className="text-[13px] font-medium text-ink leading-none truncate">{row.name}</span>
                <span className="text-[11px] leading-[1.25] mt-1 truncate" style={{ color: warn ? WARN : "var(--ink-3)" }}>
                  {i === gap && done ? s.doneNote : row.note}
                </span>
              </div>
              <div className="flex items-center flex-1 min-w-0">
                {row.people.map((name, j) => (
                  <span key={name} title={name} className="pin-in -ml-1.5 first:ml-0 rounded-full ring-2 ring-[var(--surface-2)]" style={{ animationDelay: `${300 + i * 120 + j * 80}ms` }}>
                    <PersonAvatar look={lookFor(name)} size={26} />
                  </span>
                ))}
                {i === gap && (
                  <span
                    className="-ml-1.5 w-[26px] h-[26px] rounded-full border border-dashed flex items-center justify-center transition-colors duration-500"
                    style={{ borderColor: done ? OK : WARN, background: "var(--surface)", color: done ? OK : WARN }}
                  >
                    {done ? <Check className="w-3 h-3" strokeWidth={3} /> : <span className="text-[13px] leading-none">+</span>}
                  </span>
                )}
                <span
                  className="ml-auto shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: warn ? `color-mix(in oklab, ${WARN} 16%, var(--surface))` : `color-mix(in oklab, ${OK} 14%, var(--surface))`, color: warn ? "#c46a00" : OK }}
                >
                  {warn ? <span className="text-[12px] leading-none font-semibold">!</span> : <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <ActionBar text={s.alert} doneText={s.done} cta={s.cta} done={done} onClick={() => setDone(true)} accent={accent} icon={Sparkles} delay={640} />
    </div>
  );
}

/* ── 5. Автоматизації: сценарій і його журнал ─────────────────── */
export function RoutineScreen({ s, accent }: Props<"routine">) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mock-pop rounded-xl border border-hairline p-3 flex flex-col gap-2.5" style={{ animationDelay: "80ms", background: `linear-gradient(130deg, color-mix(in oklab, ${accent} 10%, var(--surface)), var(--surface))` }}>
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}>
            <Zap className="w-3.5 h-3.5" strokeWidth={2.3} />
          </span>
          <span className="text-[13.5px] font-semibold text-ink leading-none flex-1 min-w-0 truncate">{s.recipe}</span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium leading-none" style={{ color: OK }}>
            <span className="w-7 h-4 rounded-full flex items-center px-0.5" style={{ background: OK }}>
              <span className="w-3 h-3 rounded-full bg-white ml-auto" />
            </span>
            {s.onLabel}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {s.nodes.map((node, i) => (
            <span key={node} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight className="w-3 h-3 text-ink-3" strokeWidth={2.4} />}
              <span className="mock-pop rounded-full border border-hairline bg-surface px-2.5 py-1.5 text-[11.5px] text-ink leading-none" style={{ animationDelay: `${240 + i * 120}ms` }}>
                {node}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-hairline bg-surface-2 overflow-hidden">
        <span className="block px-3 py-2 border-b border-hairline text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.logTitle}</span>
        <ul className="divide-y divide-hairline">
          {s.log.map((run, i) => (
            <li key={run.when} className="mock-row flex items-center gap-2.5 px-3 py-2.5" style={{ animationDelay: `${420 + i * 110}ms` }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${OK} 14%, var(--surface))`, color: OK }}>
                <Check className="w-3 h-3" strokeWidth={3} />
              </span>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[12.5px] text-ink leading-none truncate">{run.what}</span>
                <span className="text-[11px] text-ink-3 leading-[1.25] mt-1 truncate">{run.when}</span>
              </div>
              <span className="text-[11px] text-ink-3 leading-none shrink-0 hidden sm:block">{run.ok}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mock-pop flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 px-3 py-2.5" style={{ animationDelay: "760ms" }}>
        <span className="text-[12.5px] text-ink-2 leading-none">{s.savedLabel}</span>
        <span className="text-[15px] font-semibold text-ink leading-none tabular-nums">{s.saved}</span>
      </div>
    </div>
  );
}
