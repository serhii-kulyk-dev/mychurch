"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/components/shared/fade-in";

/** Tweens the shown value to `target` (easeOutCubic) once `run` turns true.
    First run counts up from 0; later target changes tween from the current value. */
export function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      const skip = setTimeout(() => {
        current.current = target;
        setValue(target);
      }, 0);
      return () => clearTimeout(skip);
    }
    const from = current.current;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const v = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      current.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);

  return value;
}
