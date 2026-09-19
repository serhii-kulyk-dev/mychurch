"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/components/shared/fade-in";

/** How long each word stays before the next one rolls in. */
const HOLD = 3000;

interface Props {
  /** Phrases to cycle through — the first one is what the page ships with. */
  words: string[];
  /** Shorter variants, used when `words` no longer fit the headline line. */
  shortWords?: string[];
  /** Break a phrase that no longer fits across two lines instead of falling
      back to `shortWords` — for phrases whose first word belongs to the
      sentence («простір для вашого клубу»), where dropping it reads wrong. */
  stack?: boolean;
  /** Applied to every phrase (the headline gradient). */
  className?: string;
  /** Optional colour per phrase, in the same order as `words`. A phrase that
      has one wears it instead of `className` — this is how the roles in the
      «Для кого» headlines each get their own colour. */
  colors?: (string | undefined)[];
  /** Start cycling only once the headline has finished its entrance. */
  active: boolean;
}

/**
 * A word that swaps itself out: the outgoing phrase rolls up and blurs away,
 * the incoming one rolls in from below, and the box width eases between the
 * two so the centred headline re-balances instead of jumping.
 *
 * Measured, not guessed: a hidden sizer gives the exact width of every phrase,
 * which is also how the component decides whether the long forms fit the line.
 */
/** Splits a phrase at its last space: ["вашого", "клубу"]. */
function splitPhrase(phrase: string) {
  const at = phrase.trim().lastIndexOf(" ");
  return at < 0 ? [phrase] : [phrase.slice(0, at), phrase.slice(at + 1)];
}

export default function RotatingWords({
  words,
  shortWords,
  stack,
  className,
  colors,
  active,
}: Props) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const sizerRef = useRef<HTMLSpanElement>(null);
  const [short, setShort] = useState(false);
  const [widths, setWidths] = useState<number[] | null>(null);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  /* Fallback metrics are far wider than the real face, so a fit measured before
     the web font lands would wrongly demote a headline that has room. */
  const [fontsReady, setFontsReady] = useState(
    () => typeof document !== "undefined" && document.fonts?.status === "loaded",
  );
  useEffect(() => {
    let alive = true;
    const mark = () => {
      if (alive) setFontsReady(true);
    };
    (document.fonts?.ready ?? Promise.resolve()).then(mark, mark);
    return () => {
      alive = false;
    };
  }, []);

  /* Stacking only makes sense while every phrase really has two parts. */
  const canStack = Boolean(stack) && words.every((w) => w.trim().includes(" "));
  const stacked = canStack && short;
  const list = stacked || !short || !shortWords ? words : shortWords;
  const prev = started ? (index + list.length - 1) % list.length : -1;
  /* Measured once for the whole set: every stacked phrase wears the same box,
     so the two lines stay put instead of easing sideways under each other. */
  const parts = canStack ? words.flatMap(splitPhrase) : [];

  /* Measure both variants, then keep the long one only while it fits the line.
     `reserve` is everything else on that line ("для ") — the difference between
     the line box and our own box, so it holds whatever the layout actually is. */
  useLayoutEffect(() => {
    const host = hostRef.current;
    const sizer = sizerRef.current;
    if (!host || !sizer) return;

    const measure = () => {
      const spans = Array.from(sizer.children) as HTMLElement[];
      /* offsetWidth, not a client rect: the headline's entrance rotates this
         subtree in 3D, and a rect would report the projected width. */
      const width = (el: HTMLElement) => el.offsetWidth;
      const full = spans.slice(0, words.length).map(width);
      const briefCount = shortWords?.length ?? 0;
      const brief = shortWords
        ? spans.slice(words.length, words.length + briefCount).map(width)
        : null;
      const partWidths = spans.slice(words.length + briefCount).map(width);
      if (!full.length) return;

      /* h2 as well: the same headline runs as a section heading on the home
         page («Для кого»). */
      const head = host.closest("h1, h2");
      const line = host.closest(".hero-line");
      /* The headline is a centred flex item, so it shrinks to its own text: the
         room it actually has is its parent's content box. */
      const box = (head?.parentElement ?? head) as HTMLElement | null;
      let fits = true;
      if (fontsReady && box && line && (brief || canStack)) {
        const cs = getComputedStyle(box);
        const avail =
          box.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
        const reserve = (Array.from(line.children) as HTMLElement[])
          .filter((el) => !el.contains(host))
          .reduce((sum, el) => sum + width(el), 0);
        fits = reserve + Math.max(...full) <= avail - 4;
      }
      const willStack = canStack && !fits;
      const next = willStack
        ? full.map(() => Math.max(...partWidths, 0))
        : fits || !brief
          ? full
          : brief;
      setShort(!fits);
      setWidths((prevWidths) =>
        prevWidths && prevWidths.length === next.length && prevWidths.every((v, i) => v === next[i])
          ? prevWidths
          : next,
      );
    };

    measure();

    /* Re-measure whenever the metrics move under us: the web font swapping in,
       a viewport change, a breakpoint switching the headline size. */
    const observer = new ResizeObserver(() => measure());
    observer.observe(sizer);
    const box = host.closest("h1, h2")?.parentElement;
    if (box) observer.observe(box);
    return () => observer.disconnect();
  }, [words, shortWords, canStack, fontsReady]);

  /* Nothing rotates while the headline is off-screen or the tab is in the
     background — there is no one to see it. */
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !onScreen || list.length < 2 || prefersReducedMotion()) return;
    const tick = () => {
      if (document.hidden) return;
      setStarted(true);
      setIndex((i) => (i + 1) % list.length);
    };
    const id = setInterval(tick, HOLD);
    return () => clearInterval(id);
  }, [active, onScreen, list]);

  return (
    <>
      <span
        ref={hostRef}
        aria-hidden
        className={`hero-rotator${stacked ? " is-stacked" : ""}`}
        style={widths ? { width: widths[index], transition: started ? undefined : "none" } : undefined}
      >
        {/* Keeps the line box (and so the height) once every phrase is absolute. */}
        <span className="hero-rotator-strut">
          {stacked ? (
            <>
              <span className="hero-rotator-line">{"\u200b"}</span>
              <span className="hero-rotator-line">{"\u200b"}</span>
            </>
          ) : (
            "\u200b"
          )}
        </span>
        {list.map((word, i) => {
          const tint = colors?.[i];
          return (
            <span
              key={word}
              className={`hero-rotator-word ${tint ? "is-tinted" : (className ?? "")}`}
              style={tint ? ({ "--role-accent": tint } as CSSProperties) : undefined}
              data-state={i === index ? (started ? "in" : "rest") : i === prev ? "out" : "idle"}
            >
              {stacked
                ? splitPhrase(word).map((piece, pi) => (
                    <span key={pi} className="hero-rotator-line">
                      {piece}
                    </span>
                  ))
                : word}
            </span>
          );
        })}
        {/* Hidden copies, used only to measure. */}
        <span ref={sizerRef} className="hero-rotator-sizer">
          {words.map((word) => (
            <span key={`w-${word}`}>{word}</span>
          ))}
          {shortWords?.map((word) => (
            <span key={`s-${word}`}>{word}</span>
          ))}
          {parts.map((piece, i) => (
            <span key={`p-${i}-${piece}`}>{piece}</span>
          ))}
        </span>
      </span>
      <span className="sr-only">{list[0]}</span>
    </>
  );
}
