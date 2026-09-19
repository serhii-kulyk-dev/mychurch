"use client";

import { useEffect, useRef, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "up" | "scale" | "left" | "right";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** 0–10 = step of 80ms (0, 80, 160…). Anything larger is treated as raw ms. */
  delay?: number;
  variant?: RevealVariant;
  /** How much of the element must be visible before it animates. */
  threshold?: number;
  style?: CSSProperties;
}

const VARIANT_CLASS: Record<RevealVariant, string | false> = {
  up: false,
  scale: "reveal-scale",
  left: "reveal-left",
  right: "reveal-right",
};

const callbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function observe(el: Element, onVisible: () => void) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target);
            if (cb) {
              cb();
              callbacks.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
  }
  callbacks.set(el, onVisible);
  sharedObserver.observe(el);
}

function unobserve(el: Element) {
  callbacks.delete(el);
  sharedObserver?.unobserve(el);
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function FadeIn({
  children,
  className,
  delay = 0,
  variant = "up",
  style,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const delayMs = delay <= 10 ? delay * 80 : delay;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No motion preference — show instantly, never observe.
    if (prefersReducedMotion()) {
      el.style.opacity = "";
      el.classList.add("is-visible");
      return;
    }

    let rafId: number;

    observe(el, () => {
      // Promote the GPU layer one frame before the animation starts
      el.style.willChange = "opacity, transform";
      rafId = requestAnimationFrame(() => {
        // Clear the inline opacity guard — the CSS animation takes over here
        el.style.opacity = "";
        el.classList.add("is-visible");
        el.addEventListener(
          "animationend",
          () => {
            el.style.willChange = "auto";
          },
          { once: true }
        );
      });
    });

    return () => {
      unobserve(el);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    // opacity:0 inline = guaranteed invisible on first paint, even before CSS loads
    <div
      ref={ref}
      style={{ opacity: 0, animationDelay: delayMs ? `${delayMs}ms` : undefined, ...style }}
      className={cn("reveal", VARIANT_CLASS[variant], className)}
    >
      {children}
    </div>
  );
}
