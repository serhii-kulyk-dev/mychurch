"use client";

import { useEffect, useState } from "react";
import {
  Check, Sparkles, Send, Bell, Clock, MapPin, QrCode, Users, Heart, Wallet, Ticket, Download,
  Search, ScanLine, DoorOpen, UserCheck, TrendingUp, Building2, Music, Baby, Video, Repeat,
  Inbox, HeartHandshake, Route,
} from "lucide-react";
import PersonAvatar, { AVATAR_LOOKS, lookFor } from "@/components/shared/person-avatar";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

type Screens = ReturnType<typeof useT>["audience"]["screens"];
type Props<K extends keyof Screens> = { s: Screens[K]; accent: string };

const BARS = [52, 64, 58, 71, 66, 79, 74, 88];

function useCountUp(target: number, duration = 1300) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      const id = setTimeout(() => setV(target), 0);
      return () => clearTimeout(id);
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

/* Small shared bits */
function Tile({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <div className="mock-pop rounded-xl bg-surface-2 border border-hairline px-3 py-2.5 flex flex-col gap-1 min-w-0" style={{ animationDelay: `${delay}ms` }}>
      <span className="text-[18px] font-semibold text-ink leading-none tracking-[-0.4px] tabular-nums truncate">{value}</span>
      <span className="text-[11px] text-ink-3 leading-[1.2]">{label}</span>
    </div>
  );
}
function ActionButton({ label, done, doneLabel, onClick, accent, icon: Icon }: { label: string; done: boolean; doneLabel: string; onClick: () => void; accent: string; icon: typeof Send }) {
  return (
    <button
      onClick={onClick}
      disabled={done}
      data-demo="click"
      className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full text-[13.5px] font-semibold text-white transition-all duration-300 disabled:cursor-default"
      style={{ background: done ? "#12a150" : accent, boxShadow: done ? "none" : `0 10px 22px -10px ${accent}` }}
    >
      {done ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-4 h-4" strokeWidth={2.4} />}
      {done ? doneLabel : label}
    </button>
  );
}

/* ── Pastor: chart + attention + AI digest ─────────────────── */
export function PastorScreen({ s, accent }: Props<"pastor">) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">{s.stats.map((st, i) => <Tile key={st.label} value={st.value} label={st.label} delay={100 + i * 80} />)}</div>
      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-2">
        <div className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2" style={{ animationDelay: "300ms" }}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.chartLabel}</span>
          <div className="flex items-end gap-1.5 h-[64px]">
            {BARS.map((h, i) => (
              <div key={i} className="mock-bar flex-1 rounded-[3px] origin-bottom" style={{ height: `${h}%`, background: i === BARS.length - 1 ? accent : `color-mix(in oklab, ${accent} 28%, var(--surface))`, animationDelay: `${380 + i * 60}ms` }} />
            ))}
          </div>
        </div>
        <div data-demo="hover" className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2" style={{ animationDelay: "380ms" }}>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            <span className="relative flex w-1.5 h-1.5"><span className="pulse-ring absolute inset-0 rounded-full bg-[#ff9500]" /><span className="relative w-1.5 h-1.5 rounded-full bg-[#ff9500]" /></span>
            {s.attentionTitle}
          </span>
          {s.attention.map((a, i) => (
            <div key={a.name} className="mock-row flex items-center gap-2" style={{ animationDelay: `${520 + i * 100}ms` }}>
              <PersonAvatar look={lookFor(a.name)} size={22} />
              <div className="flex flex-col min-w-0"><span className="text-[12px] font-medium text-ink leading-none truncate">{a.name}</span><span className="text-[10.5px] text-ink-3 leading-[1.25] mt-0.5">{a.note}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="mock-pop rounded-xl border border-hairline p-3 flex items-start gap-3" style={{ animationDelay: "900ms", background: `linear-gradient(120deg, color-mix(in oklab, #6366f1 10%, var(--surface)), var(--surface))` }}>
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#007aff] flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4 text-white" strokeWidth={2.2} /></span>
        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.aiTitle}</span>
          <span className="text-[13px] text-ink leading-[1.45]">{s.aiText}</span>
          <div><ActionButton label={s.aiCta} done={done} doneLabel={s.aiDone} onClick={() => setDone(true)} accent="#6366f1" icon={Sparkles} /></div>
        </div>
      </div>
    </div>
  );
}

/* ── Leader: attendance sheet with ticking checkboxes ─────── */
export function LeaderScreen({ s, accent }: Props<"leader">) {
  const [sent, setSent] = useState(false);
  const present = s.present.filter(Boolean).length;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col"><span className="text-[14px] font-semibold text-ink leading-none">{s.group}</span><span className="text-[11.5px] text-ink-3 leading-none mt-1">{s.date}</span></div>
        <div className="flex gap-1.5">
          <span className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-none" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}>{present} {s.presentLabel}</span>
          <span data-demo="hover" className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-none bg-[#ff9500]/14 text-[#c46a00] dark:text-[#ffb454]">{s.members.length - present} {s.absentLabel}</span>
        </div>
      </div>
      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline">
        {s.members.map((m, i) => {
          const ok = s.present[i];
          return (
            <li key={m} className="mock-row flex items-center gap-3 px-3 py-2" style={{ animationDelay: `${120 + i * 70}ms` }}>
              <PersonAvatar look={lookFor(m)} size={26} />
              <span className="flex-1 text-[13px] font-medium text-ink leading-none">{m}</span>
              <span className="pin-in w-6 h-6 rounded-md border flex items-center justify-center" style={{ animationDelay: `${500 + i * 160}ms`, background: ok ? accent : "var(--surface)", borderColor: ok ? accent : "var(--hairline-strong)" }}>
                {ok && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mock-pop flex items-center justify-between gap-3 rounded-xl border border-[#ff9500]/40 bg-[#ff9500]/10 px-3 py-2.5" style={{ animationDelay: "1500ms" }}>
        <span className="text-[12.5px] text-ink leading-[1.3]">{s.alert}</span>
        <ActionButton label={s.cta} done={sent} doneLabel={s.sent} onClick={() => setSent(true)} accent={accent} icon={Send} />
      </div>
    </div>
  );
}

/* ── Volunteer: week strip + confirm + toast ───────────────── */
export function VolunteerScreen({ s, accent }: Props<"volunteer">) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-7 gap-1">
        {s.days.map((d, i) => {
          const on = i === s.serviceDay;
          return (
            <div key={d} data-demo={on ? "hover" : undefined} className="mock-pop rounded-lg py-2 flex flex-col items-center gap-0.5 border" style={{ animationDelay: `${80 + i * 50}ms`, background: on ? accent : "var(--surface-2)", borderColor: on ? accent : "var(--hairline)", color: on ? "#fff" : "var(--ink-3)" }}>
              <span className="text-[11px] font-semibold leading-none">{d}</span>
              <span className="text-[13px] font-semibold leading-none tabular-nums" style={{ color: on ? "#fff" : "var(--ink)" }}>{15 + i}</span>
            </div>
          );
        })}
      </div>
      <div className="mock-row rounded-xl border border-hairline bg-surface-2 p-3 flex flex-col gap-2.5" style={{ animationDelay: "480ms" }}>
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}><Music className="w-5 h-5" strokeWidth={2.2} /></span>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-semibold text-ink leading-none">{s.role} · {s.when}</span>
            <span className="flex items-center gap-1 text-[11.5px] text-ink-3 leading-none mt-1"><MapPin className="w-3 h-3" />{s.place}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <ActionButton label={s.confirm} done={ok} doneLabel={s.confirmed} onClick={() => setOk(true)} accent={accent} icon={UserCheck} />
          {!ok && <button className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-hairline-strong text-[13.5px] font-medium text-ink-2 hover:text-ink transition-colors"><Repeat className="w-4 h-4" />{s.swap}</button>}
        </div>
      </div>
      <div className="mock-row flex flex-col gap-1.5" style={{ animationDelay: "640ms" }}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.tasksTitle}</span>
        {s.tasks.map((t) => (
          <span key={t} className="flex items-center gap-2 text-[12.5px] text-ink"><span className="w-4 h-4 rounded border border-hairline-strong bg-surface shrink-0" />{t}</span>
        ))}
      </div>
      <div className="mock-row rounded-xl bg-[#229ED9] text-white px-3 py-2.5 flex items-center gap-3 shadow-[0_14px_30px_-12px_rgba(34,158,217,0.8)]" style={{ animationDelay: "1300ms" }}>
        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Bell className="w-4 h-4" strokeWidth={2.2} /></span>
        <div className="flex flex-col min-w-0"><span className="text-[11px] font-semibold uppercase tracking-[0.06em] opacity-80">{s.toastTitle}</span><span className="text-[13px] leading-[1.3]">{s.toastText}</span></div>
      </div>
    </div>
  );
}

/* ── Visitor: QR + onboarding path + welcome ───────────────── */
export function VisitorScreen({ s, accent }: Props<"visitor">) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <PersonAvatar look={lookFor(s.name)} size={44} />
        <div className="flex flex-col"><span className="text-[14px] font-semibold text-ink leading-none">{s.name}</span><span className="text-[11.5px] text-ink-3 leading-none mt-1">{s.firstVisit}</span></div>
        <span data-demo="hover" className="ml-auto mock-pop flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-2.5 py-2" style={{ animationDelay: "200ms" }}>
          <QrCode className="w-7 h-7 text-ink" strokeWidth={1.6} />
          <span className="text-[10.5px] text-ink-2 leading-[1.25] max-w-[120px]">{s.qr}</span>
        </span>
      </div>
      <ol className="relative flex flex-col gap-2 pl-1">
        <span className="absolute left-[15px] top-3 bottom-3 w-[2px] bg-hairline-strong rounded-full" />
        <span className="absolute left-[15px] top-3 w-[2px] rounded-full origin-top" style={{ height: `calc((100% - 24px) * ${(s.done - 1) / (s.steps.length - 1)})`, background: accent, animation: "barGrow 1.2s var(--ease-out-soft) 400ms both" }} />
        {s.steps.map((st, i) => {
          const done = i < s.done;
          const now = i === s.done;
          return (
            <li key={st} data-demo={now ? "hover" : undefined} className="mock-row relative flex items-center gap-3" style={{ animationDelay: `${300 + i * 110}ms` }}>
              <span className="relative w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 z-10" style={{ background: done ? accent : "var(--surface)", borderColor: done || now ? accent : "var(--hairline-strong)", color: done ? "#fff" : accent }}>
                {done ? <Check className="w-3.5 h-3.5" strokeWidth={3.5} /> : now ? <span className="pulse-ring absolute inset-0 rounded-full" style={{ background: accent, opacity: 0.4 }} /> : null}
                {!done && <span className="text-[11px] font-bold tabular-nums">{i + 1}</span>}
              </span>
              <span className={["text-[13px] leading-none", done ? "text-ink" : now ? "text-ink font-semibold" : "text-ink-3"].join(" ")}>{st}</span>
            </li>
          );
        })}
      </ol>
      <div className="mock-pop rounded-xl rounded-tl-[4px] bg-surface-2 border border-hairline p-3 flex flex-col gap-1.5" style={{ animationDelay: "1000ms" }}>
        <span className="text-[13px] text-ink leading-[1.45]">{s.welcome}</span>
        <span className="text-[11px] text-ink-3">{s.responsible}</span>
      </div>
    </div>
  );
}

/* ── Member: event registration + group + family + giving ─── */
export function MemberScreen({ s, accent }: Props<"member">) {
  const [reg, setReg] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="mock-pop rounded-xl overflow-hidden border border-hairline" style={{ animationDelay: "80ms" }}>
        <div className="px-3 py-3 flex items-center gap-3" style={{ background: `linear-gradient(120deg, ${accent}, color-mix(in oklab, ${accent} 60%, #000))` }}>
          <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0"><Ticket className="w-5 h-5 text-white" strokeWidth={2.2} /></span>
          <div className="flex flex-col text-white min-w-0"><span className="text-[14px] font-semibold leading-none truncate">{s.eventTitle}</span><span className="text-[11.5px] opacity-85 leading-none mt-1">{s.eventDate} · {s.eventPlace}</span></div>
        </div>
        <div className="px-3 py-2.5 bg-surface-2 flex items-center justify-between gap-3">
          <span className="text-[12px] text-ink-3">{reg ? "" : " "}</span>
          <ActionButton label={s.register} done={reg} doneLabel={s.registered} onClick={() => setReg(true)} accent={accent} icon={Ticket} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-1" style={{ animationDelay: "320ms" }}>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Users className="w-3 h-3" />{s.groupTitle}</span>
          <span className="text-[13px] font-medium text-ink leading-[1.3]">{s.group}</span>
          <span className="text-[11.5px] text-ink-3 leading-[1.3]">{s.groupWhen}</span>
        </div>
        <div className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-1" style={{ animationDelay: "400ms" }}>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Heart className="w-3 h-3" />{s.familyTitle}</span>
          <div className="flex -space-x-1.5">{[1, 2, 3].map((k) => <PersonAvatar key={k} look={AVATAR_LOOKS[k % AVATAR_LOOKS.length]} size={22} className="ring-2 ring-surface rounded-full" />)}</div>
          <span className="text-[11.5px] text-ink-2 leading-[1.3]">{s.family}</span>
        </div>
      </div>
      <div data-demo="hover" className="mock-row rounded-xl bg-surface-2 border border-hairline px-3 py-2.5 flex items-center gap-3" style={{ animationDelay: "500ms" }}>
        <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in oklab, #12a150 14%, var(--surface))`, color: "#12a150" }}><Wallet className="w-4 h-4" strokeWidth={2.2} /></span>
        <span className="text-[12px] text-ink-3">{s.givingTitle}</span>
        <span className="ml-auto text-[15px] font-semibold text-ink tabular-nums">{s.giving}</span>
      </div>
    </div>
  );
}

/* ── HR: org tree + approval ───────────────────────────────── */
export function HrScreen({ s, accent }: Props<"hr">) {
  const [ok, setOk] = useState(false);
  const ICONS = [Music, Baby, Video];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[11.5px] text-ink-3"><span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{s.team}</span><span className="flex items-center gap-1.5" style={{ color: accent }}><TrendingUp className="w-3.5 h-3.5" />{s.newcomers}</span></div>
      <div className="relative flex flex-col items-center gap-4 pt-1">
        <div className="mock-pop flex items-center gap-2 rounded-full bg-surface border border-hairline pl-1 pr-3 py-1 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.4)] z-10" style={{ animationDelay: "100ms" }}>
          <PersonAvatar look={lookFor(s.root)} size={26} /><span className="text-[12.5px] font-semibold text-ink">{s.root}</span>
        </div>
        <span className="absolute top-[38px] left-1/2 -translate-x-1/2 w-[2px] h-4 bg-hairline-strong" />
        <span className="absolute top-[54px] left-[16%] right-[16%] h-[2px] bg-hairline-strong" />
        <div className="grid grid-cols-3 gap-2 w-full">
          {s.depts.map((d, i) => {
            const I = ICONS[i] ?? Users;
            return (
              <div key={d.name} className="relative mock-pop rounded-xl bg-surface-2 border border-hairline p-2.5 flex flex-col items-center gap-1.5 text-center" style={{ animationDelay: `${300 + i * 120}ms` }}>
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-hairline-strong" />
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}><I className="w-4 h-4" strokeWidth={2.2} /></span>
                <span className="text-[12px] font-medium text-ink leading-none">{d.name}</span>
                <div className="flex -space-x-1">{Array.from({ length: 3 }).map((_, k) => <PersonAvatar key={k} look={AVATAR_LOOKS[(i + k + 1) % AVATAR_LOOKS.length]} size={16} className="ring-1 ring-surface rounded-full" />)}<span className="ml-2 text-[10.5px] text-ink-3 tabular-nums">+{d.count - 3}</span></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mock-row rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 flex items-center gap-3" style={{ animationDelay: "800ms" }}>
        <PersonAvatar look={lookFor(s.requestWho)} size={30} />
        <div className="flex flex-col min-w-0 flex-1"><span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.requestTitle} · {s.requestWho}</span><span className="text-[13px] text-ink leading-none mt-1 truncate">{s.requestWhat}</span></div>
        <ActionButton label={s.approve} done={ok} doneLabel={s.approved} onClick={() => setOk(true)} accent={accent} icon={Check} />
      </div>
    </div>
  );
}

/* ── Deacon: help requests, the week's visits, the mercy fund ─ */
export function DeaconScreen({ s, accent }: Props<"deacon">) {
  const [taken, setTaken] = useState(false);
  const [seen, setSeen] = useState(() => s.visits.map((_, i) => i === 0));
  const visited = seen.filter(Boolean).length;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Inbox className="w-3.5 h-3.5" />{s.needsTitle}</span>
        {s.needs.map((n, i) => (
          <div
            key={n.who}
            data-demo={i === 1 ? "hover" : undefined}
            className="mock-row rounded-xl border bg-surface-2 px-3 py-2.5 flex items-center gap-3"
            style={{ animationDelay: `${120 + i * 110}ms`, borderColor: i === 0 && !taken ? "color-mix(in oklab, #ff9500 50%, transparent)" : "var(--hairline)" }}
          >
            <PersonAvatar look={lookFor(n.who)} size={30} />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] font-semibold text-ink leading-none truncate">{n.who}</span>
              <span className="text-[11.5px] text-ink-3 leading-none mt-1.5 truncate">{n.what}</span>
            </div>
            <span className="text-[11px] text-ink-3 whitespace-nowrap">{n.when}</span>
          </div>
        ))}
        <div className="mock-row flex justify-end" style={{ animationDelay: "380ms" }}>
          <ActionButton label={s.takeCta} done={taken} doneLabel={s.takeDone} onClick={() => setTaken(true)} accent={accent} icon={HeartHandshake} />
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-2">
        <div className="mock-row rounded-xl border border-hairline bg-surface-2 p-3 flex flex-col gap-2" style={{ animationDelay: "620ms" }}>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Route className="w-3.5 h-3.5" />{s.visitsTitle}</span>
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: accent }}>{visited}/{s.visits.length}</span>
          </div>
          {s.visits.map((v, i) => (
            <button
              key={v.name}
              type="button"
              data-demo={i === 1 ? "click" : undefined}
              onClick={() => setSeen((prev) => prev.map((x, k) => (k === i ? !x : x)))}
              aria-pressed={seen[i]}
              className="mock-row flex items-center gap-2 text-left"
              style={{ animationDelay: `${720 + i * 90}ms` }}
            >
              <span className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-200" style={{ background: seen[i] ? accent : "var(--surface)", borderColor: seen[i] ? accent : "var(--hairline-strong)" }}>
                {seen[i] && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-[12px] font-medium text-ink leading-none truncate">{v.name}</span>
                <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{v.note}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mock-row rounded-xl border border-hairline bg-surface-2 p-3 flex flex-col gap-2" style={{ animationDelay: "700ms" }}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-[1.3]">{s.fundTitle}</span>
          <span className="flex flex-col">
            <span className="text-[19px] font-semibold text-ink leading-none tracking-[-0.4px] tabular-nums">{s.fundLeft}</span>
            <span className="text-[10.5px] text-ink-3 leading-none mt-1.5">{s.fundLeftLabel}</span>
          </span>
          <span className="flex h-2 rounded-full overflow-hidden bg-surface">
            <span className="block h-full origin-left" style={{ width: "43%", background: accent, animation: "barGrowX 0.7s var(--ease-out-soft) 900ms both" }} />
          </span>
          <span className="text-[10.5px] text-ink-3 tabular-nums">{s.fundSpent} {s.fundSpentLabel}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Accountant: donut + ledger ────────────────────────────── */
export function AccountantScreen({ s, accent }: Props<"accountant">) {
  const [exp, setExp] = useState(false);
  const COLORS = [accent, "#0ea5e9", "#f59e0b"];
  const R = 34, C = 2 * Math.PI * R;
  // start offset of each slice = sum of the slices before it
  const offsets = s.slices.map((_, i) => s.slices.slice(0, i).reduce((a, x) => a + x.pct, 0));
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-center">
        <div data-demo="hover" className="relative w-[96px] h-[96px] mock-pop" style={{ animationDelay: "100ms" }}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={R} fill="none" stroke="var(--hairline)" strokeWidth="12" />
            {s.slices.map((sl, i) => {
              const off = offsets[i];
              return (
                <circle key={sl.label} cx="48" cy="48" r={R} fill="none" stroke={COLORS[i]} strokeWidth="12" strokeLinecap="butt"
                  transform="rotate(-90 48 48)" strokeDasharray={`${(sl.pct / 100) * C} ${C}`} strokeDashoffset={-(off / 100) * C}
                  className="mock-ring" style={{ ["--ring-len" as string]: `${C}`, ["--ring-off" as string]: `${-(off / 100) * C}`, animationDelay: `${300 + i * 200}ms` } as React.CSSProperties} />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-[13px] font-semibold text-ink leading-none tabular-nums">{s.month}</span></div>
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <div className="mock-row flex flex-col" style={{ animationDelay: "200ms" }}>
            <span className="text-[11px] text-ink-3 leading-none">{s.totalLabel}</span>
            <span className="text-[22px] font-semibold text-ink leading-none tracking-[-0.5px] tabular-nums mt-1">{s.total}</span>
            <span className="text-[11.5px] font-medium text-[#0e7a3c] dark:text-[#3ddc97] leading-none mt-1">{s.delta}</span>
          </div>
          <div className="flex flex-col gap-1">
            {s.slices.map((sl, i) => (
              <span key={sl.label} className="mock-row flex items-center gap-2 text-[11.5px] text-ink-2" style={{ animationDelay: `${400 + i * 90}ms` }}><span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />{sl.label}<span className="ml-auto tabular-nums text-ink">{sl.pct}%</span></span>
            ))}
          </div>
        </div>
      </div>
      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline">
        {s.rows.map((r, i) => (
          <li key={r.name} className="mock-row flex items-center justify-between px-3 py-2 text-[12.5px]" style={{ animationDelay: `${700 + i * 100}ms` }}>
            <span className="text-ink">{r.name}</span>
            <span className={["font-semibold tabular-nums", r.amount.startsWith("+") ? "text-[#0e7a3c] dark:text-[#3ddc97]" : "text-ink"].join(" ")}>{r.amount}</span>
          </li>
        ))}
      </ul>
      <div className="mock-row flex justify-end" style={{ animationDelay: "1050ms" }}><ActionButton label={s.export} done={exp} doneLabel={s.exported} onClick={() => setExp(true)} accent={accent} icon={Download} /></div>
    </div>
  );
}

/* ── Reception: search + check-in counter + rooms ──────────── */
export function ReceptionScreen({ s, accent }: Props<"reception">) {
  const count = useCountUp(s.checkins);
  return (
    <div className="flex flex-col gap-3">
      <div data-demo="hover" className="mock-pop rounded-xl border border-hairline bg-surface px-3 h-11 flex items-center gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" style={{ animationDelay: "80ms" }}>
        <Search className="w-4 h-4 text-ink-3" />
        <span className="text-[13.5px] text-ink">{s.query}<span className="inline-block w-[2px] h-4 bg-ink align-middle ml-0.5 animate-pulse" /></span>
        <span className="ml-auto text-[11px] text-ink-3">{s.search}</span>
      </div>
      <div data-demo="hover" className="mock-pop rounded-xl border bg-surface-2 px-3 py-2.5 flex items-center gap-3" style={{ animationDelay: "700ms", borderColor: `color-mix(in oklab, ${accent} 40%, transparent)` }}>
        <PersonAvatar look={lookFor(s.foundName)} size={32} />
        <div className="flex flex-col min-w-0"><span className="text-[13px] font-semibold text-ink leading-none">{s.foundName}</span><span className="text-[11.5px] text-ink-3 leading-none mt-1 truncate">{s.foundMeta}</span></div>
        <span className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: accent }}><UserCheck className="w-4 h-4" strokeWidth={2.4} /></span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
        <div className="mock-row rounded-xl p-3 flex flex-col gap-1 text-white" style={{ animationDelay: "300ms", background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 60%, #000))` }}>
          <span className="text-[26px] font-semibold leading-none tabular-nums">{count}</span>
          <span className="text-[11px] opacity-85 leading-none">{s.checkinsLabel}</span>
          <span className="text-[11px] opacity-85 leading-none mt-1">{s.guests}</span>
        </div>
        <div className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-1.5" style={{ animationDelay: "380ms" }}>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3"><ScanLine className="w-3.5 h-3.5" />QR</span>
          <span className="text-[11.5px] text-ink leading-[1.35]">{s.lastScan}</span>
        </div>
      </div>
      <div className="mock-row flex flex-col gap-1.5" style={{ animationDelay: "500ms" }}>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3"><DoorOpen className="w-3.5 h-3.5" />{s.roomsTitle}</span>
        {s.rooms.map((r) => (
          <span key={r.name} className="flex items-center gap-2 rounded-lg bg-surface-2 border border-hairline px-3 py-2 text-[12.5px]"><span className="font-medium text-ink">{r.name}</span><span className="flex items-center gap-1 text-ink-3"><Clock className="w-3 h-3" />{r.time}</span><span className="ml-auto text-ink-2">{r.who}</span></span>
        ))}
      </div>
    </div>
  );
}
