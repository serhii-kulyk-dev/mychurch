"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/shared/fade-in";

/** Must match the hero's background-size, or the light drifts off the lines. */
const CELL = 56;

/** Which edge a swept cell swings open from. */
const HINGES = [
  { origin: "50% 0%", from: "rotateX(-92deg)" },
  { origin: "50% 100%", from: "rotateX(92deg)" },
  { origin: "0% 50%", from: "rotateY(92deg)" },
  { origin: "100% 50%", from: "rotateY(-92deg)" },
];

interface GridPulseProps {
  /** Centre of the readable area, as a share of the host box. */
  focus?: [number, number];
  className?: string;
}

/**
 * Faint life inside the hero grid: cells that light up for a breath, beams
 * that run along a line the way a pointer would, and the cell under the real
 * cursor lighting up as it glides. Everything is spawned imperatively — React
 * never re-renders for it — and the whole layer sleeps while the hero is
 * off-screen or the tab is hidden.
 */
export default function GridPulse({ focus = [0.5, 0.3], className }: GridPulseProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [fx, fy] = focus;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion()) return;
    if (typeof host.animate !== "function") return;

    /* Spawned light lives in its own layer, so putting the hero to sleep can
       wipe it without touching the two cursor followers. */
    const layer = document.createElement("div");
    layer.className = "absolute inset-0";
    const glow = document.createElement("div");
    glow.className = "grid-glow";
    const glowLines = document.createElement("div");
    glowLines.className = "grid-glow-lines";
    host.append(layer, glow, glowLines);

    /* Where the browser can intersect mask layers, the cursor light is cut to
       the cells themselves; elsewhere it stays a plain soft glow. */
    if (typeof CSS !== "undefined" && CSS.supports?.("mask-composite", "intersect")) {
      host.classList.add("grid-snap");
    }

    let w = 0;
    let h = 0;
    const measure = () => {
      w = host.clientWidth;
      h = host.clientHeight;
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(host);

    let cellTimer: number | undefined;
    let traceTimer: number | undefined;
    let traces = 0;
    let awake = false;

    const snap = (v: number) => Math.round(v / CELL) * CELL;
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    /* Side room left by the 860px copy column — the light lives out here, so it
       never reads as a stray mark next to a word. */
    const gutter = () => Math.max(112, (w - 900) / 2 + 64);

    /* A point inside the mask's ellipse, biased away from the dead centre so
       the light never sits behind the headline. */
    const spot = () => {
      const a = Math.random() * Math.PI * 2;
      const r = 0.34 + Math.sqrt(Math.random()) * 0.3;
      return [fx * w + Math.cos(a) * r * 0.72 * w, fy * h + Math.sin(a) * r * 0.62 * h];
    };

    const spawnCell = () => {
      if (!w || !h) return;
      const [px, py] = spot();
      const x = snap(px);
      const y = snap(py);
      if (x < 0 || y < 0 || x > w - CELL || y > h - CELL) return;
      // Nothing lights up directly behind the copy block.
      const g = gutter();
      if (x + CELL > g && x < w - g && y < 0.46 * h) return;

      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.style.left = `${x}px`;
      cell.style.top = `${y}px`;
      layer.appendChild(cell);

      const peak = rand(0.55, 1);
      const anim = cell.animate(
        [
          { opacity: 0 },
          { opacity: peak, offset: 0.22 },
          { opacity: peak * 0.8, offset: 0.6 },
          { opacity: 0 },
        ],
        { duration: rand(1700, 3400), easing: "ease-in-out" }
      );
      anim.onfinish = () => cell.remove();
    };

    /* Outer box is rotated so one horizontal keyframe covers all four
       directions; the beam only ever travels along its own +X. */
    const spawnTrace = () => {
      if (!w || !h) return;
      const len = rand(90, 260);
      const vertical = Math.random() < 0.45;
      const back = Math.random() < 0.5;
      const g = gutter();

      const outer = document.createElement("div");
      outer.className = "grid-trace";
      let travel: number;

      if (vertical) {
        const off = snap(rand(24, g));
        travel = h + len;
        outer.style.left = `${Math.random() < 0.5 ? off : w - off}px`;
        outer.style.top = back ? `${h + len}px` : `${-len}px`;
        outer.style.transform = `rotate(${back ? -90 : 90}deg)`;
      } else {
        /* A row can sit anywhere, because the beam runs in from its own edge
           and burns out inside the gutter. */
        travel = rand(0.5, 1) * g + len;
        outer.style.top = `${snap(rand(0.04, 0.62) * h)}px`;
        outer.style.left = back ? `${w + len}px` : `${-len}px`;
        outer.style.transform = `rotate(${back ? 180 : 0}deg)`;
      }

      const beam = document.createElement("div");
      beam.className = "grid-beam";
      beam.style.width = `${len}px`;
      // A bright head every so often; most beams stay a hint.
      beam.style.setProperty("--beam-head", Math.random() < 0.55 ? "1" : "0.35");
      outer.appendChild(beam);
      layer.appendChild(outer);
      traces += 1;

      const peak = rand(0.5, 1);
      const anim = beam.animate(
        [
          { transform: "translate3d(0,0,0)", opacity: 0 },
          { opacity: peak, offset: 0.16 },
          { opacity: peak, offset: 0.7 },
          { transform: `translate3d(${travel}px,0,0)`, opacity: 0 },
        ],
        {
          duration: rand(1600, 4200),
          easing: Math.random() < 0.5 ? "cubic-bezier(0.32,0,0.28,1)" : "linear",
        }
      );
      anim.onfinish = () => {
        outer.remove();
        traces -= 1;
      };
    };

    const loopCells = () => {
      spawnCell();
      cellTimer = window.setTimeout(loopCells, rand(520, 1400));
    };
    const loopTraces = () => {
      // A phone has no gutter to run a beam through — only the cells breathe.
      if (w >= 900 && traces < 3) {
        spawnTrace();
        // Now and then two set off together, so the rhythm never settles.
        if (Math.random() < 0.28) window.setTimeout(spawnTrace, rand(180, 700));
      }
      traceTimer = window.setTimeout(loopTraces, rand(1400, 4200));
    };

    /* ── The cursor ──────────────────────────────────────────────
       No snapping box — a soft light trails the pointer and the cells under it
       simply glow. The trail is eased frame by frame, so nothing ever jumps. */
    const fine = window.matchMedia("(pointer: fine)");
    const section = host.closest("section");
    let hx = 0;
    let hy = 0;
    let gx = 0;
    let gy = 0;
    let pointerIn = false;
    let followRaf: number | null = null;

    // Both cursor layers read the same point, so it lives on the host.
    const place = () => {
      host.style.setProperty("--mx", `${Math.round(gx)}px`);
      host.style.setProperty("--my", `${Math.round(gy)}px`);
    };

    const follow = () => {
      gx += (hx - gx) * 0.12;
      gy += (hy - gy) * 0.12;
      place();
      followRaf = pointerIn ? requestAnimationFrame(follow) : null;
    };

    /* Cells the cursor has just swept, so one pass does not flip the same tile
       over and over while the hand hovers in place. */
    const flipped = new Map<string, number>();
    let lastKey = "";

    /* The cell the hand is actually resting on stays lit until it moves off. */
    let held: HTMLDivElement | null = null;

    const release = (tile: HTMLDivElement | null) => {
      if (!tile) return;
      const out = tile.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 420,
        easing: "ease-out",
        fill: "forwards",
      });
      out.onfinish = () => tile.remove();
    };

    const hold = (col: number, row: number) => {
      const tile = document.createElement("div");
      tile.className = "grid-flip";
      tile.style.left = `${col * CELL}px`;
      tile.style.top = `${row * CELL}px`;
      const hinge = HINGES[Math.floor(Math.random() * HINGES.length)];
      tile.style.transformOrigin = hinge.origin;
      layer.appendChild(tile);
      tile.animate(
        [
          { transform: `perspective(620px) ${hinge.from}`, opacity: 0 },
          { transform: "perspective(620px) rotateX(0deg)", opacity: 1 },
        ],
        { duration: 340, easing: "cubic-bezier(0.2,0.75,0.3,1)", fill: "forwards" }
      );
      release(held);
      held = tile;
    };

    const flip = (col: number, row: number, delay: number) => {
      const key = `${col}:${row}`;
      const now = performance.now();
      const seen = flipped.get(key);
      if (seen && now - seen < 900) return;
      flipped.set(key, now);
      if (flipped.size > 120) {
        for (const [k, t] of flipped) if (now - t > 1200) flipped.delete(k);
      }

      const tile = document.createElement("div");
      tile.className = "grid-flip";
      tile.style.left = `${col * CELL}px`;
      tile.style.top = `${row * CELL}px`;

      /* Hinged on one of its own edges, so the cell unfolds into place instead
         of squashing through its middle. */
      const hinge = HINGES[Math.floor(Math.random() * HINGES.length)];
      tile.style.transformOrigin = hinge.origin;
      layer.appendChild(tile);

      const anim = tile.animate(
        [
          { transform: `perspective(620px) ${hinge.from}`, opacity: 0 },
          { transform: "perspective(620px) rotateX(0deg)", opacity: 1, offset: 0.42 },
          { transform: "perspective(620px) rotateX(0deg)", opacity: 0.95, offset: 0.62 },
          { transform: "perspective(620px) rotateX(0deg)", opacity: 0 },
        ],
        { duration: rand(820, 1150), delay, easing: "cubic-bezier(0.2,0.75,0.3,1)" }
      );
      anim.onfinish = () => tile.remove();
    };

    /* One sweep turns over the cell under the hand and, half the time, a
       neighbour or two a beat later — a small group, not a single square. */
    const sweep = (col: number, row: number) => {
      hold(col, row);
      if (Math.random() < 0.55) {
        const n = Math.random() < 0.35 ? 2 : 1;
        for (let i = 0; i < n; i += 1) {
          const dx = Math.round(rand(-1.4, 1.4));
          const dy = Math.round(rand(-1.4, 1.4));
          if (dx || dy) flip(col + dx, row + dy, rand(60, 180));
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      const rect = host.getBoundingClientRect();
      hx = e.clientX - rect.left;
      hy = e.clientY - rect.top;
      if (!pointerIn) {
        pointerIn = true;
        gx = hx;
        gy = hy;
        place();
        host.classList.add("grid-hot");
        followRaf = requestAnimationFrame(follow);
      }
      if (hx < 0 || hy < 0 || hx > w || hy > h) return;
      const key = `${Math.floor(hx / CELL)}:${Math.floor(hy / CELL)}`;
      if (key === lastKey) return;
      lastKey = key;
      sweep(Math.floor(hx / CELL), Math.floor(hy / CELL));
    };

    const onPointerLeave = () => {
      pointerIn = false;
      lastKey = "";
      release(held);
      held = null;
      host.classList.remove("grid-hot");
      if (followRaf !== null) {
        cancelAnimationFrame(followRaf);
        followRaf = null;
      }
    };

    if (section) {
      section.addEventListener("pointermove", onPointerMove, { passive: true });
      section.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    const start = () => {
      if (awake) return;
      awake = true;
      measure();
      cellTimer = window.setTimeout(loopCells, 900);
      traceTimer = window.setTimeout(loopTraces, 1600);
    };
    const stop = () => {
      awake = false;
      window.clearTimeout(cellTimer);
      window.clearTimeout(traceTimer);
      layer.replaceChildren();
      held = null;
      traces = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (host.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (section) {
        section.removeEventListener("pointermove", onPointerMove);
        section.removeEventListener("pointerleave", onPointerLeave);
      }
      onPointerLeave();
      stop();
      host.replaceChildren();
    };
  }, [fx, fy]);

  return <div ref={hostRef} aria-hidden className={className} />;
}
