"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight, BookOpen, Check, Clock, CalendarDays,
  Keyboard, Megaphone, Mic, Music4, Plus, Search, Sparkles,
  Video, Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import PersonAvatar, { lookFor, type AvatarLook } from "@/components/shared/person-avatar";
import { hasModulePage } from "@/content/modules/ids";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Planning a service is not naming the blocks — it is filling them,
   and not by one person. Two panels and four hands: the worship
   leader searches the song library and drops three songs into her
   block, media pastes the video link, the pastor sets the sermon
   topic by hand, adds communion for this Sunday, and the admin
   dictates the announcements into the block instead of typing them.
   The plan assembles itself in front of you.
   ──────────────────────────────────────────────────────────────── */

type Pointer = { x: number; y: number; ms: number; on: boolean; press: boolean; flip: boolean };
/* A block being filled right now: typed letter by letter, or dictated
   and transcribed word by word. `n` is how much of the value has landed. */
type Live = { kind: string; mode: "type" | "voice"; n: number };

const START_MS = 900;
const HOLD_MS = 4200;
const TYPE_MS = 26;
const LISTEN_MS = 680;
const WORD_MS = 150;

/* Who touches what, in order. `actor` is the block kind that person owns. */
const SCRIPT: { actor: string; slot: string; dwell: number; mode?: Live["mode"] }[] = [
  { actor: "worship", slot: "lib-search", dwell: 800 },
  { actor: "worship", slot: "lib-found-0", dwell: 750 },
  { actor: "worship", slot: "lib-recent-0", dwell: 750 },
  { actor: "worship", slot: "lib-recent-1", dwell: 900 },
  { actor: "video", slot: "block-video", dwell: 1150 },
  { actor: "sermon", slot: "block-sermon", dwell: 900, mode: "type" },
  { actor: "announce", slot: "block-announce", dwell: 900, mode: "voice" },
  { actor: "sermon", slot: "add-block", dwell: 1500 },
];
const STEP = { SEARCH: 0, SONG_LAST: 3, VIDEO: 4, SERMON: 5, ANNOUNCE: 6, COMMUNION: 7 };
const LAST = SCRIPT.length - 1;
/* Which block lights up at each step — songs 1–3 all land in worship. */
const STEP_KIND: Record<number, string> = { 1: "worship", 2: "worship", 3: "worship", 4: "video", 5: "sermon", 6: "announce", 7: "communion" };
const PICK_SLOTS = ["lib-found-0", "lib-recent-0", "lib-recent-1"];

const BLOCK_ICONS: Record<string, LucideIcon> = {
  worship: Music4, prayer: Sparkles, video: Video, sermon: BookOpen, announce: Megaphone, communion: Wine,
};
const BLOCK_ACCENTS: Record<string, string> = {
  worship: "#f05b8b", prayer: "#8b5bf0", video: "#0ea5e9", sermon: "#007aff", announce: "#f59e0b", communion: "#12a150",
};

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/* one / few / many — Ukrainian needs all three, English uses the first two. */
function plural(forms: readonly string[], n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

/* Near-constant speed — never a teleport, never a crawl. */
const travelMs = (dist: number) => Math.round(Math.min(900, Math.max(360, dist * 1.25)));

export default function ServicePlanning() {
  const t = useT().servicePlanning;
  const plan = t.plan;
  const lib = plan.library;

  const hostRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef(0);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(-1);
  const [ptrs, setPtrs] = useState<Record<string, Pointer>>({});
  const [tap, setTap] = useState<{ id: number; x: number; y: number } | null>(null);
  const [live, setLive] = useState<Live | null>(null);

  /* No motion preference — the finished plan is simply shown. */
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia(MOTION_QUERY).matches, () => false);

  const owner = (kind: string) => plan.items.find((i) => i.kind === kind);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The walk-through: every hand goes to its own target, presses, and the
     value it just set lands in the plan. Then the whole thing starts over. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced || !inView) return;

    let cancelled = false;
    const timers: number[] = [];
    const sleep = (ms: number) => new Promise<void>((res) => { timers.push(window.setTimeout(res, ms)); });
    const box = () => host.getBoundingClientRect();
    const park = () => ({ x: box().width * 0.5, y: box().height + 60 });
    const centerOf = (slot: string) => {
      const el = host.querySelector<HTMLElement>(`[data-slot="${slot}"]`);
      if (!el) return null;
      const b = box();
      const r = el.getBoundingClientRect();
      return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
    };

    /* Text does not appear by itself: the sermon topic is typed out,
       the announcements are dictated and land word by word. */
    const write = async (act: (typeof SCRIPT)[number]) => {
      const full = act.mode ? plan.items.find((i) => i.kind === act.actor)?.value ?? "" : "";
      if (!full) return;
      const set = (n: number) => setLive({ kind: act.actor, mode: act.mode!, n });
      set(0);
      if (act.mode === "voice") {
        await sleep(LISTEN_MS);
        for (const m of full.matchAll(/\S+/g)) {
          if (cancelled) return;
          set(m.index + m[0].length);
          await sleep(WORD_MS);
        }
        return;
      }
      for (let n = 1; n <= full.length; n++) {
        if (cancelled) return;
        set(n);
        await sleep(TYPE_MS);
      }
    };

    (async () => {
      const last: Record<string, { x: number; y: number }> = {};
      while (!cancelled) {
        await sleep(START_MS);
        setStep(-1);
        setPtrs({});
        setLive(null);
        await sleep(600);

        for (let i = 0; i < SCRIPT.length; i++) {
          const act = SCRIPT[i];
          const to = centerOf(act.slot);
          /* On a phone the panels sit one under the other — the values still
             land in order, but nobody chases a pointer across two screens. */
          if (!to || box().width < 640) {
            setStep(i);
            await write(act);
            await sleep(act.dwell + 500);
            setLive(null);
            continue;
          }

          const from = last[act.actor] ?? park();
          const ms = travelMs(Math.hypot(to.x - from.x, to.y - from.y));
          /* Near the right edge the name tag would run off the card — hang it left. */
          const flip = to.x > box().width - 190;
          setPtrs((prev) => ({ ...prev, [act.actor]: { ...to, ms, on: true, press: false, flip } }));
          last[act.actor] = to;
          await sleep(ms + 200);

          setPtrs((prev) => ({ ...prev, [act.actor]: { ...prev[act.actor], ms: 0, press: true } }));
          setTap({ id: ++tapRef.current, x: to.x, y: to.y });
          await sleep(160);
          setStep(i);
          setPtrs((prev) => ({ ...prev, [act.actor]: { ...prev[act.actor], press: false } }));
          await write(act);
          await sleep(act.dwell);
          setLive(null);

          /* Hand over: the finished actor steps out of the frame. */
          if (SCRIPT[i + 1]?.actor !== act.actor) {
            const out = park();
            setPtrs((prev) => ({ ...prev, [act.actor]: { ...out, ms: 520, on: false, press: false, flip: false } }));
            delete last[act.actor];
            await sleep(300);
          }
        }

        setPtrs({});
        setLive(null);
        await sleep(HOLD_MS);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
    };
  }, [reduced, inView, plan]);

  const s = reduced ? LAST : step;
  /* No motion — no half-written text either; the plan is simply shown filled. */
  const writing = reduced ? null : live;
  const songsTaken = Math.max(0, Math.min(PICK_SLOTS.length, s));
  const picked = [lib.found[0], lib.recent[0], lib.recent[1]].slice(0, songsTaken);
  const communionOn = s >= STEP.COMMUNION;
  const isFilled = (kind: string) =>
    kind === "prayer" ||
    (kind === "worship" && songsTaken > 0) ||
    (kind === "video" && s >= STEP.VIDEO) ||
    (kind === "sermon" && s >= STEP.SERMON) ||
    (kind === "announce" && s >= STEP.ANNOUNCE) ||
    (kind === "communion" && communionOn);

  const rows = plan.items.filter((i) => i.kind !== "communion" || communionOn);
  const filledCount = rows.filter((i) => isFilled(i.kind)).length;
  const done = filledCount === rows.length && communionOn;
  const link = hasModulePage("service-planning") ? "/modules/service-planning" : "/modules";

  return (
    <section id="service-planning" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-16 md:gap-24">

        {/* ── Heading: one thought, set as large as it reads ─────── */}
        <FadeIn className="flex flex-col items-center text-center gap-5">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[46px] sm:text-[66px] md:text-[88px] leading-[1.0] tracking-[-2px] md:tracking-[-3.6px]">{t.title}</h2>
          <Link href={link} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand">
            {t.link}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
        </FadeIn>

        {/* ── The composition: library + plan + the hands ─ */}
        <FadeIn variant="scale" className="relative">
          <div
            aria-hidden
            className="absolute -inset-8 rounded-[48px] -z-10 blur-3xl opacity-60"
            style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
          />
          <div ref={hostRef} className="relative grid grid-cols-1 lg:grid-cols-[228px_minmax(0,1fr)] gap-4 lg:gap-5 lg:items-start">

            {/* Song library — a side note beside the plan, not a second hero:
                smaller and tucked below the plan’s header line. */}
            <div className="rounded-[18px] border border-hairline bg-surface shadow-[0_18px_40px_-36px_rgba(0,50,120,0.45)] overflow-hidden self-start lg:mt-14">
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-hairline bg-surface-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "color-mix(in oklab, #f05b8b 14%, transparent)" }}>
                  <Music4 className="w-3.5 h-3.5" strokeWidth={2.2} style={{ color: "#f05b8b" }} />
                </span>
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{lib.title}</span>
                  <span className="text-[11px] text-ink-3 leading-none">{lib.count}</span>
                </div>
              </div>

              <div className="p-2.5 flex flex-col gap-2.5">
                <div
                  data-slot="lib-search"
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors",
                    s >= STEP.SEARCH ? "border-brand bg-brand-soft/50" : "border-hairline bg-surface-2"
                  )}
                >
                  <Search className="w-3.5 h-3.5 text-ink-3 shrink-0" strokeWidth={2.2} />
                  {s >= STEP.SEARCH ? (
                    <span className="text-[12.5px] text-ink leading-none">
                      {lib.query}
                      <span className="plan-caret" />
                    </span>
                  ) : (
                    <span className="text-[12.5px] text-ink-3 leading-none">{lib.placeholder}</span>
                  )}
                </div>

                {s >= STEP.SEARCH && (
                  <div className="plan-value flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3">{lib.foundTitle}</span>
                    {lib.found.map((song, i) => (
                      <SongRow
                        key={song.name}
                        slot={`lib-found-${i}`}
                        name={song.name}
                        tone={song.tone}
                        picked={picked.some((p) => p.name === song.name)}
                        label={lib.inPlan}
                      />
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3">{lib.recentTitle}</span>
                  {lib.recent.map((song, i) => (
                    <SongRow
                      key={song.name}
                      slot={`lib-recent-${i}`}
                      name={song.name}
                      tone={song.tone}
                      picked={picked.some((p) => p.name === song.name)}
                      label={lib.inPlan}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* The plan */}
            <div className="rounded-[22px] border border-hairline bg-surface shadow-[0_30px_60px_-40px_rgba(0,50,120,0.4)] overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-hairline bg-surface-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shrink-0">
                    <CalendarDays className="w-[18px] h-[18px] text-white" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-semibold text-ink leading-none truncate">{plan.title}</span>
                    <span className="text-[12.5px] text-ink-3 leading-none mt-1.5 truncate">{plan.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-surface border border-hairline px-2.5 py-1.5 text-[12px] font-medium text-ink-2">
                    <Clock className="w-3.5 h-3.5" /> {plan.duration}
                  </span>
                  <span
                    data-slot="add-block"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[12px] font-semibold leading-none transition-colors",
                      communionOn ? "border-hairline bg-surface text-ink-3" : "border-brand bg-brand-soft text-brand"
                    )}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.6} /> {plan.addBlock}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-2 px-4 sm:px-5 py-4">
                {rows.map((item) => {
                  const Icon = BLOCK_ICONS[item.kind] ?? Sparkles;
                  const accent = BLOCK_ACCENTS[item.kind] ?? "var(--brand)";
                  const filled = isFilled(item.kind);
                  const isNew = STEP_KIND[s] === item.kind;
                  return (
                    <li
                      key={`${item.kind}-${item.time}`}
                      data-slot={`block-${item.kind}`}
                      className={cn(
                        "plan-row flex items-start gap-3 rounded-xl border border-hairline bg-surface-2 px-3 py-3",
                        isNew && "is-new"
                      )}
                    >
                      <span className="w-[42px] shrink-0 pt-1.5 text-[12.5px] font-medium text-ink-3 tabular-nums">{item.time}</span>
                      <span
                        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)` }}
                      >
                        <Icon className="w-[14px] h-[14px]" strokeWidth={2.2} style={{ color: accent }} />
                      </span>

                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[14.5px] font-medium text-ink leading-none truncate">{item.name}</span>
                          {item.kind === "worship" && songsTaken > 0 && (
                            <span className="shrink-0 text-[11.5px] text-ink-3 leading-none">
                              {songsTaken} {plural(plan.songs, songsTaken)}
                            </span>
                          )}
                          {item.today && (
                            <span className="plan-slot-on shrink-0 rounded-full bg-[#12a150]/12 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#0e7a3c] dark:text-[#3ddc97] leading-[1.5]">
                              {plan.today}
                            </span>
                          )}
                        </div>

                        {item.kind === "worship" ? (
                          songsTaken > 0 ? (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {picked.map((song) => (
                                <span
                                  key={song.name}
                                  className="plan-value inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 pl-1.5 pr-2 py-1 text-[12px] text-ink leading-none"
                                >
                                  <Music4 className="w-3 h-3 shrink-0" style={{ color: accent }} strokeWidth={2.4} />
                                  {song.name}
                                  <span className="text-[10.5px] font-semibold text-ink-3">{song.tone}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <EmptySlot text={plan.empty} />
                          )
                        ) : filled ? (
                          <span className="plan-value flex flex-col items-start gap-1 min-w-0 sm:flex-row sm:items-center sm:gap-2">
                            {writing?.kind === item.kind && (
                              <WritingChip
                                mode={writing.mode}
                                label={writing.mode === "voice" ? plan.voiceLabel : plan.typingLabel}
                              />
                            )}
                            <span className="min-w-0 max-w-full text-[13px] text-ink-2 leading-[1.35] truncate">
                              {writing?.kind === item.kind ? item.value.slice(0, writing.n) : item.value}
                              {writing?.mode === "type" && writing.kind === item.kind && <span className="plan-caret" />}
                            </span>
                          </span>
                        ) : (
                          <EmptySlot text={plan.empty} />
                        )}
                      </div>

                      <span className="flex items-center gap-1.5 shrink-0 pt-0.5" title={`${item.who} · ${item.role}`}>
                        <PersonAvatar look={lookFor(item.who)} size={22} className="rounded-full" />
                        <span className="hidden md:inline text-[12.5px] text-ink-3 leading-none">{item.short}</span>
                        {filled && (
                          <span className="plan-slot-on w-4 h-4 rounded-full bg-[#12a150] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-2 px-5 py-3.5 border-t border-hairline bg-surface-2">
                <span className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", done ? "bg-[#12a150]" : "bg-brand-soft")}>
                  {done ? <Check className="w-3 h-3 text-white" strokeWidth={3.5} /> : <Clock className="w-3 h-3 text-brand" strokeWidth={2.6} />}
                </span>
                <span className="text-[12.5px] font-medium text-ink-2 leading-none">
                  {done ? plan.ready : plan.progress.replace("{n}", String(filledCount)).replace("{total}", String(rows.length))}
                </span>
              </div>
            </div>

            {/* The hands */}
            {tap && (
              <span key={tap.id} aria-hidden className="demo-tap" style={{ transform: `translate3d(${tap.x}px, ${tap.y}px, 0)` }} />
            )}
            {Object.entries(ptrs).map(([actor, p]) => {
              const person = owner(actor);
              if (!person) return null;
              return (
                <GhostPointer
                  key={actor}
                  p={p}
                  label={person.short}
                  look={lookFor(person.who)}
                  accent={BLOCK_ACCENTS[actor] ?? "var(--brand)"}
                  flip={p.flip}
                />
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* A block nobody has touched yet. */
function EmptySlot({ text }: { text: string }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-hairline-strong px-2 py-1 text-[11.5px] text-ink-3 leading-[1.3]">
      <Plus className="w-3 h-3 shrink-0" strokeWidth={2.4} /> {text}
    </span>
  );
}

/* Somebody is filling the block right now — by keyboard or by voice. */
function WritingChip({ mode, label }: { mode: Live["mode"]; label: string }) {
  return (
    <span className="plan-slot-on shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-brand leading-none">
      {mode === "voice" ? <Mic className="w-3 h-3" strokeWidth={2.4} /> : <Keyboard className="w-3 h-3" strokeWidth={2.4} />}
      {mode === "voice" && (
        <span className="demo-wave">
          <i /><i /><i /><i />
        </span>
      )}
      {label}
    </span>
  );
}

/* One row of the song library — taken songs turn green and say so. */
function SongRow({ slot, name, tone, picked, label }: { slot: string; name: string; tone: string; picked: boolean; label: string }) {
  return (
    <div
      data-slot={slot}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors",
        picked ? "border-[#12a150]/45 bg-[#12a150]/8" : "border-hairline bg-surface"
      )}
    >
      <span className="w-5 h-5 rounded-md bg-surface-2 flex items-center justify-center shrink-0">
        <Music4 className="w-[11px] h-[11px] text-ink-3" strokeWidth={2.2} />
      </span>
      <span className="flex-1 min-w-0 text-[12.5px] font-medium text-ink leading-none truncate">{name}</span>
      {picked ? (
        <span className="plan-slot-on flex items-center gap-1 text-[10.5px] font-semibold text-[#0e7a3c] dark:text-[#3ddc97] leading-none">
          <Check className="w-3 h-3" strokeWidth={3.2} /> <span className="hidden sm:inline">{label}</span>
        </span>
      ) : (
        <span className="text-[11px] font-semibold text-ink-3 leading-none tabular-nums">{tone}</span>
      )}
    </div>
  );
}

/* The same ghost hand the role screens use — one per person on the plan. */
function GhostPointer({ p, label, look, accent, flip }: { p: Pointer; label: string; look: AvatarLook; accent: string; flip: boolean }) {
  return (
    <span
      aria-hidden
      data-press={p.press ? "1" : "0"}
      className="demo-cursor"
      style={{
        transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
        transitionDuration: `${p.ms}ms`,
        opacity: p.on ? 1 : 0,
      }}
    >
      <svg className="demo-cursor-arrow" width={34} height={37} viewBox="0 0 22 24" fill="none">
        <path
          d="M4 2.2 17.4 13.1c.7.6.3 1.7-.6 1.8l-5.4.5a1 1 0 0 0-.8.6l-2.2 5a1 1 0 0 1-1.9-.2L3.3 3.2c-.2-.9.9-1.5 1.6-1z"
          fill={accent}
          stroke="var(--surface)"
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          "absolute top-[28px] flex items-center gap-1.5 rounded-full py-[3px] pl-[3px] pr-3",
          "text-[12.5px] font-semibold text-white whitespace-nowrap shadow-[0_10px_20px_-10px_rgba(0,0,0,0.55)]",
          flip ? "right-[12px]" : "left-[24px]"
        )}
        style={{ background: accent }}
      >
        <PersonAvatar look={look} size={20} className="rounded-full ring-[1.5px] ring-white/50" />
        {label}
      </span>
    </span>
  );
}
