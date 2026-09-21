"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, Sparkles, UserCheck, Bell, MapPin, Music, QrCode, Ticket, Wallet, Download, Search,
  Send, Repeat, Users, Heart, Baby, Video, Building2, TrendingUp, Clock, DoorOpen, ScanLine,
  Megaphone, Inbox, HeartHandshake, Route, Gauge, Coins, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import CursorDemo from "@/components/shared/cursor-demo";
import PersonAvatar, { AVATAR_LOOKS, lookFor } from "@/components/shared/person-avatar";
import { ROLE_ICONS, ROLE_ACCENTS } from "@/components/shared/role-icons";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

type Screens = ReturnType<typeof useT>["audience"]["screens"];
type Card<K extends keyof Screens> = { s: Screens[K]; accent: string };

/* Дев'ять ролей на вісім облич — дублікат віддали найдальшій парі в сітці
   (диякон у першому ряду, бухгалтер у третьому). */
const LOOK: Record<string, number> = { pastor: 0, leader: 2, deacon: 6, volunteer: 4, visitor: 1, member: 3, hr: 5, accountant: 6, reception: 7 };
/* Each panel has three scenes from three different modules — it swaps on
   replay, so a visitor standing on the page never watches the same loop
   twice, and every scene is something this role really presses. */
const SCENES = 3;
/* Not everyone sits at a desk: these scenes are a thumb in the phone app or
   a tap on a bot button in Telegram, so the ghost hand changes with them. */
const TOUCH = new Set(["leader-1", "volunteer-0", "volunteer-1", "volunteer-2", "member-0", "member-1", "member-2", "visitor-1", "visitor-2", "deacon-1"]);
const BARS = [52, 64, 58, 71, 66, 79, 74, 88];

/* The one button a ghost pointer presses on each panel. */
function Act({ label, done, doneLabel, onClick, accent, icon: Icon }: { label: string; done: boolean; doneLabel: string; onClick: () => void; accent: string; icon: LucideIcon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={done}
      data-demo="click"
      className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full text-[13px] font-semibold text-white transition-all duration-300 disabled:cursor-default"
      style={{ background: done ? "#0e7a3c" : `color-mix(in oklab, ${accent} 78%, #04121f)`, boxShadow: done ? "none" : `0 10px 20px -10px ${accent}` }}
    >
      {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Icon className="w-3.5 h-3.5" strokeWidth={2.4} />}
      {done ? doneLabel : label}
    </button>
  );
}

/* ── Пастор: зведення тижня від асистента ──────────────────── */
function PastorCard({ s }: Card<"pastor">) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {s.stats.map((st, i) => (
          <div key={st.label} className="mock-pop rounded-xl bg-surface-2 border border-hairline px-3 py-2.5 flex flex-col gap-1" style={{ animationDelay: `${80 + i * 70}ms` }}>
            <span className="text-[18px] font-semibold text-ink leading-none tracking-[-0.3px] tabular-nums">{st.value}</span>
            <span className="text-[11px] text-ink-3 leading-none">{st.label}</span>
          </div>
        ))}
      </div>
      <div className="mock-pop rounded-xl border border-hairline p-3.5 flex flex-col gap-2.5" style={{ animationDelay: "320ms", background: "linear-gradient(120deg, color-mix(in oklab, #6366f1 10%, var(--surface)), var(--surface))" }}>
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#007aff] flex items-center justify-center shrink-0"><Sparkles className="w-3 h-3 text-white" strokeWidth={2.4} /></span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none">{s.aiTitle}</span>
        </span>
        <span className="text-[13.5px] text-ink leading-[1.5]">{s.aiText}</span>
        <div><Act label={s.aiCta} done={done} doneLabel={s.aiDone} onClick={() => setDone(true)} accent="#6366f1" icon={Sparkles} /></div>
      </div>
    </div>
  );
}

/* ── Лідер: явка — курсор відмічає присутніх ───────────────── */
function LeaderCard({ s, accent }: Card<"leader">) {
  const people = s.members.slice(0, 3);
  const [on, setOn] = useState([true, true, false]);
  const present = on.filter(Boolean).length;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[13.5px] font-semibold text-ink leading-none truncate">{s.group}</span>
          <span className="text-[11px] text-ink-3 leading-none mt-1">{s.date}</span>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-none tabular-nums shrink-0" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: `color-mix(in oklab, ${accent} 72%, var(--ink))` }}>
          {present} {s.presentLabel}
        </span>
      </div>
      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline">
        {people.map((m, i) => {
          const ok = on[i];
          return (
            <li key={m} className="mock-row flex items-center gap-2.5 px-3 py-2" style={{ animationDelay: `${100 + i * 70}ms` }}>
              <PersonAvatar look={lookFor(m)} size={26} />
              <span className="flex-1 text-[13px] font-medium text-ink leading-none truncate">{m}</span>
              <button
                type="button"
                data-demo={i === 2 ? "click" : undefined}
                onClick={() => setOn((prev) => prev.map((v, k) => (k === i ? !v : v)))}
                aria-pressed={ok}
                aria-label={`${s.markLabel}: ${m}`}
                className="w-6 h-6 rounded-md border flex items-center justify-center transition-colors duration-200"
                style={{ background: ok ? accent : "var(--surface)", borderColor: ok ? accent : "var(--hairline-strong)" }}
              >
                {ok && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Служитель: підтвердив участь — і бот нагадає ──────────── */
function VolunteerCard({ s, accent }: Card<"volunteer">) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mock-row rounded-xl border border-hairline bg-surface-2 p-3 flex flex-col gap-3" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: `color-mix(in oklab, ${accent} 72%, var(--ink))` }}><Music className="w-4 h-4" strokeWidth={2.2} /></span>
          <div className="flex flex-col min-w-0">
            <span className="text-[13.5px] font-semibold text-ink leading-none truncate">{s.role} · {s.when}</span>
            <span className="flex items-center gap-1 text-[11px] text-ink-3 leading-none mt-1"><MapPin className="w-3 h-3" />{s.place}</span>
          </div>
        </div>
        <Act label={s.confirm} done={ok} doneLabel={s.confirmed} onClick={() => setOk(true)} accent={accent} icon={UserCheck} />
      </div>
      {ok && (
        <div className="mock-pop rounded-xl bg-[#229ED9] text-white px-3 py-2.5 flex items-center gap-2.5 shadow-[0_14px_28px_-14px_rgba(34,158,217,0.8)]">
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Bell className="w-3.5 h-3.5" strokeWidth={2.2} /></span>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em] opacity-80">{s.toastTitle}</span>
            <span className="text-[12.5px] leading-[1.3]">{s.toastText}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Відвідувач: шлях новачка — крок, на якому він зараз ───── */
function VisitorCard({ s, accent }: Card<"visitor">) {
  const steps = s.steps.slice(0, 4);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <PersonAvatar look={lookFor(s.name)} size={34} />
        <div className="flex flex-col min-w-0">
          <span className="text-[13.5px] font-semibold text-ink leading-none truncate">{s.name}</span>
          <span className="text-[11px] text-ink-3 leading-none mt-1 truncate">{s.firstVisit}</span>
        </div>
        <span data-demo="hover" className="mock-pop ml-auto flex items-center gap-1.5 rounded-xl border border-hairline bg-surface-2 px-2 py-1.5 shrink-0" style={{ animationDelay: "160ms" }}>
          <QrCode className="w-5 h-5 text-ink" strokeWidth={1.6} />
          <span className="text-[10px] text-ink-2 leading-[1.2] max-w-[92px]">{s.qr}</span>
        </span>
      </div>
      <ol className="flex flex-col gap-1">
        {steps.map((st, i) => {
          const done = i < s.done;
          const now = i === s.done;
          return (
            <li
              key={st}
              data-demo={now ? "hover" : undefined}
              className="mock-row flex items-center gap-2.5 rounded-lg px-2 py-1.5"
              style={{ animationDelay: `${200 + i * 90}ms`, background: now ? `color-mix(in oklab, ${accent} 9%, var(--surface-2))` : "transparent" }}
            >
              <span
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold tabular-nums"
                style={{ background: done ? accent : "var(--surface)", borderColor: done || now ? accent : "var(--hairline-strong)", color: done ? "#fff" : accent }}
              >
                {done ? <Check className="w-3 h-3" strokeWidth={3.5} /> : i + 1}
              </span>
              <span className={["text-[12.5px] leading-[1.25]", done ? "text-ink" : now ? "text-ink font-semibold" : "text-ink-3"].join(" ")}>{st}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── Член церкви: реєстрація на подію в два дотики ─────────── */
function MemberCard({ s, accent }: Card<"member">) {
  const [reg, setReg] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mock-pop rounded-xl overflow-hidden border border-hairline" style={{ animationDelay: "80ms" }}>
        <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ background: `linear-gradient(120deg, ${accent}, color-mix(in oklab, ${accent} 60%, #000))` }}>
          <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0"><Ticket className="w-4 h-4 text-white" strokeWidth={2.2} /></span>
          <div className="flex flex-col text-white min-w-0">
            <span className="text-[13px] font-semibold leading-none truncate">{s.eventTitle}</span>
            <span className="text-[10.5px] opacity-85 leading-none mt-1 truncate">{s.eventDate} · {s.eventPlace}</span>
          </div>
        </div>
        <div className="px-3 py-2.5 bg-surface-2 flex justify-end">
          <Act label={s.register} done={reg} doneLabel={s.registered} onClick={() => setReg(true)} accent={accent} icon={Ticket} />
        </div>
      </div>
      <div className="mock-row rounded-xl bg-surface-2 border border-hairline px-3 py-2.5 flex items-center gap-2.5" style={{ animationDelay: "320ms" }}>
        <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in oklab, #12a150 14%, var(--surface))", color: "#12a150" }}><Wallet className="w-3.5 h-3.5" strokeWidth={2.2} /></span>
        <span className="text-[11.5px] text-ink-3">{s.givingTitle}</span>
        <span className="ml-auto text-[14px] font-semibold text-ink tabular-nums">{s.giving}</span>
      </div>
    </div>
  );
}

/* ── HR: команда по служіннях і запит, який чекає на «так» ─── */
function HrCard({ s, accent }: Card<"hr">) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-2">
        {s.depts.map((d, i) => (
          <div key={d.name} className="mock-pop rounded-xl bg-surface-2 border border-hairline px-2.5 py-2 flex flex-col gap-1" style={{ animationDelay: `${80 + i * 70}ms` }}>
            <span className="text-[16px] font-semibold text-ink leading-none tabular-nums">{d.count}</span>
            <span className="text-[10.5px] text-ink-3 leading-none truncate">{d.name}</span>
          </div>
        ))}
      </div>
      <div className="mock-row rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 flex items-center gap-2.5" style={{ animationDelay: "300ms" }}>
        <PersonAvatar look={lookFor(s.requestWho)} size={28} />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none truncate">{s.requestTitle} · {s.requestWho}</span>
          <span className="text-[12.5px] text-ink leading-none mt-1.5 truncate">{s.requestWhat}</span>
        </div>
      </div>
      <div className="mock-row flex justify-end" style={{ animationDelay: "420ms" }}>
        <Act label={s.approve} done={ok} doneLabel={s.approved} onClick={() => setOk(true)} accent={accent} icon={Check} />
      </div>
    </div>
  );
}

/* ── Бухгалтер: місяць у трьох кольорах і вивантаження ─────── */
function AccountantCard({ s, accent }: Card<"accountant">) {
  const [exp, setExp] = useState(false);
  const COLORS = [accent, "#0ea5e9", "#f59e0b"];
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mock-pop rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2.5" style={{ animationDelay: "80ms" }}>
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10.5px] text-ink-3 leading-none">{s.totalLabel} · {s.month}</span>
            <span className="text-[20px] font-semibold text-ink leading-none tracking-[-0.4px] tabular-nums mt-1.5">{s.total}</span>
          </div>
          <span className="text-[11px] font-medium text-[#0e7a3c] dark:text-[#3ddc97] leading-none whitespace-nowrap">{s.delta}</span>
        </div>
        <span className="flex h-2 rounded-full overflow-hidden bg-surface">
          {s.slices.map((sl, i) => (
            <span key={sl.label} className="block h-full origin-left" style={{ width: `${sl.pct}%`, background: COLORS[i], animation: `barGrowX 0.7s var(--ease-out-soft) ${260 + i * 130}ms both` }} />
          ))}
        </span>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {s.slices.map((sl, i) => (
            <span key={sl.label} className="flex items-center gap-1.5 text-[11px] text-ink-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS[i] }} />
              {sl.label}
              <span className="tabular-nums text-ink">{sl.pct}%</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mock-row flex justify-end" style={{ animationDelay: "420ms" }}>
        <Act label={s.export} done={exp} doneLabel={s.exported} onClick={() => setExp(true)} accent={accent} icon={Download} />
      </div>
    </div>
  );
}

/* ── Рецепція: знайшла людину — і відмітила за секунду ─────── */
function ReceptionCard({ s, accent }: Card<"reception">) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mock-pop rounded-xl border border-hairline bg-surface px-3 h-10 flex items-center gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" style={{ animationDelay: "80ms" }}>
        <Search className="w-3.5 h-3.5 text-ink-3" />
        <span className="text-[13px] text-ink">{s.query}<span className="inline-block w-[2px] h-3.5 bg-ink align-middle ml-0.5 animate-pulse" /></span>
        <span className="ml-auto text-[10.5px] text-ink-3 truncate">{s.search}</span>
      </div>
      <div
        className="mock-row rounded-xl border bg-surface-2 px-3 py-2.5 flex items-center gap-2.5"
        style={{ animationDelay: "240ms", borderColor: ok ? "#12a150" : `color-mix(in oklab, ${accent} 40%, transparent)` }}
      >
        <PersonAvatar look={lookFor(s.foundName)} size={30} />
        <div className="flex flex-col min-w-0">
          <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{s.foundName}</span>
          <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{s.foundMeta}</span>
        </div>
        <button
          type="button"
          data-demo="click"
          onClick={() => setOk(true)}
          disabled={ok}
          aria-label={s.checkinsLabel}
          className="ml-auto w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 transition-colors duration-300 disabled:cursor-default"
          style={{ background: ok ? "#12a150" : accent }}
        >
          {ok ? <Check className="w-4 h-4" strokeWidth={3} /> : <UserCheck className="w-4 h-4" strokeWidth={2.4} />}
        </button>
      </div>
      <div className="mock-row rounded-xl px-3 py-2.5 flex items-center gap-2 text-white" style={{ animationDelay: "360ms", background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 60%, #000))` }}>
        <span className="text-[20px] font-semibold leading-none tabular-nums">{s.checkins + (ok ? 1 : 0)}</span>
        <span className="text-[11px] opacity-85 leading-[1.2]">{s.checkinsLabel}</span>
        <span className="ml-auto text-[11px] opacity-85 whitespace-nowrap">{s.guests}</span>
      </div>
    </div>
  );
}

/* ── Пастор · аналітика: тренд явки і хто зникає ───────────── */
function PastorFocus({ s, accent }: Card<"pastor">) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2" style={{ animationDelay: "80ms" }}>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.chartLabel}</span>
        <div className="flex items-end gap-1.5 h-[56px]">
          {BARS.map((h, i) => (
            <div key={i} className="mock-bar flex-1 rounded-[3px] origin-bottom" style={{ height: `${h}%`, background: i === BARS.length - 1 ? accent : `color-mix(in oklab, ${accent} 28%, var(--surface))`, animationDelay: `${200 + i * 60}ms` }} />
          ))}
        </div>
      </div>
      <div data-demo="hover" className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2" style={{ animationDelay: "260ms" }}>
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">
          <span className="relative flex w-1.5 h-1.5"><span className="pulse-ring absolute inset-0 rounded-full bg-[#ff9500]" /><span className="relative w-1.5 h-1.5 rounded-full bg-[#ff9500]" /></span>
          {s.attentionTitle}
        </span>
        {s.attention.map((a, i) => (
          <div key={a.name} className="mock-row flex items-center gap-2" style={{ animationDelay: `${360 + i * 90}ms` }}>
            <PersonAvatar look={lookFor(a.name)} size={22} />
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-medium text-ink leading-none truncate">{a.name}</span>
              <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{a.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Лідер · Telegram: бот питає, лідер тисне кнопку в чаті ── */
function LeaderTelegram({ s }: Card<"leader">) {
  const [sent, setSent] = useState(false);
  const botName = useT().automations.botName;
  return (
    <div className="rounded-xl border border-hairline overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#229ED9] text-white">
        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Send className="w-3 h-3" strokeWidth={2.4} /></span>
        <span className="text-[12px] font-semibold leading-none">{botName}</span>
        <span className="ml-auto text-[10.5px] opacity-85 leading-none">Telegram</span>
      </div>
      <div className="chat-wallpaper p-3 flex flex-col gap-2">
        <div className="bubble-in max-w-[88%] rounded-2xl rounded-tl-[4px] bg-surface border border-hairline px-3 py-2">
          <span className="text-[12.5px] text-ink leading-[1.4]">{s.alert}</span>
        </div>
        <button
          type="button"
          data-demo="click"
          onClick={() => setSent(true)}
          disabled={sent}
          className="bubble-in self-start inline-flex items-center gap-2 h-9 px-4 rounded-full bg-surface border border-[#229ED9]/50 text-[12.5px] font-semibold text-[#229ED9] transition-opacity duration-200 disabled:opacity-0"
          style={{ animationDelay: "220ms" }}
        >
          <Send className="w-3.5 h-3.5" strokeWidth={2.4} />
          {s.cta}
        </button>
        {sent && (
          <div className="bubble-in self-end max-w-[88%] rounded-2xl rounded-br-[4px] bg-[#229ED9] text-white px-3 py-2 flex items-center gap-1.5">
            <span className="text-[12.5px] leading-[1.4]">{s.sent}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Служитель · задачі: відмітив — і воно зникло зі списку ── */
function VolunteerTasks({ s, accent }: Card<"volunteer">) {
  const [on, setOn] = useState(() => s.tasks.map(() => false));
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.tasksTitle}</span>
      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline">
        {s.tasks.map((task, i) => (
          <li key={task} className="mock-row flex items-center gap-2.5 px-3 py-2.5" style={{ animationDelay: `${100 + i * 90}ms` }}>
            <button
              type="button"
              data-demo={i === 0 ? "click" : undefined}
              onClick={() => setOn((prev) => prev.map((v, k) => (k === i ? !v : v)))}
              aria-pressed={on[i]}
              className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-200"
              style={{ background: on[i] ? accent : "var(--surface)", borderColor: on[i] ? accent : "var(--hairline-strong)" }}
            >
              {on[i] && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}
            </button>
            <span className={["text-[12.5px] leading-[1.3]", on[i] ? "text-ink-3 line-through" : "text-ink"].join(" ")}>{task}</span>
          </li>
        ))}
      </ul>
      <div data-demo="hover" className="mock-row rounded-xl border border-hairline bg-surface-2 px-3 py-2 flex items-center gap-2 text-[12px] text-ink-2" style={{ animationDelay: "340ms" }}>
        <Repeat className="w-3.5 h-3.5" />{s.swap}
      </div>
    </div>
  );
}

/* ── Відвідувач · супровід: привітання від живої людини ────── */
function VisitorWelcome({ s }: Card<"visitor">) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <PersonAvatar look={lookFor(s.name)} size={30} />
        <div className="flex flex-col min-w-0">
          <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{s.name}</span>
          <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{s.firstVisit}</span>
        </div>
      </div>
      <div data-demo="hover" className="mock-pop rounded-xl rounded-tl-[4px] bg-surface-2 border border-hairline p-3 flex flex-col gap-1.5" style={{ animationDelay: "200ms" }}>
        <span className="text-[12.5px] text-ink leading-[1.45]">{s.welcome}</span>
        <span className="text-[10.5px] text-ink-3">{s.responsible}</span>
      </div>
    </div>
  );
}

/* ── Член церкви · групи і сім'я ───────────────────────────── */
function MemberGroup({ s }: Card<"member">) {
  return (
    <div className="flex flex-col gap-2.5">
      <div data-demo="hover" className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-1" style={{ animationDelay: "80ms" }}>
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Users className="w-3 h-3" />{s.groupTitle}</span>
        <span className="text-[13px] font-medium text-ink leading-[1.3]">{s.group}</span>
        <span className="text-[11px] text-ink-3 leading-[1.3]">{s.groupWhen}</span>
      </div>
      <div className="mock-row rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2" style={{ animationDelay: "240ms" }}>
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Heart className="w-3 h-3" />{s.familyTitle}</span>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">{[1, 2, 3].map((k) => <PersonAvatar key={k} look={AVATAR_LOOKS[k % AVATAR_LOOKS.length]} size={22} className="ring-2 ring-surface rounded-full" />)}</div>
          <span className="text-[11.5px] text-ink-2 leading-[1.3] truncate">{s.family}</span>
        </div>
      </div>
    </div>
  );
}

/* ── HR · оргструктура: хто під ким і скільки людей ────────── */
function HrTree({ s, accent }: Card<"hr">) {
  const ICONS = [Music, Baby, Video];
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2 text-[10.5px] text-ink-3">
        <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" />{s.team}</span>
        <span className="flex items-center gap-1.5 truncate" style={{ color: accent }}><TrendingUp className="w-3 h-3" />{s.newcomers}</span>
      </div>
      <div className="relative flex flex-col items-center gap-3.5 pt-0.5">
        <div data-demo="hover" className="mock-pop flex items-center gap-2 rounded-full bg-surface border border-hairline pl-1 pr-3 py-1 z-10" style={{ animationDelay: "100ms" }}>
          <PersonAvatar look={lookFor(s.root)} size={24} />
          <span className="text-[12px] font-semibold text-ink">{s.root}</span>
        </div>
        <span className="absolute top-[34px] left-1/2 -translate-x-1/2 w-[2px] h-3.5 bg-hairline-strong" />
        <span className="absolute top-[47px] left-[16%] right-[16%] h-[2px] bg-hairline-strong" />
        <div className="grid grid-cols-3 gap-2 w-full">
          {s.depts.map((d, i) => {
            const I = ICONS[i] ?? Users;
            return (
              <div key={d.name} className="relative mock-pop rounded-xl bg-surface-2 border border-hairline p-2 flex flex-col items-center gap-1 text-center" style={{ animationDelay: `${260 + i * 100}ms` }}>
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[2px] h-3.5 bg-hairline-strong" />
                <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: `color-mix(in oklab, ${accent} 72%, var(--ink))` }}><I className="w-3.5 h-3.5" strokeWidth={2.2} /></span>
                <span className="text-[11px] font-medium text-ink leading-none truncate max-w-full">{d.name}</span>
                <span className="text-[10.5px] text-ink-3 tabular-nums leading-none">{d.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Бухгалтер · рух коштів рядками ────────────────────────── */
function AccountantLedger({ s }: Card<"accountant">) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.month}</span>
      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline">
        {s.rows.map((r, i) => (
          <li key={r.name} data-demo={i === 1 ? "hover" : undefined} className="mock-row flex items-center justify-between gap-2 px-3 py-2.5 text-[12.5px]" style={{ animationDelay: `${100 + i * 90}ms` }}>
            <span className="text-ink truncate">{r.name}</span>
            <span className={["font-semibold tabular-nums whitespace-nowrap", r.amount.startsWith("+") ? "text-[#0e7a3c] dark:text-[#3ddc97]" : "text-ink"].join(" ")}>{r.amount}</span>
          </li>
        ))}
      </ul>
      <div className="mock-row flex items-center justify-between gap-2 rounded-xl bg-surface-2 border border-hairline px-3 py-2.5" style={{ animationDelay: "400ms" }}>
        <span className="text-[11px] text-ink-3">{s.totalLabel}</span>
        <span className="text-[15px] font-semibold text-ink tabular-nums">{s.total}</span>
      </div>
    </div>
  );
}

/* ── Рецепція · кімнати і останній скан ────────────────────── */
function ReceptionRooms({ s, accent }: Card<"reception">) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><DoorOpen className="w-3.5 h-3.5" />{s.roomsTitle}</span>
      {s.rooms.map((r, i) => (
        <div key={r.name} data-demo={i === 0 ? "hover" : undefined} className="mock-row flex items-center gap-2 rounded-xl bg-surface-2 border border-hairline px-3 py-2.5 text-[12.5px]" style={{ animationDelay: `${100 + i * 100}ms` }}>
          <span className="font-medium text-ink whitespace-nowrap">{r.name}</span>
          <span className="flex items-center gap-1 text-ink-3 whitespace-nowrap"><Clock className="w-3 h-3" />{r.time}</span>
          <span className="ml-auto text-ink-2 truncate">{r.who}</span>
        </div>
      ))}
      <div className="mock-row rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 flex items-center gap-2 text-[11.5px] text-ink-2" style={{ animationDelay: "340ms" }}>
        <ScanLine className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
        <span className="truncate">{s.lastScan}</span>
      </div>
    </div>
  );
}

/* ── Пастор · кемпуси: перемкнув локацію — цифри інші ──────── */
function PastorCampus({ s, accent }: Card<"pastor">) {
  const [i, setI] = useState(0);
  const c = s.campuses[i];
  const tiles = [
    { v: c.people, l: s.campusPeople },
    { v: c.att, l: s.campusAtt },
    { v: c.growth, l: s.campusGrowth },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Building2 className="w-3 h-3" />{s.campusTitle}</span>
      <div className="mock-pop flex gap-1 rounded-full bg-surface-2 border border-hairline p-1" style={{ animationDelay: "80ms" }}>
        {s.campuses.map((cp, k) => (
          <button
            key={cp.name}
            type="button"
            data-demo={k === 1 ? "click" : undefined}
            onClick={() => setI(k)}
            className="flex-1 h-7 rounded-full text-[11.5px] font-semibold leading-none transition-colors duration-200 truncate px-2"
            style={k === i ? { background: accent, color: "#fff" } : { color: "var(--ink-3)" }}
          >
            {cp.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t, k) => (
          <div key={t.l} className="rounded-xl bg-surface-2 border border-hairline px-3 py-2.5 flex flex-col gap-1">
            <span key={`${i}-${t.v}`} className="mock-pop text-[18px] font-semibold text-ink leading-none tracking-[-0.3px] tabular-nums" style={{ animationDelay: `${k * 60}ms` }}>{t.v}</span>
            <span className="text-[11px] text-ink-3 leading-none truncate">{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Лідер · розсилка: обрав, кому саме, і надіслав ────────── */
function LeaderBroadcast({ s, accent }: Card<"leader">) {
  const [seg, setSeg] = useState(0);
  const [sent, setSent] = useState(false);
  const g = s.segments[seg];
  return (
    <div className="flex flex-col gap-2.5">
      <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Megaphone className="w-3 h-3" />{s.sendTitle}</span>
      <div className="flex flex-wrap gap-1.5">
        {s.segments.map((sg, k) => (
          <button
            key={sg.label}
            type="button"
            data-demo={k === 1 ? "click" : undefined}
            onClick={() => setSeg(k)}
            className="mock-row rounded-full border px-3 h-7 text-[11.5px] font-medium leading-none transition-colors duration-200"
            style={{ animationDelay: `${80 + k * 70}ms`, borderColor: k === seg ? accent : "var(--hairline)", background: k === seg ? `color-mix(in oklab, ${accent} 12%, var(--surface))` : "var(--surface)", color: k === seg ? `color-mix(in oklab, ${accent} 72%, var(--ink))` : "var(--ink-3)" }}
          >
            {sg.label}
          </button>
        ))}
      </div>
      <div className="mock-row rounded-xl rounded-tl-[4px] bg-surface-2 border border-hairline px-3 py-2.5" style={{ animationDelay: "300ms" }}>
        <span className="text-[12.5px] text-ink leading-[1.45]">{s.draft}</span>
      </div>
      <div className="flex items-center gap-2">
        <span key={seg} className="mock-pop text-[11.5px] text-ink-3 tabular-nums">{g.count} {s.segmentHint}</span>
        <span className="ml-auto"><Act label={s.sendCta} done={sent} doneLabel={s.sendDone} onClick={() => setSent(true)} accent={accent} icon={Send} /></span>
      </div>
    </div>
  );
}

/* ── Диякон · заявки: потребу видно, поки її ніхто не взяв ─── */
function DeaconNeeds({ s, accent }: Card<"deacon">) {
  const [taken, setTaken] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Inbox className="w-3 h-3" />{s.needsTitle}</span>
      {s.needs.map((n, i) => (
        <div
          key={n.who}
          data-demo={i === 1 ? "hover" : undefined}
          className="mock-row rounded-xl border bg-surface-2 px-3 py-2.5 flex items-center gap-2.5"
          style={{ animationDelay: `${100 + i * 100}ms`, borderColor: i === 0 && !taken ? "color-mix(in oklab, #ff9500 50%, transparent)" : "var(--hairline)" }}
        >
          <PersonAvatar look={lookFor(n.who)} size={28} />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{n.who}</span>
            <span className="text-[11px] text-ink-3 leading-none mt-1 truncate">{n.what}</span>
          </div>
          <span className="text-[10.5px] text-ink-3 whitespace-nowrap">{n.when}</span>
        </div>
      ))}
      <div className="mock-row flex justify-end" style={{ animationDelay: "340ms" }}>
        <Act label={s.takeCta} done={taken} doneLabel={s.takeDone} onClick={() => setTaken(true)} accent={accent} icon={HeartHandshake} />
      </div>
    </div>
  );
}

/* ── Диякон · відвідування: відмітив, кого вже провідав ────── */
function DeaconVisits({ s, accent }: Card<"deacon">) {
  const [on, setOn] = useState(() => s.visits.map((_, i) => i === 0));
  const done = on.filter(Boolean).length;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Route className="w-3 h-3" />{s.visitsTitle}</span>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none tabular-nums" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: `color-mix(in oklab, ${accent} 72%, var(--ink))` }}>
          {done}/{s.visits.length} {s.visitedLabel}
        </span>
      </div>
      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline">
        {s.visits.map((v, i) => (
          <li key={v.name} className="mock-row flex items-center gap-2.5 px-3 py-2" style={{ animationDelay: `${100 + i * 80}ms` }}>
            <PersonAvatar look={lookFor(v.name)} size={26} />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12.5px] font-medium text-ink leading-none truncate">{v.name}</span>
              <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{v.note}</span>
            </div>
            <button
              type="button"
              data-demo={i > 0 ? "click" : undefined}
              onClick={() => setOn((prev) => prev.map((x, k) => (k === i ? !x : x)))}
              aria-pressed={on[i]}
              aria-label={`${s.visitedLabel}: ${v.name}`}
              className="w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-200"
              style={{ background: on[i] ? accent : "var(--surface)", borderColor: on[i] ? accent : "var(--hairline-strong)" }}
            >
              {on[i] && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Диякон · фонд милосердя: виплата з призначенням ───────── */
function DeaconFund({ s, accent }: Card<"deacon">) {
  const [paid, setPaid] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mock-pop rounded-xl bg-surface-2 border border-hairline p-3 flex flex-col gap-2.5" style={{ animationDelay: "80ms" }}>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.fundTitle}</span>
        <div className="flex items-end justify-between gap-3">
          <span className="flex flex-col">
            <span className="text-[20px] font-semibold text-ink leading-none tracking-[-0.4px] tabular-nums">{s.fundLeft}</span>
            <span className="text-[10.5px] text-ink-3 leading-none mt-1.5">{s.fundLeftLabel}</span>
          </span>
          <span className="flex flex-col items-end">
            <span className="text-[13px] font-medium text-ink-2 leading-none tabular-nums">{s.fundSpent}</span>
            <span className="text-[10.5px] text-ink-3 leading-none mt-1.5">{s.fundSpentLabel}</span>
          </span>
        </div>
        <span className="flex h-2 rounded-full overflow-hidden bg-surface">
          <span className="block h-full origin-left" style={{ width: "43%", background: accent, animation: "barGrowX 0.7s var(--ease-out-soft) 260ms both" }} />
        </span>
      </div>
      <div className="mock-row rounded-xl border border-hairline bg-surface-2 px-3 py-2.5 flex items-center gap-2.5" style={{ animationDelay: "280ms" }}>
        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: `color-mix(in oklab, ${accent} 72%, var(--ink))` }}><Wallet className="w-3.5 h-3.5" strokeWidth={2.2} /></span>
        <div className="flex flex-col min-w-0">
          <span className="text-[12.5px] font-medium text-ink leading-none truncate">{s.payWho}</span>
          <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{s.payWhat}</span>
        </div>
      </div>
      <div className="mock-row flex justify-end" style={{ animationDelay: "400ms" }}>
        <Act label={s.payCta} done={paid} doneLabel={s.payDone} onClick={() => setPaid(true)} accent={accent} icon={Wallet} />
      </div>
    </div>
  );
}

/* ── Служитель · заміна: обрав, кого попросити ─────────────── */
function VolunteerSwap({ s, accent }: Card<"volunteer">) {
  const [pick, setPick] = useState(-1);
  return (
    <div className="flex flex-col gap-2.5">
      <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Repeat className="w-3 h-3" />{s.swapTitle}</span>
      {s.candidates.map((c, i) => {
        const asked = pick === i;
        return (
          <div key={c.name} className="mock-row rounded-xl border bg-surface-2 px-3 py-2.5 flex items-center gap-2.5" style={{ animationDelay: `${100 + i * 100}ms`, borderColor: asked ? "#12a150" : "var(--hairline)" }}>
            <PersonAvatar look={lookFor(c.name)} size={28} />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{c.name}</span>
              <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{c.note}</span>
            </div>
            <button
              type="button"
              data-demo={i === 0 ? "click" : undefined}
              onClick={() => setPick(i)}
              disabled={pick >= 0}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11.5px] font-semibold shrink-0 transition-colors duration-300 disabled:cursor-default"
              style={asked ? { background: "#0e7a3c", color: "#fff" } : { background: `color-mix(in oklab, ${accent} 10%, var(--surface))`, border: `1px solid color-mix(in oklab, ${accent} 40%, transparent)`, color: `color-mix(in oklab, ${accent} 72%, var(--ink))` }}
            >
              {asked ? <><Check className="w-3.5 h-3.5" strokeWidth={3} />{s.swapDone}</> : s.swapPick}
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ── Відвідувач · анкета за QR: заповнюється з телефона ────── */
function VisitorForm({ s, accent }: Card<"visitor">) {
  const [filled, setFilled] = useState(0);
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}><QrCode className="w-4 h-4" strokeWidth={2} /></span>
        <span className="text-[12px] font-semibold text-ink leading-none">{s.formTitle}</span>
      </div>
      {s.fields.map((f, i) => {
        const on = filled > i;
        return (
          <button
            key={f.label}
            type="button"
            data-demo="click"
            onClick={() => setFilled((n) => Math.max(n, i + 1))}
            className="mock-row w-full rounded-xl border bg-surface px-3 py-2 flex flex-col items-start gap-0.5 text-left transition-colors duration-200"
            style={{ animationDelay: `${120 + i * 90}ms`, borderColor: on ? "var(--hairline)" : "var(--hairline-strong)" }}
          >
            <span className="text-[10px] uppercase tracking-[0.08em] text-ink-3 leading-none">{f.label}</span>
            <span className="text-[13px] leading-[1.3] text-ink">
              {on ? f.value : <span className="inline-block w-[2px] h-3.5 bg-ink align-middle animate-pulse" />}
            </span>
          </button>
        );
      })}
      <div className="flex items-center gap-2">
        <span className="text-[10.5px] text-ink-3 leading-[1.3] max-w-[150px]">{s.formHint}</span>
        <span className="ml-auto"><Act label={s.formCta} done={done} doneLabel={s.formDone} onClick={() => setDone(true)} accent={accent} icon={Send} /></span>
      </div>
    </div>
  );
}

/* ── Член церкви · пожертва: сума в два дотики ─────────────── */
function MemberGiving({ s, accent }: Card<"member">) {
  const [amt, setAmt] = useState(-1);
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "color-mix(in oklab, #12a150 14%, var(--surface))", color: "#12a150" }}><Wallet className="w-3.5 h-3.5" strokeWidth={2.2} /></span>
        <div className="flex flex-col min-w-0">
          <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{s.giveTitle}</span>
          <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{s.givePurpose}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {s.amounts.map((a, i) => (
          <button
            key={a}
            type="button"
            data-demo={i === 1 ? "click" : undefined}
            onClick={() => setAmt(i)}
            className="mock-pop h-10 rounded-xl border text-[13px] font-semibold tabular-nums transition-colors duration-200"
            style={{ animationDelay: `${100 + i * 70}ms`, borderColor: i === amt ? accent : "var(--hairline)", background: i === amt ? `color-mix(in oklab, ${accent} 12%, var(--surface))` : "var(--surface-2)", color: i === amt ? `color-mix(in oklab, ${accent} 72%, var(--ink))` : "var(--ink)" }}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="mock-row flex justify-end" style={{ animationDelay: "380ms" }}>
        <Act label={s.giveCta} done={done} doneLabel={s.giveDone} onClick={() => setDone(true)} accent={accent} icon={Heart} />
      </div>
    </div>
  );
}

/* ── HR · навантаження: зняв одне служіння — людина дихає ──── */
function HrLoad({ s, accent }: Card<"hr">) {
  const [off, setOff] = useState<number[]>([]);
  const left = s.loadDuties.length - off.length;
  const over = left > 2;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Gauge className="w-3 h-3" />{s.loadTitle}</span>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none transition-colors duration-300" style={over ? { background: "rgba(255,149,0,0.14)", color: "#c46a00" } : { background: "rgba(18,161,80,0.14)", color: "#0e7a3c" }}>
          {over ? s.loadOver : s.loadOk}
        </span>
      </div>
      <div className="mock-row rounded-xl border border-hairline bg-surface-2 p-3 flex flex-col gap-2.5" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center gap-2.5">
          <PersonAvatar look={lookFor(s.loadWho)} size={28} />
          <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{s.loadWho}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {s.loadDuties.map((d, i) => {
            const gone = off.includes(i);
            return (
              <button
                key={d}
                type="button"
                data-demo={i === 2 ? "click" : undefined}
                onClick={() => setOff((prev) => (prev.includes(i) ? prev : [...prev, i]))}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 h-7 text-[11.5px] font-medium leading-none transition-all duration-300"
                style={gone ? { borderColor: "var(--hairline)", color: "var(--ink-3)", textDecoration: "line-through", opacity: 0.55 } : { borderColor: `color-mix(in oklab, ${accent} 40%, transparent)`, background: `color-mix(in oklab, ${accent} 10%, var(--surface))`, color: `color-mix(in oklab, ${accent} 72%, var(--ink))` }}
              >
                {d}
              </button>
            );
          })}
        </div>
        <span className="flex h-1.5 rounded-full overflow-hidden bg-surface">
          <span className="block h-full transition-all duration-500" style={{ width: `${(left / s.loadDuties.length) * 100}%`, background: over ? "#ff9500" : "#12a150" }} />
        </span>
      </div>
      <span className="text-[10.5px] text-ink-3 leading-[1.35]">{s.loadHint}</span>
    </div>
  );
}

/* ── Бухгалтер · звірка: рознести надходження по призначенню ─ */
function AccountantReconcile({ s, accent }: Card<"accountant">) {
  const [on, setOn] = useState(() => s.pending.map(() => false));
  const [done, setDone] = useState(false);
  const picked = on.filter(Boolean).length;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">{s.reconcileTitle}</span>
        <span className="text-[11px] text-ink-3 tabular-nums">{picked}/{s.pending.length}</span>
      </div>
      <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline">
        {s.pending.map((r, i) => (
          <li key={r.name} className="mock-row flex items-center gap-2.5 px-3 py-2" style={{ animationDelay: `${100 + i * 80}ms` }}>
            <button
              type="button"
              data-demo={i < 2 ? "click" : undefined}
              onClick={() => setOn((prev) => prev.map((v, k) => (k === i ? !v : v)))}
              aria-pressed={on[i]}
              aria-label={r.name}
              className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-200"
              style={{ background: on[i] ? accent : "var(--surface)", borderColor: on[i] ? accent : "var(--hairline-strong)" }}
            >
              {on[i] && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}
            </button>
            <span className="flex-1 text-[12.5px] text-ink leading-none truncate">{r.name}</span>
            <span className="text-[12.5px] font-semibold text-[#0e7a3c] dark:text-[#3ddc97] tabular-nums whitespace-nowrap">{r.amount}</span>
          </li>
        ))}
      </ul>
      <div className="mock-row flex justify-end" style={{ animationDelay: "380ms" }}>
        <Act label={s.reconcileCta} done={done} doneLabel={s.reconcileDone} onClick={() => setDone(true)} accent={accent} icon={Coins} />
      </div>
    </div>
  );
}

/* ── Рецепція · дитяче містечко: бейдж, без якого не віддадуть ─ */
function ReceptionKids({ s, accent }: Card<"reception">) {
  const [pick, setPick] = useState(-1);
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3"><Baby className="w-3.5 h-3.5" />{s.kidsTitle}</span>
      {s.kids.map((k, i) => (
        <button
          key={k.name}
          type="button"
          data-demo={i === 0 ? "click" : undefined}
          onClick={() => setPick(i)}
          className="mock-row w-full rounded-xl border bg-surface-2 px-3 py-2.5 flex items-center gap-2.5 text-left transition-colors duration-200"
          style={{ animationDelay: `${100 + i * 90}ms`, borderColor: pick === i ? accent : "var(--hairline)" }}
        >
          <PersonAvatar look={lookFor(k.name)} size={28} />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{k.name}</span>
            <span className="text-[10.5px] text-ink-3 leading-none mt-1 truncate">{k.note}</span>
          </div>
          {pick === i && <Check className="w-4 h-4 shrink-0" strokeWidth={3} style={{ color: accent }} />}
        </button>
      ))}
      <div className="flex items-center gap-2">
        <span className="text-[10.5px] text-ink-3 leading-[1.3] max-w-[150px]">{done ? s.badgeNote : s.kidsParent}</span>
        <span className="ml-auto"><Act label={s.badgeCta} done={done} doneLabel={s.badgeDone} onClick={() => setDone(true)} accent={accent} icon={Ticket} /></span>
      </div>
    </div>
  );
}

function Body({ id, accent, scene }: { id: string; accent: string; scene: number }) {
  const sc = useT().audience.screens;
  const pick = <T,>(a: T, b: T, c: T) => (scene === 0 ? a : scene === 1 ? b : c);
  switch (id) {
    case "pastor": return pick(<PastorCard s={sc.pastor} accent={accent} />, <PastorFocus s={sc.pastor} accent={accent} />, <PastorCampus s={sc.pastor} accent={accent} />);
    case "leader": return pick(<LeaderCard s={sc.leader} accent={accent} />, <LeaderTelegram s={sc.leader} accent={accent} />, <LeaderBroadcast s={sc.leader} accent={accent} />);
    case "deacon": return pick(<DeaconNeeds s={sc.deacon} accent={accent} />, <DeaconVisits s={sc.deacon} accent={accent} />, <DeaconFund s={sc.deacon} accent={accent} />);
    case "volunteer": return pick(<VolunteerCard s={sc.volunteer} accent={accent} />, <VolunteerTasks s={sc.volunteer} accent={accent} />, <VolunteerSwap s={sc.volunteer} accent={accent} />);
    case "visitor": return pick(<VisitorCard s={sc.visitor} accent={accent} />, <VisitorWelcome s={sc.visitor} accent={accent} />, <VisitorForm s={sc.visitor} accent={accent} />);
    case "member": return pick(<MemberCard s={sc.member} accent={accent} />, <MemberGroup s={sc.member} accent={accent} />, <MemberGiving s={sc.member} accent={accent} />);
    case "hr": return pick(<HrCard s={sc.hr} accent={accent} />, <HrTree s={sc.hr} accent={accent} />, <HrLoad s={sc.hr} accent={accent} />);
    case "accountant": return pick(<AccountantCard s={sc.accountant} accent={accent} />, <AccountantLedger s={sc.accountant} accent={accent} />, <AccountantReconcile s={sc.accountant} accent={accent} />);
    case "reception": return pick(<ReceptionCard s={sc.reception} accent={accent} />, <ReceptionRooms s={sc.reception} accent={accent} />, <ReceptionKids s={sc.reception} accent={accent} />);
    default: return null;
  }
}

/* Одна роль на сцені: привидний курсор з її ім'ям заходить і тисне ту саму
   кнопку, яку ця людина тисне в житті. Коли сцена догралася, вона сама
   передає естафету — тому в кадрі завжди рівно один курсор. */
function Panel({ id, scene, run, startDelay, onDone }: { id: string; scene: number; run: number; startDelay: number; onDone: () => void }) {
  const t = useT().audience;
  const role = t.roles.find((r) => r.id === id);
  if (!role) return null;
  const Icon = ROLE_ICONS[id];
  const accent = ROLE_ACCENTS[id];
  const touch = TOUCH.has(`${id}-${scene}`);

  return (
    <CursorDemo
      playKey={`${id}-${run}`}
      startDelay={startDelay}
      onDone={onDone}
      label={role.short}
      look={AVATAR_LOOKS[LOOK[id] ?? 0]}
      accent={accent}
      mode={touch ? "touch" : "pointer"}
    >
      <div className="mock-on rounded-[22px] bg-surface border border-hairline shadow-[0_28px_60px_-40px_rgba(0,40,100,0.5)] overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-hairline" style={{ background: `linear-gradient(120deg, color-mix(in oklab, ${accent} 12%, var(--surface)), var(--surface-2))` }}>
          <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-surface border border-hairline" style={{ color: accent }}>
            <Icon className="w-[19px] h-[19px]" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-ink leading-[1.2] truncate">{role.name}</span>
            <span className="text-[11.5px] text-ink-3 leading-none mt-0.5 truncate">{role.screen.title}</span>
          </span>
          {/* Лічильник сцен замість дев'яти однакових кнопок «розгорнути»:
              видно, що екран не один, і що показ сам іде далі. */}
          <span aria-hidden className="ml-auto flex items-center gap-1.5 shrink-0">
            {Array.from({ length: SCENES }, (_, k) => (
              <span
                key={k}
                className="block w-1.5 h-1.5 rounded-full transition-colors duration-300"
                style={{ background: k === scene ? accent : "var(--hairline-strong)" }}
              />
            ))}
          </span>
        </div>
        <div key={run} className="p-5">
          <Body id={id} accent={accent} scene={scene} />
        </div>
      </div>
    </CursorDemo>
  );
}

/* Порядок сторінки: спершу ті, хто веде, далі ті, хто служить щотижня,
   потім ті, хто тримає структуру й гроші, — і наприкінці ті, заради кого
   все це робиться. */
const GROUPS: { key: "lead" | "serve" | "admin" | "come"; ids: string[] }[] = [
  { key: "lead", ids: ["pastor", "leader", "deacon"] },
  { key: "serve", ids: ["volunteer", "reception"] },
  { key: "admin", ids: ["hr", "accountant"] },
  { key: "come", ids: ["visitor", "member"] },
];

/* Один блок — одна роль: ліворуч чим вона живе, праворуч її живий екран.
   Тиснути нічого не треба — екран заводиться сам, коли доїхав у кадр, і
   сам переходить до наступної сцени тієї ж ролі. */
function RoleBlock({ id, flip }: { id: string; flip: boolean }) {
  const t = useT().audience;
  const [cur, setCur] = useState({ scene: 0, run: 0 });
  const role = t.roles.find((r) => r.id === id);
  if (!role) return null;
  const accent = ROLE_ACCENTS[id];
  const Icon = ROLE_ICONS[id];

  return (
    <article className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] gap-6 lg:gap-14 items-center">
      <FadeIn className={cn("flex flex-col gap-4 min-w-0", flip && "lg:order-2")}>
        <span
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: `color-mix(in oklab, ${accent} 13%, var(--surface))`, color: accent }}
        >
          <Icon className="w-[22px] h-[22px]" strokeWidth={2.1} />
        </span>
        <div className="flex flex-col gap-2.5">
          <h3 className="font-semibold text-ink text-[28px] md:text-[34px] leading-[1.1] tracking-[-1px]">
            {t.blocks.for} {role.plural}
          </h3>
          <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.55]">{role.hero.subtitle}</p>
        </div>
        <ul className="flex flex-col gap-2">
          {role.hero.proof.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-[14.5px] text-ink leading-[1.45]">
              <span
                className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-[2px]"
                style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
              >
                <Check className="w-3 h-3" strokeWidth={3.2} />
              </span>
              {p}
            </li>
          ))}
        </ul>
        <Link
          href={`/for-whom/${role.id}`}
          className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold w-fit"
          style={{ color: `color-mix(in oklab, ${accent} 78%, var(--ink))` }}
        >
          {t.more}
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </FadeIn>

      <FadeIn delay={1} variant="scale" className={cn("min-w-0", flip && "lg:order-1")}>
        <Panel
          id={id}
          scene={cur.scene}
          run={cur.run}
          startDelay={700}
          onDone={() => setCur((c) => ({ scene: (c.scene + 1) % SCENES, run: c.run + 1 }))}
        />
      </FadeIn>
    </article>
  );
}

/* Дев'ять ролей — дев'ять великих блоків поспіль, без вкладок і без вибору:
   сторінку просто гортають, а кожен екран програє себе сам. Ролі згруповані
   за тим, що людина робить у церкві, — щоб довгий список читався. */
export default function AudienceStage() {
  const t = useT().audience;
  let n = 0;

  return (
    <section className="w-full flex flex-col items-center gap-12 md:gap-20 pt-4 md:pt-8 pb-14 md:pb-20">
      {GROUPS.map((g) => (
        <div key={g.key} className="w-full flex flex-col items-center gap-12 md:gap-20">
          <FadeIn className="w-full max-w-[1120px] px-5 md:px-8 flex items-center gap-4">
            <h2 className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-3 whitespace-nowrap">
              {t.blocks.groups[g.key]}
            </h2>
            <span aria-hidden className="h-px flex-1 bg-hairline" />
          </FadeIn>
          {g.ids.map((id) => (
            <RoleBlock key={id} id={id} flip={n++ % 2 === 1} />
          ))}
        </div>
      ))}
    </section>
  );
}
