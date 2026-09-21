"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, Sparkles, Send, HeartHandshake, CalendarCheck, QrCode, Ticket, Inbox, Coins, Baby,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CursorDemo from "@/components/shared/cursor-demo";
import PersonAvatar, { AVATAR_LOOKS } from "@/components/shared/person-avatar";
import { ROLE_ICONS, ROLE_ACCENTS } from "@/components/shared/role-icons";
import {
  PastorScreen, LeaderScreen, DeaconScreen, VolunteerScreen, VisitorScreen, MemberScreen,
  HrScreen, AccountantScreen, ReceptionScreen,
} from "@/components/shared/role-screens";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

type T = ReturnType<typeof useT>;
type Role = T["audience"]["roles"][number];
type Screens = T["audience"]["screens"];

/* Дев'ять ролей на вісім облич — дублікат віддали найдальшій парі в списку. */
const LOOK: Record<string, number> = { pastor: 0, leader: 2, deacon: 6, volunteer: 4, visitor: 1, member: 3, hr: 5, accountant: 6, reception: 7 };

/* Скільки ролей одночасно в кадрі: одна велика панель і одна мала. Три
   курсори розсіювали увагу — за великою панеллю вже ніхто не стежив. */
const ON_STAGE = 2;

/* Стрічка внизу вікна змінює рядок рідше, ніж курсори тиснуть кнопки, —
   інакше очі не знають, за чим стежити. */
const FEED_MS = 2600;

/* ── Велика панель: справжній екран ролі ───────────────────── */
function RoleBody({ id, sc }: { id: string; sc: Screens }) {
  const accent = ROLE_ACCENTS[id];
  switch (id) {
    case "pastor": return <PastorScreen s={sc.pastor} accent={accent} />;
    case "leader": return <LeaderScreen s={sc.leader} accent={accent} />;
    case "deacon": return <DeaconScreen s={sc.deacon} accent={accent} />;
    case "volunteer": return <VolunteerScreen s={sc.volunteer} accent={accent} />;
    case "visitor": return <VisitorScreen s={sc.visitor} accent={accent} />;
    case "member": return <MemberScreen s={sc.member} accent={accent} />;
    case "hr": return <HrScreen s={sc.hr} accent={accent} />;
    case "accountant": return <AccountantScreen s={sc.accountant} accent={accent} />;
    case "reception": return <ReceptionScreen s={sc.reception} accent={accent} />;
    default: return null;
  }
}

/* ── Мала панель: одна дія, яку ця роль справді тисне ──────── */
type MiniRow = { title: string; note?: string; amount?: string; look?: number };
type Mini = { icon: LucideIcon; title: string; text?: string; rows?: MiniRow[]; cta: string; done: string };

function miniOf(id: string, sc: Screens): Mini | null {
  switch (id) {
    case "pastor":
      return { icon: Sparkles, title: sc.pastor.aiTitle, text: sc.pastor.aiText, cta: sc.pastor.aiCta, done: sc.pastor.aiDone };
    case "leader":
      return { icon: Send, title: sc.leader.sendTitle, text: sc.leader.draft, cta: sc.leader.sendCta, done: sc.leader.sendDone };
    case "deacon":
      return {
        icon: HeartHandshake, title: sc.deacon.needsTitle,
        rows: sc.deacon.needs.map((n, i) => ({ title: n.who, note: `${n.what} · ${n.when}`, look: i + 1 })),
        cta: sc.deacon.takeCta, done: sc.deacon.takeDone,
      };
    case "volunteer":
      return {
        icon: CalendarCheck, title: sc.volunteer.when,
        rows: [{ title: sc.volunteer.role, note: sc.volunteer.place }],
        cta: sc.volunteer.confirm, done: sc.volunteer.confirmed,
      };
    case "visitor":
      return {
        icon: QrCode, title: sc.visitor.formTitle,
        rows: sc.visitor.fields.map((f) => ({ title: f.value, note: f.label })),
        cta: sc.visitor.formCta, done: sc.visitor.formDone,
      };
    case "member":
      return {
        icon: Ticket, title: sc.member.eventTitle,
        rows: [{ title: sc.member.eventDate, note: sc.member.eventPlace }],
        cta: sc.member.register, done: sc.member.registered,
      };
    case "hr":
      return {
        icon: Inbox, title: sc.hr.requestTitle,
        rows: [{ title: sc.hr.requestWho, note: sc.hr.requestWhat, look: 1 }],
        cta: sc.hr.approve, done: sc.hr.approved,
      };
    case "accountant":
      return {
        icon: Coins, title: sc.accountant.reconcileTitle,
        rows: sc.accountant.pending.slice(0, 2).map((r) => ({ title: r.name, amount: r.amount })),
        cta: sc.accountant.reconcileCta, done: sc.accountant.reconcileDone,
      };
    case "reception":
      return {
        icon: Baby, title: sc.reception.kidsTitle,
        rows: sc.reception.kids.map((k, i) => ({ title: k.name, note: k.note, look: i + 4 })),
        cta: sc.reception.badgeCta, done: sc.reception.badgeDone,
      };
    default: return null;
  }
}

function MiniBody({ mini, accent }: { mini: Mini; accent: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-col gap-2.5">
      {mini.text && <p className="mock-row text-[12.5px] text-ink leading-[1.45]" style={{ animationDelay: "120ms" }}>{mini.text}</p>}
      {mini.rows && (
        <ul className="rounded-xl border border-hairline bg-surface-2 divide-y divide-hairline">
          {mini.rows.map((r, i) => (
            <li key={r.title} className="mock-row flex items-center gap-2.5 px-2.5 py-2" style={{ animationDelay: `${120 + i * 80}ms` }}>
              {r.look !== undefined && <PersonAvatar look={AVATAR_LOOKS[r.look % AVATAR_LOOKS.length]} size={24} />}
              <span className="flex flex-col min-w-0 flex-1">
                <span className="text-[12.5px] font-medium text-ink leading-none truncate">{r.title}</span>
                {r.note && <span className="text-[10.5px] text-ink-3 leading-[1.25] mt-1 truncate">{r.note}</span>}
              </span>
              {r.amount && <span className="text-[12px] font-semibold text-[#0e7a3c] dark:text-[#3ddc97] tabular-nums whitespace-nowrap">{r.amount}</span>}
            </li>
          ))}
        </ul>
      )}
      <div className="mock-row flex justify-end" style={{ animationDelay: "320ms" }}>
        <button
          type="button"
          data-demo="click"
          onClick={() => setDone(true)}
          disabled={done}
          className="inline-flex items-center gap-2 h-8 px-3.5 rounded-full text-[12.5px] font-semibold text-white transition-all duration-300 disabled:cursor-default"
          style={{ background: done ? "#0e7a3c" : `color-mix(in oklab, ${accent} 78%, #04121f)`, boxShadow: done ? "none" : `0 10px 20px -10px ${accent}` }}
        >
          {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <mini.icon className="w-3.5 h-3.5" strokeWidth={2.4} />}
          <span className="truncate max-w-[180px]">{done ? mini.done : mini.cta}</span>
        </button>
      </div>
    </div>
  );
}

/* ── Рамка панелі: маленьке вікно всередині великого ───────── */
function Win({ role, accent, title, children, className, style }: {
  role: Role; accent: string; title: string; children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const Icon = ROLE_ICONS[role.id];
  return (
    <div
      className={cn("mock-on rounded-[18px] bg-surface border border-hairline overflow-hidden flex flex-col", className)}
      style={{ boxShadow: "0 30px 60px -38px rgba(0,40,100,0.55)", ...style }}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-hairline" style={{ background: `linear-gradient(120deg, color-mix(in oklab, ${accent} 13%, var(--surface)), var(--surface-2))` }}>
        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-surface border border-hairline" style={{ color: accent }}>
          <Icon className="w-[15px] h-[15px]" strokeWidth={2.2} />
        </span>
        <span className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-ink leading-[1.2] truncate">{title}</span>
          <span className="text-[10.5px] text-ink-3 leading-none mt-0.5 truncate">{role.name}</span>
        </span>
        <span aria-hidden className="ml-auto flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <span className="w-1.5 h-1.5 rounded-full bg-hairline-strong" />
          <span className="w-1.5 h-1.5 rounded-full bg-hairline-strong" />
        </span>
      </div>
      <div className="p-3.5 md:p-4 flex-1 min-w-0">{children}</div>
    </div>
  );
}

/* Кожна панель заводить себе сама і сама ж починає спочатку — курсори не
   чекають один одного, тому в кадрі дві руки одночасно, як у реальному
   робочому дні. */
function Live({ role, startDelay, big, sc, active = true }: { role: Role; startDelay: number; big: boolean; sc: Screens; active?: boolean }) {
  const [run, setRun] = useState(0);
  const accent = ROLE_ACCENTS[role.id];
  const mini = miniOf(role.id, sc);
  if (!big && !mini) return null;

  return (
    <CursorDemo
      playKey={`${role.id}-${run}`}
      active={active}
      startDelay={startDelay}
      onDone={() => setRun((r) => r + 1)}
      label={role.short}
      look={AVATAR_LOOKS[LOOK[role.id] ?? 0]}
      accent={accent}
      className="w-full"
    >
      <Win role={role} accent={accent} title={big ? role.screen.title : mini!.title}>
        <div key={run}>
          {big ? <RoleBody id={role.id} sc={sc} /> : <MiniBody mini={mini!} accent={accent} />}
        </div>
      </Win>
    </CursorDemo>
  );
}

/* ── Стрічка: що робиться в церкві просто зараз ────────────── */
function Feed({ roles }: { roles: Role[] }) {
  const t = useT().audience.desk;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setTick((n) => n + 1), FEED_MS);
    return () => clearInterval(id);
  }, []);

  const items = t.events;
  const shown = [0, 1, 2].map((k) => items[(tick - k + items.length * 4) % items.length]);

  return (
    <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 border-t border-hairline bg-surface-2/70 min-w-0">
      <span className="hidden md:block text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3 whitespace-nowrap">{t.feed}</span>
      <ul className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
        {shown.map((e, k) => {
          const role = roles.find((r) => r.id === e.id);
          const accent = ROLE_ACCENTS[e.id];
          return (
            <li
              /* Новий рядок в'їжджає, старі просто зсуваються вбік: якщо
                 перемальовувати всі три, стрічка миготить. */
              key={k === 0 ? `now-${tick}` : `old-${k}`}
              className={cn(
                "flex items-center gap-2 min-w-0 whitespace-nowrap",
                k === 0 && "reveal is-visible text-ink",
                k === 1 && "hidden lg:flex text-ink-3",
                k === 2 && "hidden xl:flex text-ink-3",
              )}
              style={{ opacity: k === 0 ? 1 : 0.5 }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
              <span className="text-[12px] font-semibold truncate">{role?.short ?? ""}</span>
              <span className="text-[12px] text-ink-3 truncate">{e.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Телефон: ролі гортаються пальцем ──────────────────────────
   Сітка з дев'яти кнопок займала півекрана до того, як з'являвся бодай один
   екран ролі — спершу треба було щось обрати, і лише потім щось побачити.
   Тепер вибір і є змістом: картка ролі майже на всю ширину, сусідня визирає
   збоку — видно, що є куди гортати. Крапки під стрічкою кажуть, де ти зараз,
   і несуть таймер автопоказу, як смужка в списку на комп'ютері. */
function Swiper({ roles, active, onPick, auto, cycle, sc, detail, hint }: {
  roles: Role[]; active: number; onPick: (i: number) => void; auto: boolean; cycle: number;
  sc: Screens; detail: string; hint: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  /* Рука чи таймер? Стрічку однаково гортають обидва, тож за вибір рахуємо
     тільки той рух, що почався з дотику (чи колеса) — інакше автопоказ
     вимикав би сам себе посеред власної ж прокрутки. */
  const handRef = useRef(false);
  /* Екрани ролей різної висоти. Якщо лишити доріжку заввишки з найбільшим,
     під короткою карткою зяяла б порожнеча до самих крапок — тож доріжка
     стає рівно така, як картка в кадрі, а сусідні підрізає край. */
  const [deep, setDeep] = useState<number>();

  useEffect(() => {
    const card = trackRef.current?.children[active] as HTMLElement | undefined;
    if (!card) return;
    const measure = () => setDeep(card.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => {
    const track = trackRef.current;
    const card = track?.children[active] as HTMLElement | undefined;
    if (!track || !card) return;
    const target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    if (Math.abs(track.scrollLeft - target) < 4) return;
    track.scrollTo({ left: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    /* Плавну прокрутку може обірвати перерахунок магнітних точок — тоді
       стрічка стане посеред дороги. Дотягуємо її ривком, якщо за цей час
       за неї не взялася рука. */
    const fix = window.setTimeout(() => {
      if (!handRef.current && Math.abs(track.scrollLeft - target) > 8) track.scrollTo({ left: target, behavior: "auto" });
    }, 1200);
    return () => window.clearTimeout(fix);
  }, [active]);

  /* Догортав — та картка, що стала посередині, і є обраною роллю. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let settle: number;
    const hand = () => { handRef.current = true; };
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (!handRef.current) return;
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = active;
        let bestGap = Infinity;
        Array.from(track.children).forEach((node, i) => {
          const el = node as HTMLElement;
          const gap = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
          if (gap < bestGap) { bestGap = gap; best = i; }
        });
        /* Стрічка справді зупинилася на картці, а не проїжджає повз. */
        if (bestGap > 24) return;
        handRef.current = false;
        if (best !== active) onPick(best);
      }, 140);
    };
    track.addEventListener("pointerdown", hand, { passive: true });
    track.addEventListener("touchstart", hand, { passive: true });
    track.addEventListener("wheel", hand, { passive: true });
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("pointerdown", hand);
      track.removeEventListener("touchstart", hand);
      track.removeEventListener("wheel", hand);
      track.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle);
    };
  }, [active, onPick]);

  return (
    <div
      className="lg:hidden"
      style={{ background: `radial-gradient(ellipse 70% 60% at 50% 28%, color-mix(in oklab, ${ROLE_ACCENTS[roles[active].id]} 9%, transparent), transparent 70%)` }}
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex items-start gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory px-4 py-5 transition-[height] duration-500"
        style={{ height: deep ? deep + 40 : undefined }}
      >
        {roles.map((r, i) => {
          const a = ROLE_ACCENTS[r.id];
          const on = i === active;
          /* Ширина в vw, а не у відсотках доріжки: картка тоді не залежить від
             внутрішніх відступів. 75vw — це найширший екран, при якому сусідня
             картка ще визирає з-за краю: без цього ребра ніхто не здогадається
             гортати. */
          return (
            <div key={r.id} className="snap-center shrink-0 w-[min(420px,75vw)] flex flex-col gap-3">
              {/* Курсор ходить тільки по тій картці, що зараз у кадрі. */}
              <Live role={r} startDelay={700} big sc={sc} active={on} />
              <Link
                href={`/for-whom/${r.id}`}
                tabIndex={on ? 0 : -1}
                className="inline-flex items-center justify-center gap-2 h-11 rounded-full text-[14.5px] font-semibold text-white"
                style={{ background: a }}
              >
                {detail}
                <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Крапки: де ти зараз серед дев'яти і скільки лишилось до наступної. */}
      <div role="tablist" aria-label={hint} className="flex items-center justify-center pb-4">
        {roles.map((r, i) => {
          const a = ROLE_ACCENTS[r.id];
          const on = i === active;
          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={r.short}
              onClick={() => onPick(i)}
              className="p-2"
            >
              <span
                className={cn("block h-1.5 rounded-full overflow-hidden transition-all duration-300", on ? "w-7" : "w-1.5 bg-hairline-strong")}
                style={on ? { background: `color-mix(in oklab, ${a} 26%, var(--hairline-strong))` } : undefined}
              >
                {on && (
                  <span
                    className="block h-full origin-left"
                    style={{ background: a, animation: auto ? `barGrowX ${cycle}ms linear both` : undefined }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Один десктоп замість дев'яти вкладок: у вікні застосунку одночасно
   працюють дві ролі — велика панель тієї, що обрана, і одна мала сусідня, —
   а ліворуч видно всіх, хто зараз у системі. Нічого тиснути не треба:
   склад сцени змінюється сам, поки відвідувач не обере роль.
   На вузькому екрані списку й малої панелі нема: ролі гортаються пальцем
   (<Swiper />), і активна роль лишається тією самою в обох виглядах. */
export default function DeskStage({ active, onPick, auto, cycle }: {
  active: number; onPick: (i: number) => void; auto: boolean; cycle: number;
}) {
  const all = useT();
  const t = all.audience;
  const sc = t.screens;
  const roles = t.roles;

  const stage = Array.from({ length: ON_STAGE }, (_, k) => roles[(active + k) % roles.length]);
  const onStage = new Set(stage.map((r) => r.id));

  return (
    <div className="rounded-[20px] md:rounded-[28px] border border-hairline bg-surface-2 overflow-hidden shadow-[0_40px_90px_-60px_rgba(0,40,100,0.55)]">
      {/* Смуга вікна: три кружечки, назва застосунку і всі, хто зараз онлайн */}
      <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 border-b border-hairline bg-surface">
        <span aria-hidden className="hidden sm:flex items-center gap-1.5 shrink-0">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="w-[10px] h-[10px] rounded-full" style={{ background: c, opacity: 0.85 }} />
          ))}
        </span>
        <span className="rounded-full bg-surface-2 border border-hairline px-3 py-1 text-[11.5px] md:text-[12px] text-ink-3 leading-none truncate">
          {t.desk.app} · {roles[active].screen.title}
        </span>
        <span className="ml-auto flex items-center gap-2 shrink-0">
          <span aria-hidden className="hidden sm:flex -space-x-2">
            {roles.map((r) => (
              <PersonAvatar
                key={r.id}
                look={AVATAR_LOOKS[LOOK[r.id] ?? 0]}
                size={24}
                className="rounded-full ring-2 ring-[color:var(--surface)]"
              />
            ))}
          </span>
          <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-2 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12a150]" />
            {roles.length} {t.desk.online}
          </span>
        </span>
      </div>

      {/* Телефон і планшет: одна роль у кадрі, решта — за краєм */}
      <Swiper
        roles={roles} active={active} onPick={onPick} auto={auto} cycle={cycle} sc={sc}
        detail={t.detail} hint={t.switcherHint}
      />

      <div className="hidden lg:grid lg:grid-cols-[228px_minmax(0,1fr)]">
        {/* Хто зараз у системі — він же перемикач ролей */}
        <div className="border-r border-hairline bg-surface/60">
          <span className="block px-4 pt-3.5 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">
            {t.desk.presence}
          </span>
          <div role="tablist" aria-label={t.switcherHint} className="flex flex-col gap-1 px-2 py-2">
            {roles.map((r, i) => {
              const a = ROLE_ACCENTS[r.id];
              const on = i === active;
              const live = onStage.has(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => onPick(i)}
                  className={cn(
                    "relative min-w-0 flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-200 overflow-hidden border",
                    on ? "bg-surface border-hairline shadow-[0_1px_2px_rgba(0,0,0,0.04)]" : "border-transparent text-ink-2 hover:bg-surface/70 hover:text-ink",
                  )}
                >
                  <PersonAvatar look={AVATAR_LOOKS[LOOK[r.id] ?? 0]} size={28} className={cn("rounded-full transition-opacity", live ? "opacity-100" : "opacity-60")} />
                  {/* Лише назва ролі: екран, який за нею стоїть, підписаний
                      у смузі вікна — дублювати його під кожним рядком зайве. */}
                  <span className={cn("min-w-0 text-[13px] font-semibold leading-[1.2] truncate", on ? "text-ink" : "text-inherit")}>{r.short}</span>
                  <span aria-hidden className="ml-auto w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300" style={{ background: live ? a : "var(--hairline-strong)" }} />
                  {on && auto && (
                    <span aria-hidden className="absolute left-0 right-0 bottom-0 h-[2px] overflow-hidden">
                      <span className="block h-full origin-left" style={{ background: a, opacity: 0.6, animation: `barGrowX ${cycle}ms linear both` }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Полотно: велика панель обраної ролі і одна мала — сусіда по списку */}
        <div
          className="relative p-6 lg:p-7"
          style={{ background: `radial-gradient(ellipse 60% 70% at 25% 40%, color-mix(in oklab, ${ROLE_ACCENTS[roles[active].id]} 9%, transparent), transparent 70%)` }}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,244px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,276px)] gap-4 xl:gap-5 items-start">
            <Live key={`big-${stage[0].id}`} role={stage[0]} startDelay={900} big sc={sc} />
            <div className="pt-10">
              <Live key={`m1-${stage[1].id}`} role={stage[1]} startDelay={2600} big={false} sc={sc} />
            </div>
          </div>
        </div>
      </div>

      <Feed roles={roles} />
    </div>
  );
}
