"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { UserPlus, Heart, UsersRound, Droplets, HeartHandshake, Crown, Quote, ArrowRight, Check, AlertTriangle } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import IllustratedAvatar, { AVATAR_LOOKS, type AvatarLook } from "@/components/shared/illustrated-avatar";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";

const ICONS = [UserPlus, Heart, UsersRound, Droplets, HeartHandshake, Crown];
/* sky → pink → blue → cyan → violet → green: the person grows along the path */
const ACCENTS = ["#0ea5e9", "#f05b8b", "#007aff", "#38bdf8", "#8b5bf0", "#12a150"];
const N = ICONS.length;
const STEP_MS = 2600;
const FALL_MS = 3000;
const CATCH_MS = 3600;
/* a click parks the walk on that step — then it picks itself up and carries on */
const IDLE_MS = 9000;
/* where the person lands when they slip: back down the slope, below the road (px from where they stood) */
const FALL_DX = -60;
const FALL_DY = 84;
/* where the helper stands: just below-right of the fallen person while reaching out, up-slope once they're back */
const HELPER_FALL = { dx: -14, dy: 106 };
const HELPER_CATCH = { dx: 44, dy: -52 };
/* Four people walk this road, one after another — each with their own face and their own way of
   getting stuck. The shirt always takes the colour of the step they are on, so you watch them change. */
const HERO_LOOKS = [AVATAR_LOOKS[6], AVATAR_LOOKS[1], AVATAR_LOOKS[4], AVATAR_LOOKS[5]];
const HELPER = AVATAR_LOOKS[3];
/* Optional real footage of that change: drop files into public/journey/ and name them per stage id,
   e.g. { baptism: "/journey/baptism.mp4", leader: "/journey/leader.webp" }. A listed step shows the
   picture or clip in its card; .mp4/.webm autoplay muted on loop. */
const MEDIA: Record<string, string | undefined> = {};
const WARN = "#f59e0b";
const SAFE = "#12a150";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const TRACK_Y = "linear-gradient(180deg, #0ea5e9, #007aff 50%, #12a150)";

/* ── The road ──────────────────────────────────────────────────────────────
   Nodes climb from bottom-left to top-right along one smooth curve; each one
   sits on a small ledge (flat tangent) so the line reads as a winding road up
   a hill rather than a straight ramp. Coordinates are percentages of the box. */
const HILL_W = 1000; /* viewBox units — roughly the real px aspect so arc lengths are honest */
const HILL_H = 300;
const XS = Array.from({ length: N }, (_, i) => ((i + 0.5) / N) * 100);
const YS = Array.from({ length: N }, (_, i) => 78 - 62 * Math.pow(i / (N - 1), 1.2));
const PX = (x: number) => (x / 100) * HILL_W;
const PY = (y: number) => (y / 100) * HILL_H;

function segment(i: number) {
  const x0 = PX(XS[i]), y0 = PY(YS[i]), x1 = PX(XS[i + 1]), y1 = PY(YS[i + 1]);
  const cx = (x1 - x0) * 0.5;
  return { x0, y0, c1x: x0 + cx, c1y: y0, c2x: x1 - cx, c2y: y1, x1, y1 };
}
const HILL_PATH = `M ${PX(XS[0])} ${PY(YS[0])} ` + Array.from({ length: N - 1 }, (_, i) => {
  const s = segment(i);
  return `C ${s.c1x} ${s.c1y} ${s.c2x} ${s.c2y} ${s.x1} ${s.y1}`;
}).join(" ");
const HILL_FILL = `${HILL_PATH} L ${PX(XS[N - 1])} ${HILL_H} L ${PX(XS[0])} ${HILL_H} Z`;

/* A softer ridge behind the road, purely for depth. */
const FAR_HILL = `M 0 ${HILL_H} L 0 205 C 170 180 250 120 420 132 C 560 142 640 60 800 52 C 890 47 950 30 1000 24 L 1000 ${HILL_H} Z`;

/* The road sampled by arc length: lets the person actually walk along the curve, and gives the
   progress dash an honest fraction at every node. */
const SAMPLES: { f: number; x: number; y: number }[] = [];
const NODE_FRACTION: number[] = [0];
{
  const STEPS = 40;
  let cum = 0;
  SAMPLES.push({ f: 0, x: XS[0], y: YS[0] });
  for (let i = 0; i < N - 1; i++) {
    const s = segment(i);
    let px = s.x0, py = s.y0;
    for (let k = 1; k <= STEPS; k++) {
      const t = k / STEPS, u = 1 - t;
      const x = u * u * u * s.x0 + 3 * u * u * t * s.c1x + 3 * u * t * t * s.c2x + t * t * t * s.x1;
      const y = u * u * u * s.y0 + 3 * u * u * t * s.c1y + 3 * u * t * t * s.c2y + t * t * t * s.y1;
      cum += Math.hypot(x - px, y - py);
      px = x; py = y;
      SAMPLES.push({ f: cum, x: (x / HILL_W) * 100, y: (y / HILL_H) * 100 });
    }
    NODE_FRACTION.push(cum);
  }
  for (const smp of SAMPLES) smp.f /= cum;
  for (let i = 0; i < NODE_FRACTION.length; i++) NODE_FRACTION[i] /= cum;
}
/* the point on the road at a given fraction of its length (percent coordinates) */
function pointAt(f: number) {
  const target = Math.min(1, Math.max(0, f));
  let lo = 0, hi = SAMPLES.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (SAMPLES[mid].f <= target) lo = mid; else hi = mid;
  }
  const a = SAMPLES[lo], b = SAMPLES[hi];
  const t = b.f === a.f ? 0 : (target - a.f) / (b.f - a.f);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
/* A stop sits on a node (at = 2) or anywhere between two of them (at = 2.5) — that is where most
   people actually fall off: not at a milestone, but on the stretch in between. */
const fracAt = (at: number) => {
  const lo = Math.max(0, Math.min(N - 1, Math.floor(at)));
  const hi = Math.min(N - 1, lo + 1);
  return NODE_FRACTION[lo] + (NODE_FRACTION[hi] - NODE_FRACTION[lo]) * (at - lo);
};

type NodeState = "done" | "now" | "next";
type Phase = "walk" | "fall" | "catch";
type Stop = { at: number; fallLabel: string; fallText: string; catchLabel: string; catchText: string; chart: number[] };
type Beat = { pos: number; phase: Phase; stop?: Stop };

/* One person's trip: every node in order, with their own stops slotted in where they happen. */
function beatsFor(stops: Stop[]): Beat[] {
  const out: Beat[] = [];
  for (let i = 0; i < N; i++) {
    out.push({ pos: i, phase: "walk" });
    for (const stop of stops) {
      if (stop.at >= i && stop.at < i + 1) {
        out.push({ pos: stop.at, phase: "fall", stop }, { pos: stop.at, phase: "catch", stop });
      }
    }
  }
  return out;
}

function nodeStyle(state: NodeState, accent: string, phase: Phase = "walk"): React.CSSProperties {
  if (state === "done") return { background: accent, borderColor: accent, color: "#fff" };
  if (state === "now" && phase === "fall") {
    return {
      background: "var(--surface)",
      borderColor: WARN,
      borderStyle: "dashed",
      color: WARN,
      boxShadow: `0 0 0 5px color-mix(in oklab, ${WARN} 18%, transparent)`,
    };
  }
  if (state === "now") {
    return {
      background: accent,
      borderColor: accent,
      color: "#fff",
      boxShadow: `0 0 0 5px color-mix(in oklab, ${accent} 18%, transparent), 0 12px 24px -12px ${accent}`,
    };
  }
  return { background: "var(--surface)", borderColor: "var(--hairline-strong)", color: accent };
}

/* The same weekly series drawn twice: only down to its lowest point while the person is slipping,
   then the whole thing once the church steps in — so the line visibly recovers. */
function Spark({ values, total, max, color }: { values: number[]; total: number; max: number; color: string }) {
  const W = 122, H = 42, PAD = 5;
  const x = (i: number) => PAD + (i / Math.max(1, total - 1)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - (v / Math.max(1, max)) * (H - PAD * 2);
  const line = values.map((v, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(values.length - 1).toFixed(1)} ${H} L ${x(0).toFixed(1)} ${H} Z`;
  const last = values.length - 1;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden className="overflow-visible">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--hairline-strong)" strokeWidth="1" />
      <path d={area} fill={color} opacity="0.12" />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        className="journey-draw"
      />
      <circle cx={x(last)} cy={y(values[last])} r="3.2" fill={color} stroke="var(--surface)" strokeWidth="1.6" />
    </svg>
  );
}

export default function Journey() {
  const t = useT();
  const j = t.journey;
  const { open } = useDemoModal();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [touched, setTouched] = useState(false);
  /* who is walking right now, and how far into their trip they are */
  const [hero, setHero] = useState(0);
  const [beat, setBeat] = useState(0);
  const resumeRef = useRef<number | null>(null);
  /* how far along the road the person is right now, 0..1 */
  const [frac, setFrac] = useState(NODE_FRACTION[0]);
  const fracRef = useRef(NODE_FRACTION[0]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const people = j.people;
  const person = people[hero % people.length];
  const beats = useMemo(() => beatsFor(person.stops as Stop[]), [person]);
  const cur = beats[Math.min(beat, beats.length - 1)];
  const { pos, phase, stop } = cur;
  const stage = Math.min(N - 1, Math.floor(pos));

  /* Walks the road on its own the whole time it is on screen. Where things go wrong the person
     lingers: slips off the road, someone from the church reaches out — and the walk goes on. At the
     top of the hill the next person starts from the bottom with their own story. */
  useEffect(() => {
    if (!inView || touched || prefersReducedMotion()) return;
    const delay = phase === "fall" ? FALL_MS : phase === "catch" ? CATCH_MS : STEP_MS;
    const id = setTimeout(() => {
      if (beat + 1 < beats.length) setBeat(beat + 1);
      else { setHero((h) => h + 1); setBeat(0); }
    }, delay);
    return () => clearTimeout(id);
  }, [inView, touched, beat, beats.length, phase]);

  useEffect(() => () => { if (resumeRef.current) window.clearTimeout(resumeRef.current); }, []);

  /* The person walks along the road to where they are due — through everything in between when the
     visitor jumps ahead. Starting over (top → bottom) is a cut, not a walk back down. */
  useEffect(() => {
    const target = fracAt(pos);
    const from = fracRef.current;
    if (from === target) return;
    /* no walk when there is nothing to draw it with: reduced motion, a background tab (rAF is paused
       there and the person would lag behind), or a new person starting from the bottom */
    const cut = prefersReducedMotion() || document.visibilityState === "hidden" || (pos === 0 && from > target);
    const dur = cut ? 0 : Math.min(1800, 500 + 2400 * Math.abs(target - from));
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      const f = from + (target - from) * e;
      fracRef.current = f;
      setFrac(f);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  const pick = (i: number) => {
    const b = beats.findIndex((x) => x.phase === "walk" && x.pos === i);
    setTouched(true);
    setBeat(b < 0 ? 0 : b);
    if (resumeRef.current) window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setTouched(false), IDLE_MS);
  };

  const falling = phase === "fall" && !!stop;
  const caught = phase === "catch" && !!stop;
  const stumbling = falling || caught;
  const cardLabel = stop && falling ? stop.fallLabel : stop && caught ? stop.catchLabel : `${j.helpsLabel} · ${j.stages[stage].name}`;
  const cardText = stop && falling ? stop.fallText : stop && caught ? stop.catchText : j.stages[stage].text;
  const media = stumbling ? undefined : MEDIA[j.stages[stage].id];
  /* the graph of their weeks: cut off at the low point while they slip, whole once they are caught */
  const chart = stop?.chart;
  const low = chart ? chart.indexOf(Math.min(...chart)) : 0;
  const series = chart ? (falling ? chart.slice(0, low + 1) : chart) : undefined;
  const look: AvatarLook = { ...HERO_LOOKS[hero % HERO_LOOKS.length], shirt: ACCENTS[stage] };
  /* where the person stands on the road right now */
  const here = pointAt(frac);
  const stateOf = (i: number): NodeState => (i < stage ? "done" : i === stage ? "now" : "next");
  const CurrentIcon = ICONS[stage];

  return (
    <section id="mission" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <div className="flex flex-col items-center gap-5">
          <SectionHeading eyebrow={j.eyebrow} title={j.title} text={j.text} />
          <FadeIn delay={1}>
            <span className="inline-flex items-center gap-2.5 rounded-full bg-brand-soft border border-brand/25 pl-3 pr-4 py-2 text-[13.5px] text-ink">
              <Quote className="w-3.5 h-3.5 text-brand" strokeWidth={2.5} />
              <span className="italic">«{j.verse}»</span>
              <span className="text-ink-3">— {j.verseRef}</span>
            </span>
          </FadeIn>
        </div>

        <FadeIn variant="scale">
          <div ref={hostRef} className="relative rounded-[24px] md:rounded-[32px] border border-hairline bg-page overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 85%)",
                WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 85%)",
              }}
            />

            <div className="relative p-5 md:p-8 lg:p-10 flex flex-col gap-7 md:gap-10">
              {/* Side by side once there is room; on a phone the label and the
                  walker chip each get their own line instead of both wrapping. */}
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{j.pathTitle}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-surface border border-hairline pl-1.5 pr-3 py-1 text-[12px] font-medium text-ink-2 whitespace-nowrap max-w-full">
                  <span key={`${hero}-${stage}`} className="journey-morph rounded-full ring-2 ring-surface">
                    <IllustratedAvatar look={look} size={20} />
                  </span>
                  <span className="text-ink font-semibold">{person.name}</span>
                  <span className="hidden lg:inline text-ink-3">{person.note}</span>
                  <span className="text-ink-3">·</span>
                  <span className="tabular-nums">{j.stepOf.replace("{n}", String(stage + 1)).replace("{total}", String(N))}</span>
                </span>
              </div>

              {/* ── Desktop: the road up the hill ───────────── */}
              <ol className="relative hidden md:block h-[300px] lg:h-[330px]">
                <svg
                  aria-hidden
                  className="absolute inset-0 w-full h-full overflow-visible"
                  viewBox={`0 0 ${HILL_W} ${HILL_H}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="journey-track" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#0ea5e9" />
                      <stop offset="0.5" stopColor="#007aff" />
                      <stop offset="1" stopColor="#12a150" />
                    </linearGradient>
                    <linearGradient id="journey-slope" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#007aff" stopOpacity="0.13" />
                      <stop offset="0.7" stopColor="#007aff" stopOpacity="0.02" />
                      <stop offset="1" stopColor="#007aff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="journey-far" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#12a150" stopOpacity="0.09" />
                      <stop offset="1" stopColor="#12a150" stopOpacity="0" />
                    </linearGradient>
                    {/* everything walked so far, as a mask — lets the road markings light up with it */}
                    <mask id="journey-walked">
                      <path
                        d={HILL_PATH}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="18"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        pathLength={1}
                        strokeDasharray="1 1"
                        style={{ strokeDashoffset: 1 - frac }}
                      />
                    </mask>
                  </defs>

                  {/* the land: a far ridge, then the slope the road runs on */}
                  <path d={FAR_HILL} fill="url(#journey-far)" />
                  <path d={HILL_FILL} fill="url(#journey-slope)" />

                  {/* the road: soft ground shadow, verge, surface */}
                  <path d={HILL_PATH} fill="none" stroke="rgba(15,23,42,0.07)" strokeWidth="20" strokeLinecap="round" vectorEffect="non-scaling-stroke" transform="translate(0, 4)" />
                  <path d={HILL_PATH} fill="none" stroke="var(--hairline-strong)" strokeOpacity="0.55" strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path d={HILL_PATH} fill="none" stroke="var(--surface)" strokeWidth="15" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                  {/* the stretch already walked */}
                  <path
                    d={HILL_PATH}
                    fill="none"
                    stroke="url(#journey-track)"
                    strokeWidth="15"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    strokeDasharray="1 1"
                    style={{ strokeDashoffset: 1 - frac }}
                  />

                  {/* road markings: dim down the whole way, bright on the part behind the person */}
                  <path d={HILL_PATH} fill="none" stroke="var(--hairline-strong)" strokeWidth="2" strokeLinecap="round" strokeDasharray="9 13" vectorEffect="non-scaling-stroke" />
                  <path d={HILL_PATH} fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" strokeDasharray="9 13" vectorEffect="non-scaling-stroke" mask="url(#journey-walked)" />
                </svg>

                {/* the light around the person, in the colour of the step they are on */}
                <span
                  aria-hidden
                  className="absolute z-0 pointer-events-none rounded-full"
                  style={{
                    left: `${here.x}%`,
                    top: `${here.y}%`,
                    width: 260,
                    height: 260,
                    transform: "translate(-50%, -50%)",
                    background: `radial-gradient(circle, color-mix(in oklab, ${falling ? WARN : caught ? SAFE : ACCENTS[stage]} 20%, transparent) 0%, transparent 68%)`,
                    transition: "background 600ms linear",
                  }}
                />

                {/* the person, walking — or slipping off the road */}
                <span
                  aria-hidden
                  className="absolute z-20 pointer-events-none flex flex-col items-center"
                  style={{
                    left: `${here.x}%`,
                    top: `calc(${here.y}% - 36px)`,
                    transition: `transform 700ms ${EASE}`,
                    /* the avatar's centre sits 59px above the road; the fall moves it to (FALL_DX, FALL_DY) */
                    transform: falling
                      ? `translate(-50%, -100%) translate(${FALL_DX}px, ${FALL_DY + 59}px) rotate(-18deg)`
                      : "translate(-50%, -100%)",
                  }}
                >
                  <span className="relative">
                    <span
                      className="block rounded-full ring-[3px] shadow-[0_12px_22px_-10px_rgba(15,23,42,0.5)] transition-[box-shadow,--tw-ring-color] duration-500"
                      style={{ ["--tw-ring-color" as string]: falling ? WARN : caught ? SAFE : "var(--surface)" }}
                    >
                      <span key={`${hero}-${stage}`} className="journey-morph block">
                        <IllustratedAvatar look={look} size={36} />
                      </span>
                    </span>
                    <span
                      className={["absolute -top-1.5 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-surface transition-all duration-300", stumbling ? "scale-100 opacity-100" : "scale-50 opacity-0"].join(" ")}
                      style={{ background: falling ? WARN : SAFE }}
                    >
                      {falling ? <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.75} /> : <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                    </span>
                  </span>
                  <span
                    className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[6px] border-t-surface -mt-px transition-opacity duration-300"
                    style={{ opacity: falling ? 0 : 1 }}
                  />
                </span>

                {/* their shadow on the road, so they read as standing on it */}
                <span
                  aria-hidden
                  className="absolute z-10 pointer-events-none rounded-[50%]"
                  style={{
                    left: `${here.x}%`,
                    top: `${here.y}%`,
                    width: 26,
                    height: 7,
                    transform: "translate(-50%, -50%)",
                    background: "rgba(15,23,42,0.22)",
                    filter: "blur(2px)",
                    opacity: falling ? 0 : 1,
                    transition: `opacity 400ms ${EASE}`,
                  }}
                />

                {/* the one who reaches out — appears beside the fallen person and walks them back */}
                <span
                  aria-hidden
                  className="absolute z-20 pointer-events-none"
                  style={{
                    left: `calc(${here.x}% + ${caught ? HELPER_CATCH.dx : HELPER_FALL.dx}px)`,
                    top: `calc(${here.y}% + ${caught ? HELPER_CATCH.dy : HELPER_FALL.dy}px)`,
                    opacity: stumbling ? 1 : 0,
                    transform: stumbling ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) translateY(16px) scale(0.6)",
                    transition: stumbling
                      ? `left 700ms ${EASE}, top 700ms ${EASE}, opacity 500ms ${EASE} 700ms, transform 600ms ${EASE} 700ms`
                      : `opacity 300ms ${EASE}, transform 300ms ${EASE}`,
                  }}
                >
                  <span className="relative">
                    <span className="block rounded-full ring-[3px] ring-surface shadow-[0_12px_22px_-10px_rgba(15,23,42,0.5)]"><IllustratedAvatar look={HELPER} size={36} /></span>
                    <span className="absolute -bottom-1 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-surface" style={{ background: SAFE }}>
                      <HeartHandshake className="w-2.5 h-2.5" strokeWidth={2.5} />
                    </span>
                  </span>
                </span>

                {j.stages.map((st, i) => {
                  const Icon = ICONS[i];
                  const state = stateOf(i);
                  const now = state === "now";
                  const size = now ? 60 : 44;
                  return (
                    /* a zero-size anchor on the road, so the marker and its label never shift the others */
                    <li key={st.id} className="absolute w-0 h-0" style={{ left: `${XS[i]}%`, top: `${YS[i]}%` }}>
                      <button
                        type="button"
                        onClick={() => pick(i)}
                        aria-current={now ? "step" : undefined}
                        aria-label={st.name}
                        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                        style={{ width: size, height: size, ...nodeStyle(state, ACCENTS[i], phase) }}
                      >
                        {state === "done" ? <Check className="w-5 h-5" strokeWidth={2.75} /> : <Icon className={now ? "w-6 h-6" : "w-5 h-5"} strokeWidth={2} />}
                        {now && phase === "walk" && (
                          <span aria-hidden className="pulse-ring absolute inset-0 rounded-full border-2" style={{ borderColor: ACCENTS[i] }} />
                        )}
                      </button>
                      <span
                        className={[
                          "absolute -translate-x-1/2 top-[42px] whitespace-nowrap rounded-full px-2.5 py-1 text-[14px] font-semibold leading-none transition-all duration-300",
                          now ? "text-ink bg-surface border border-hairline shadow-[0_6px_18px_-12px_rgba(15,23,42,0.6)]" : state === "done" ? "text-ink-2" : "text-ink-3",
                        ].join(" ")}
                      >
                        {st.name}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* what the system does at the current step — or what happens when the person slips */}
              <div className="hidden md:flex justify-center">
                <div
                  key={`${hero}-${beat}`}
                  className="reveal reveal-scale is-visible w-full max-w-[760px] rounded-2xl bg-surface border px-5 py-4 flex items-center gap-4 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.3)]"
                  style={{ borderColor: falling ? `color-mix(in oklab, ${WARN} 45%, var(--hairline))` : caught ? `color-mix(in oklab, ${SAFE} 45%, var(--hairline))` : "var(--hairline)" }}
                >
                  <span className="relative shrink-0 flex items-center">
                    <span className="block rounded-full ring-[3px] ring-surface shadow-[0_10px_24px_-12px_rgba(0,0,0,0.4)]">
                      <IllustratedAvatar look={look} size={46} />
                    </span>
                    {caught && (
                      <span className="block -ml-3 rounded-full ring-[3px] ring-surface shadow-[0_10px_24px_-12px_rgba(0,0,0,0.4)]">
                        <IllustratedAvatar look={HELPER} size={46} />
                      </span>
                    )}
                    <span
                      className="absolute -bottom-1 -right-1.5 w-6 h-6 rounded-lg flex items-center justify-center text-white border-2 border-surface"
                      style={{ background: falling ? WARN : caught ? SAFE : ACCENTS[stage] }}
                    >
                      {falling ? <AlertTriangle className="w-3 h-3" strokeWidth={2.4} /> : caught ? <HeartHandshake className="w-3 h-3" strokeWidth={2.4} /> : <CurrentIcon className="w-3 h-3" strokeWidth={2.4} />}
                    </span>
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: falling ? WARN : caught ? SAFE : "var(--ink-3)" }}>
                      {cardLabel}
                    </span>
                    <span className="text-[15px] text-ink leading-[1.5]">{cardText}</span>
                  </div>
                  {series && (
                    <span className="ml-auto shrink-0 self-stretch flex flex-col items-end justify-center gap-1 pl-4 border-l border-hairline">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">{j.chartLabel}</span>
                      <Spark values={series} total={chart!.length} max={Math.max(...chart!)} color={falling ? WARN : SAFE} />
                    </span>
                  )}
                  {media && (
                    <span className="ml-auto hidden lg:block shrink-0 w-[112px] h-[68px] rounded-xl overflow-hidden border border-hairline bg-page">
                      {/\.(mp4|webm)$/.test(media) ? (
                        <video src={media} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                      ) : (
                        <Image src={media} alt="" width={224} height={136} className="w-full h-full object-cover" />
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Mobile: vertical stepper ────────────────── */}
              <ol className="relative md:hidden flex flex-col gap-4">
                <span aria-hidden className="absolute left-[22px] top-6 bottom-6 w-[3px] rounded-full bg-hairline-strong/70" />
                <span
                  aria-hidden
                  className="absolute left-[22px] top-6 w-[3px] rounded-full"
                  style={{ height: `calc((100% - 48px) * ${pos / (N - 1)})`, background: TRACK_Y, transition: `height 700ms ${EASE}` }}
                />
                {j.stages.map((st, i) => {
                  const Icon = ICONS[i];
                  const state = stateOf(i);
                  const now = state === "now";
                  return (
                    <li key={st.id} className="relative">
                      <button type="button" onClick={() => pick(i)} aria-current={now ? "step" : undefined} className="w-full flex items-start gap-4 text-left">
                        <span
                          className="relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500"
                          style={nodeStyle(state, ACCENTS[i], phase)}
                        >
                          {state === "done" ? <Check className="w-5 h-5" strokeWidth={2.75} /> : <Icon className="w-5 h-5" strokeWidth={2} />}
                        </span>
                        <span className="flex flex-col gap-1 pt-3 min-w-0">
                          <span className={["text-[15px] font-semibold leading-[1.2] transition-colors duration-300", state === "next" ? "text-ink-3" : "text-ink"].join(" ")}>
                            <span className="text-ink-3 tabular-nums mr-1.5">{i + 1}.</span>{st.name}
                          </span>
                          <span className={["text-[13.5px] leading-[1.45] transition-all duration-300", now ? "text-ink-2 max-h-72 opacity-100" : "text-ink-3 max-h-0 opacity-0 overflow-hidden"].join(" ")}>
                            {now && stumbling ? (
                              <span className="flex flex-col gap-1 border-l-2 pl-2.5" style={{ borderColor: falling ? WARN : SAFE }}>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: falling ? WARN : SAFE }}>{cardLabel}</span>
                                {cardText}
                                {series && <Spark values={series} total={chart!.length} max={Math.max(...chart!)} color={falling ? WARN : SAFE} />}
                              </span>
                            ) : st.text}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[24px] border border-hairline p-7 md:p-9" style={{ background: "linear-gradient(120deg, color-mix(in oklab, #12a150 8%, var(--surface)), var(--surface) 60%)" }}>
          <div className="flex flex-col gap-2 max-w-[640px]">
            <h3 className="font-semibold text-ink text-[22px] md:text-[28px] leading-[1.2] tracking-[-0.5px]">{j.closingTitle}</h3>
            <p className="text-[15.5px] text-ink-2 leading-[1.5]">{j.closingText}</p>
          </div>
          <button onClick={open} className="btn-primary btn-brand group relative inline-flex items-center justify-center gap-2 h-[50px] px-7 rounded-full overflow-hidden shrink-0">
            <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.3px] whitespace-nowrap">{t.common.bookDemo}</span>
            <ArrowRight className="relative w-[16px] h-[16px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </FadeIn>
      </div>
    </section>
  );
}
