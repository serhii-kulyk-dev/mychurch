"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import IllustratedAvatar, { type AvatarLook } from "@/components/shared/illustrated-avatar";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

type Pointer = { x: number; y: number; ms: number; on: boolean; press: boolean };

const AWAY: Pointer = { x: 0, y: 0, ms: 0, on: false, press: false };

/* How long the pointer takes to cross a distance — near-constant speed,
   but never so fast it teleports or so slow it drags. */
function travelMs(dist: number) {
  return Math.round(Math.min(900, Math.max(360, dist * 1.25)));
}

/* Plays a screen by itself: a ghost pointer walks to every element marked
   with data-demo inside, hovers it (`hover`) or presses it (`click`), so a
   visitor sees what the role actually does without touching anything.
   A real pointer over the area always wins — the demo steps aside at once.
   Re-run it by changing `playKey`. */
export default function CursorDemo({
  playKey,
  active = true,
  startDelay = 1200,
  onDone,
  className,
  children,
  label,
  look,
  accent,
  mode = "pointer",
}: {
  playKey: string;
  active?: boolean;
  startDelay?: number;
  /** Called a beat after the walk ends — bump `playKey` here to replay. */
  onDone?: () => void;
  className?: string;
  children: ReactNode;
  /** Whose hand this is — shown as a name tag beside the pointer. */
  label?: string;
  look?: AvatarLook;
  accent?: string;
  /** "pointer" — миша на комп'ютері, "touch" — палець у телефоні чи Telegram. */
  mode?: "pointer" | "touch";
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const overRef = useRef(false);
  const [cursor, setCursor] = useState<Pointer>(AWAY);
  const [tap, setTap] = useState(0);
  /* Near the right edge the name tag would run off the card — hang it left. */
  const [flip, setFlip] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [inView, setInView] = useState(false);
  const doneRef = useRef(onDone);
  const resumeRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);
  useEffect(() => () => window.clearTimeout(resumeRef.current), []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* A new screen gets a fresh run — unless the visitor's own pointer is on it. */
  useEffect(() => setStopped(overRef.current), [playKey]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !active || !inView || stopped || prefersReducedMotion()) return;

    const targets = Array.from(host.querySelectorAll<HTMLElement>("[data-demo]"));
    if (!targets.length) return;

    let cancelled = false;
    const timers: number[] = [];
    const hot = new Set<HTMLElement>();
    const sleep = (ms: number) => new Promise<void>((res) => timers.push(window.setTimeout(res, ms)));
    const parked = () => {
      const b = host.getBoundingClientRect();
      return { x: b.width * 0.82, y: b.height + 40 };
    };
    const centerOf = (el: HTMLElement) => {
      const b = host.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
    };

    (async () => {
      {
        await sleep(0);
        if (cancelled) return;
        let from = parked();
        setCursor({ ...from, ms: 0, on: false, press: false });
        await sleep(startDelay);
        if (cancelled) return;

        for (const el of targets) {
          const to = centerOf(el);
          setFlip(to.x > host.getBoundingClientRect().width - 170);
          const ms = travelMs(Math.hypot(to.x - from.x, to.y - from.y));
          setCursor({ ...to, ms, on: true, press: false });
          from = to;
          await sleep(ms + 240);
          if (cancelled) return;

          if (el.dataset.demo === "hover") {
            el.setAttribute("data-demo-hot", "");
            hot.add(el);
            await sleep(1100);
            if (cancelled) return;
            el.removeAttribute("data-demo-hot");
            hot.delete(el);
          } else {
            setCursor((c) => ({ ...c, ms: 0, press: true }));
            setTap((n) => n + 1);
            await sleep(150);
            if (cancelled) return;
            el.click();
            await sleep(190);
            setCursor((c) => ({ ...c, press: false }));
            await sleep(950);
          }
          if (cancelled) return;
        }

        const out = parked();
        setCursor({ ...out, ms: 620, on: false, press: false });
        await sleep(2000);
        if (!cancelled) doneRef.current?.();
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
      hot.forEach((el) => el.removeAttribute("data-demo-hot"));
    };
  }, [playKey, active, inView, stopped, startDelay]);

  /* A real hand always wins: a tap, or a mouse moving over the screen. */
  const yieldToUser = (e: { pointerType?: string }, hover: boolean) => {
    if (hover && e.pointerType === "touch") return;
    window.clearTimeout(resumeRef.current);
    overRef.current = hover;
    setStopped(true);
  };

  /* …and takes the screen back once the hand is gone: a beat after the real
     pointer leaves, the panel starts the next scene from the top, so a
     visitor who only brushed past it does not leave it frozen mid-demo. */
  const takeBack = () => {
    overRef.current = false;
    if (!stopped) return;
    window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => {
      if (!overRef.current) doneRef.current?.();
    }, 900);
  };

  return (
    <div
      ref={hostRef}
      className={cn("relative", className)}
      onPointerMove={(e) => yieldToUser(e, true)}
      onPointerDown={(e) => yieldToUser(e, false)}
      onPointerLeave={takeBack}
    >
      {children}
      {tap > 0 && (
        <span
          key={`tap-${tap}`}
          aria-hidden
          className="demo-tap"
          style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
        />
      )}
      <span
        aria-hidden
        data-press={cursor.press ? "1" : "0"}
        className="demo-cursor"
        style={{
          transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
          transitionDuration: `${cursor.ms}ms`,
          /* Реальна рука зупиняє показ, але привидний курсор лишається на
             місці — інакше він блимав би щоразу, коли миша торкнеться панелі. */
          opacity: cursor.on && active && inView ? 1 : 0,
        }}
      >
        {mode === "touch" ? (
          <span className="demo-touch" style={{ borderColor: accent ?? "var(--ink)", background: `color-mix(in oklab, ${accent ?? "var(--ink)"} 22%, transparent)` }} />
        ) : (
          <svg className="demo-cursor-arrow" width={label ? 34 : 22} height={label ? 37 : 24} viewBox="0 0 22 24" fill="none">
            <path
              d="M4 2.2 17.4 13.1c.7.6.3 1.7-.6 1.8l-5.4.5a1 1 0 0 0-.8.6l-2.2 5a1 1 0 0 1-1.9-.2L3.3 3.2c-.2-.9.9-1.5 1.6-1z"
              fill={accent ?? "var(--ink)"}
              stroke="var(--surface)"
              strokeWidth={label ? 2.2 : 1.6}
              strokeLinejoin="round"
            />
          </svg>
        )}
        {label && (
          <span
            className={cn(
              "demo-cursor-tag absolute flex items-center gap-1.5 rounded-full py-[3px] pl-[3px] pr-3",
              mode === "touch" ? "top-[20px]" : "top-[28px]",
              "text-[12.5px] font-semibold text-white whitespace-nowrap shadow-[0_10px_20px_-10px_rgba(0,0,0,0.55)]",
              flip ? "right-[12px]" : mode === "touch" ? "left-[18px]" : "left-[24px]",
            )}
            /* Білий текст на чистому кольорі ролі давав 3–4:1 — трохи глибший
               відтінок того самого кольору тримає 4.5:1. */
            style={{ background: accent ? `color-mix(in oklab, ${accent} 78%, #04121f)` : "var(--ink)" }}
          >
            {look && <IllustratedAvatar look={look} size={20} className="rounded-full ring-[1.5px] ring-white/50" />}
            {label}
          </span>
        )}
      </span>
    </div>
  );
}
