"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Car,
  Check,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Link2,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import PersonAvatar, { AVATAR_LOOKS, lookFor } from "@/components/shared/person-avatar";
import SectionHeading from "@/components/shared/section-heading";
import type { ChatAsk, ChatCollectField, ChatStep } from "@/lib/i18n";
import { useT } from "@/lib/lang";

/* A day in the group chat, on a loop: the assistant asks, members answer,
   the leader's side accumulates a summary and gets a card only when
   something has to go into the database. */

type FeedItem = { id: number; kind: "day"; label: string } | { id: number; kind: "msg"; idx: number };
type Pending = { id: number; ask: ChatAsk; done: boolean };
type Collected = Partial<Record<ChatCollectField, string[]>>;

const KEEP = 9; // messages kept in the DOM
const TYPING_MS = 900;
const BOT_GAP = 1500;
const MEMBER_GAPS = [1500, 2300, 1800, 2700];
const DAY_PAUSE = 4500;
const FIRST_MSG = 1100;
const RESOLVE_MS = 6500; // a pending card "gets tapped" on its own
const CLEAR_MS = 4200; // …and leaves the queue a bit later
const START_VOTES = { yes: 6, no: 1 };
const NAME_COLORS = ["#f07b5b", "#007aff", "#8b5bf0", "#12a150", "#f05b8b", "#0ea5e9", "#f59e0b", "#14b8a6"];
const ASK_ICONS = [ClipboardCheck, HeartHandshake];
const ASK_ACCENTS = ["#007aff", "#f05b8b"];
const FIELD_ICONS: Record<ChatCollectField, typeof Car> = { bring: ShoppingBag, ride: Car, prayer: HeartHandshake, guests: UserPlus };
const FIELDS: ChatCollectField[] = ["bring", "ride", "prayer", "guests"];

export default function AiChatWatcher() {
  const ai = useT().ai;
  const t = ai.chatWatcher;
  const botName = ai.chat.name.split(" ")[0];
  const script: ChatStep[] = t.script;

  const hostRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);
  const posRef = useRef(0);
  const cycleRef = useRef(0);
  const startedRef = useRef(false);

  const [inView, setInView] = useState(false);
  const [runId, setRunId] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [typing, setTyping] = useState(false);
  const [votes, setVotes] = useState(START_VOTES);
  const [collected, setCollected] = useState<Collected>({});
  const [pending, setPending] = useState<Pending[]>([]);
  const [digest, setDigest] = useState(false);

  const nextId = () => idRef.current++;

  /* Run only while the section is on screen; resume from the same spot. */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const timers = new Set<number>();
    const later = (ms: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!cancelled) fn();
      }, ms);
      timers.add(id);
    };

    const resetDay = () => {
      setVotes(START_VOTES);
      setCollected({});
      setPending([]);
      setDigest(false);
    };

    if (prefersReducedMotion()) {
      /* No motion: show a finished day at once, nothing loops. */
      later(0, () => {
        resetDay();
        const items: FeedItem[] = [{ id: nextId(), kind: "day", label: t.days[0] }];
        script.forEach((m, idx) => {
          if (!m.silent) items.push({ id: nextId(), kind: "msg", idx });
        });
        setFeed(items.slice(-KEEP));
        const finalVotes = script.reduce(
          (v, m) => (m.vote ? { ...v, [m.vote]: v[m.vote] + 1 } : v),
          { ...START_VOTES }
        );
        setVotes(finalVotes);
        const all: Collected = {};
        script.forEach((m) => {
          if (m.collect) all[m.collect.field] = [...(all[m.collect.field] ?? []), m.collect.value];
        });
        setCollected(all);
        setDigest(true);
      });
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

    const startDay = () => {
      resetDay();
      posRef.current = 0;
      setFeed((f) => [...f, { id: nextId(), kind: "day" as const, label: t.days[cycleRef.current % t.days.length] }].slice(-KEEP));
      later(FIRST_MSG, step);
    };

    const step = () => {
      const i = posRef.current;
      if (i >= script.length) {
        cycleRef.current += 1;
        later(DAY_PAUSE, startDay);
        return;
      }
      const m = script[i];
      const show = () => {
        setTyping(false);
        if (!m.silent) setFeed((f) => [...f, { id: nextId(), kind: "msg" as const, idx: i }].slice(-KEEP));
        if (m.vote) {
          const key = m.vote;
          setVotes((v) => ({ ...v, [key]: v[key] + 1 }));
        }
        if (m.collect) {
          const { field, value } = m.collect;
          setCollected((c) => ({ ...c, [field]: [...(c[field] ?? []), value] }));
        }
        if (m.ask) {
          const id = nextId();
          const ask = m.ask;
          setPending((p) => [...p, { id, ask, done: false }]);
          later(RESOLVE_MS, () => setPending((p) => p.map((x) => (x.id === id ? { ...x, done: true } : x))));
          later(RESOLVE_MS + CLEAR_MS, () => setPending((p) => p.filter((x) => x.id !== id)));
        }
        if (m.digest) setDigest(true);
        posRef.current = i + 1;
        later(m.who === "bot" ? BOT_GAP : MEMBER_GAPS[i % MEMBER_GAPS.length], step);
      };
      if (m.who === "bot" && !m.silent) {
        setTyping(true);
        later(TYPING_MS, show);
      } else {
        show();
      }
    };

    if (!startedRef.current) {
      startedRef.current = true;
      startDay();
    } else {
      later(700, step);
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      setTyping(false);
    };
    // The script only changes with the language; restarting from the same position is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, runId, script]);

  const replay = () => {
    posRef.current = 0;
    cycleRef.current = 0;
    startedRef.current = false;
    setFeed([]);
    setTyping(false);
    setRunId((r) => r + 1);
  };

  const resolve = (id: number) => {
    setPending((p) => p.map((x) => (x.id === id ? { ...x, done: true } : x)));
    window.setTimeout(() => setPending((p) => p.filter((x) => x.id !== id)), CLEAR_MS);
  };

  const silent = Math.max(0, t.total - votes.yes - votes.no);
  const panelLabel = "flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink-3 px-1";
  const bubbleBot = "rounded-[18px] rounded-bl-[4px] bg-brand text-white px-4 py-2.5 shadow-[0_10px_24px_-14px_rgba(0,122,255,0.7)]";

  return (
    <section ref={hostRef} className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
          <div aria-hidden className="hidden lg:flex absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-surface border border-hairline shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)] items-center justify-center">
            <ArrowRight className="w-5 h-5 text-brand" strokeWidth={2.6} />
          </div>

          {/* ── Group chat, on a loop ───────────────────── */}
          <FadeIn variant="scale" className="min-w-0 flex flex-col gap-3">
            <span className={panelLabel}>
              <Users className="w-4 h-4" strokeWidth={2.2} />
              {t.chatLabel}
            </span>
            <div className="rounded-[24px] border border-hairline bg-surface shadow-[0_30px_60px_-40px_rgba(0,50,120,0.4)] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline bg-surface">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f07b5b] to-[#f05b8b] flex items-center justify-center shrink-0">
                  <Users className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
                </span>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="text-[15px] font-semibold text-ink leading-none truncate">{t.chatTitle}</span>
                  <span className="text-[12.5px] text-ink-3 leading-none">{t.chatMembers}</span>
                </div>
                <button
                  type="button"
                  onClick={replay}
                  aria-label={ai.hero.replay}
                  title={ai.hero.replay}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink-3 hover:text-ink hover:bg-surface-3 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={2.2} />
                </button>
              </div>

              <div className="chat-wallpaper relative h-[600px] overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-surface-2 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4">
                  {feed.map((item) => {
                    if (item.kind === "day") {
                      return (
                        <span key={item.id} className="bubble-in self-center rounded-full bg-surface/85 border border-hairline px-3 py-1 text-[12px] font-medium text-ink-3 leading-none">
                          {item.label}
                        </span>
                      );
                    }
                    const m = script[item.idx];
                    if (!m) return null;
                    if (m.who === "bot") {
                      const quoted = m.replyTo !== undefined ? script[m.replyTo] : null;
                      return (
                        <div key={item.id} className="bubble-in self-start flex items-end gap-2.5 max-w-[94%]">
                          <span className="relative shrink-0 mb-0.5">
                            <Image src="/eva.jpg" alt="" width={30} height={30} sizes="30px" className="rounded-full" />
                            <span className="absolute -bottom-1 -right-1.5 rounded-[5px] bg-brand text-white text-[8px] font-bold uppercase px-1 leading-[13px] border border-surface">AI</span>
                          </span>
                          <div className={bubbleBot}>
                            <span className="flex items-center gap-1.5 text-[12.5px] font-semibold leading-none mb-2">
                              {botName}
                              <span className="rounded-[4px] bg-white/22 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em] leading-none">{t.botTag}</span>
                            </span>
                            {quoted && typeof quoted.who === "number" && (
                              <span className="block border-l-2 border-white/60 pl-2 mb-2 text-[12.5px] text-white/80 leading-[1.3] truncate">
                                {t.members[quoted.who]}: {quoted.text}
                              </span>
                            )}
                            <p className="text-[15px] leading-[1.4]">{m.text}</p>
                            {m.link && (
                              <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[12.5px] font-medium leading-none">
                                <Link2 className="w-3.5 h-3.5" strokeWidth={2.4} />
                                {m.link}
                              </span>
                            )}
                            {m.poll && (
                              <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                                <span className="h-8 rounded-[10px] bg-white text-brand flex items-center justify-center gap-1.5 text-[12.5px] font-semibold leading-none">
                                  ✅ {t.poll.yes}
                                  <span className="rounded-full bg-brand-soft px-1.5 py-0.5 tabular-nums">{votes.yes}</span>
                                </span>
                                <span className="h-8 rounded-[10px] bg-white/20 text-white flex items-center justify-center gap-1.5 text-[12.5px] font-semibold leading-none">
                                  ❌ {t.poll.no}
                                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 tabular-nums">{votes.no}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    const who = m.who;
                    return (
                      <div key={item.id} className="bubble-in self-start flex items-end gap-2.5 max-w-[92%]">
                        <span className="shrink-0 mb-0.5">
                          <PersonAvatar look={lookFor(t.members[who])} size={30} />
                        </span>
                        <div className="rounded-[18px] rounded-bl-[4px] bg-surface border border-hairline px-4 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                          <span className="block text-[12.5px] font-semibold leading-none mb-1.5" style={{ color: NAME_COLORS[who % NAME_COLORS.length] }}>
                            {t.members[who]}
                          </span>
                          <p className="text-[15px] text-ink leading-[1.4]">{m.text}</p>
                          {(m.vote || m.collect || m.ask) && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-1 text-[11px] font-semibold text-brand leading-none">
                              <Sparkles className="w-3 h-3" strokeWidth={2.6} />
                              {t.summary.title.split(" ")[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {typing && (
                    <div className="bubble-in self-start flex items-end gap-2.5">
                      <Image src="/eva.jpg" alt="" width={30} height={30} sizes="30px" className="rounded-full shrink-0 mb-0.5" />
                      <div className="rounded-[18px] rounded-bl-[4px] bg-brand px-4 py-3.5 flex items-center gap-1.5">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="typing-dot w-1.5 h-1.5 rounded-full bg-white" style={{ animationDelay: `${d * 0.18}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ── Leader's DM: one growing summary + a short queue ── */}
          <FadeIn delay={2} variant="scale" className="min-w-0 flex flex-col gap-3">
            <span className={panelLabel}>
              <Image src="/eva.jpg" alt="" width={18} height={18} sizes="18px" className="rounded-full" />
              {t.dmLabel}
            </span>
            <div className="rounded-[24px] border border-brand/25 bg-surface shadow-[0_30px_60px_-40px_rgba(0,122,255,0.5)] overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline bg-surface">
                <span className="flex items-center -space-x-2 shrink-0">
                  <Image src="/eva.jpg" alt="" width={34} height={34} sizes="34px" className="rounded-full ring-2 ring-surface" />
                  <span className="rounded-full ring-2 ring-surface">
                    <PersonAvatar look={AVATAR_LOOKS[3]} size={34} />
                  </span>
                </span>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-[15px] font-semibold text-ink leading-none">
                    <ArrowRight className="w-3.5 h-3.5 text-brand" strokeWidth={2.6} />
                    {t.leaderTitle}
                  </span>
                  <span className="text-[12.5px] text-ink-3 leading-none">{t.leaderHint}</span>
                </div>
              </div>

              <div className="chat-wallpaper-brand p-4 flex flex-col gap-3 min-h-[600px]">
                {/* Live summary */}
                <div className="rounded-[18px] rounded-bl-[4px] bg-surface border border-hairline p-4 flex flex-col gap-3.5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-brand">
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={2.6} />
                      {t.summary.title}
                    </span>
                    <span className="text-[12px] text-ink-3 leading-none">{t.summary.meeting}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: votes.yes, label: t.summary.coming, color: "#12a150" },
                      { value: votes.no, label: t.summary.cant, color: "#f05b8b" },
                      { value: silent, label: t.summary.silent, color: "var(--ink-3)" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl bg-surface-2 border border-hairline px-3 py-2.5 flex flex-col gap-1.5">
                        <span className="text-[22px] font-semibold leading-none tracking-[-0.5px] tabular-nums" style={{ color: s.color }}>
                          {s.value}
                        </span>
                        <span className="text-[11.5px] text-ink-3 leading-none">{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 rounded-full bg-surface-3 overflow-hidden flex">
                    <span className="h-full bg-[#12a150]" style={{ width: `${(votes.yes / t.total) * 100}%`, transition: "width 0.5s var(--ease-out-soft)" }} />
                    <span className="h-full bg-[#f05b8b]" style={{ width: `${(votes.no / t.total) * 100}%`, transition: "width 0.5s var(--ease-out-soft)" }} />
                  </div>

                  <ul className="flex flex-col gap-2">
                    {FIELDS.map((field) => {
                      const Icon = FIELD_ICONS[field];
                      const values = collected[field] ?? [];
                      return (
                        <li key={field} className="flex items-start gap-2.5 text-[13.5px] leading-[1.35]">
                          <span className="w-6 h-6 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5" strokeWidth={2.4} />
                          </span>
                          <span className="w-[92px] shrink-0 text-ink-3 pt-0.5">{t.summary[field]}</span>
                          <span className="flex flex-wrap gap-1.5 min-w-0">
                            {values.length === 0 ? (
                              <span className="text-ink-3 pt-0.5">{t.summary.none}</span>
                            ) : (
                              values.map((v) => (
                                <span key={v} className="bubble-in rounded-full bg-surface-2 border border-hairline px-2.5 py-1 text-[12.5px] font-medium text-ink leading-none">
                                  {v}
                                </span>
                              ))
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Cards that need a tap */}
                {pending.length > 0 && (
                  <span className="mt-1 px-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.pendingTitle}</span>
                )}
                {pending.map((p, i) => {
                  const Icon = ASK_ICONS[i % ASK_ICONS.length];
                  const accent = ASK_ACCENTS[i % ASK_ACCENTS.length];
                  return (
                    <div key={p.id} className="bubble-in rounded-[18px] rounded-bl-[4px] bg-surface border border-hairline p-4 flex flex-col gap-2.5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.3)]">
                      <span
                        className="inline-flex self-start items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11.5px] font-semibold leading-none"
                        style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
                      >
                        <Icon className="w-3.5 h-3.5" strokeWidth={2.6} />
                        {p.ask.kind}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-[15px] font-semibold text-ink leading-[1.3]">{p.ask.title}</span>
                        <span className="text-[13.5px] text-ink-2 leading-[1.4]">{p.ask.text}</span>
                      </div>
                      {p.done ? (
                        <span className="bubble-in inline-flex items-center gap-1.5 self-start rounded-full bg-[#12a150]/12 px-3 py-2 text-[13px] font-semibold text-[#0e7a3c] dark:text-[#3ddc97] leading-none">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          {p.ask.done}
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => resolve(p.id)} className="btn-brand h-9 px-4 rounded-[10px] flex items-center justify-center text-[13px] font-semibold text-white">
                            {p.ask.yes}
                          </button>
                          <button
                            type="button"
                            onClick={() => resolve(p.id)}
                            className="h-9 px-4 rounded-[10px] border border-hairline-strong bg-surface flex items-center justify-center text-[13px] font-medium text-ink-2 hover:bg-surface-2 transition-colors"
                          >
                            {p.ask.no}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Evening digest */}
                {digest && (
                  <div className="bubble-in mt-auto flex items-end gap-2.5">
                    <Image src="/eva.jpg" alt="" width={28} height={28} sizes="28px" className="rounded-full shrink-0 mb-0.5" />
                    <div className="rounded-[18px] rounded-bl-[4px] bg-surface border border-brand/30 p-4 flex flex-col gap-2 shadow-[0_8px_24px_-16px_rgba(0,122,255,0.5)]">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-brand">
                        <FileText className="w-3.5 h-3.5" strokeWidth={2.6} />
                        {t.digest.title}
                      </span>
                      <p className="text-[14px] text-ink leading-[1.45]">{t.digest.text}</p>
                      <button type="button" onClick={() => setDigest(false)} className="btn-brand self-start h-9 px-4 rounded-[10px] flex items-center justify-center text-[13px] font-semibold text-white">
                        {t.digest.ok}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-hairline bg-surface text-[12.5px] text-ink-3 leading-[1.4]">{t.note}</div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
