"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

/** How long each phrase stays before the next one takes its place. */
const HOLD = 2600;

export interface OwnedThing {
  /** The possessive — highlighted, and gendered with the noun («Моя» / «Моє»). */
  own: string;
  noun: string;
}

interface Props {
  items: OwnedThing[];
  /** Applied to the possessive only — that is the word the block is about. */
  accentClassName?: string;
  className?: string;
}

/**
 * «Моя церква» → «Моя група» → «Моє служіння»: the noun keeps changing, the
 * possessive stays (and switches gender with it).
 *
 * Every phrase sits in the same grid cell, so the box is already as wide and
 * as tall as the longest one — the line never reflows mid-swap and nothing has
 * to be measured. Only the active phrase is exposed to screen readers.
 */
export default function MyPhrase({ items, accentClassName, className }: Props) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  /* Nothing swaps while the heading is off-screen or the tab is hidden. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || items.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setStarted(true);
      setIndex((i) => (i + 1) % items.length);
    }, HOLD);
    return () => clearInterval(id);
  }, [onScreen, items.length]);

  const prev = started ? (index + items.length - 1) % items.length : -1;

  return (
    <span ref={hostRef} className={cn("grid", className)}>
      {items.map((item, i) => {
        const state = i === index ? "in" : i === prev ? "out" : "idle";
        return (
          <span
            key={item.noun}
            aria-hidden={i !== index}
            className="col-start-1 row-start-1 whitespace-nowrap will-change-[opacity,transform]"
            style={{
              opacity: state === "in" ? 1 : 0,
              transform:
                state === "in"
                  ? "translateY(0)"
                  : state === "out"
                    ? "translateY(-0.3em)"
                    : "translateY(0.3em)",
              transition: started
                ? "opacity 0.5s ease, transform 0.55s cubic-bezier(0.16,0.84,0.44,1)"
                : "none",
            }}
          >
            <span className={accentClassName}>{item.own}</span> {item.noun}
          </span>
        );
      })}
    </span>
  );
}
