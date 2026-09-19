"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Zap, Check, ArrowRight, Plus, Minus, Maximize2,
  ClipboardList, UserX, CalendarClock, Clock,
  Send, UserCheck, Tag, Phone, Bell, RefreshCw, FileBarChart, Users, ClipboardCheck, MessageCircle, GitFork, Hourglass,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import { hasModulePage } from "@/content/modules";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   An n8n-style canvas. Each recipe is a small graph — trigger,
   actions, a condition with yes/no branches, a wait, a fan-out or
   a merge — laid out on a fixed design grid and scaled to fit the
   card. When a workflow runs, columns light up left to right, a
   pulse travels every wire and a tick lands on each finished node.
   ──────────────────────────────────────────────────────────────── */

type Kind = "trigger" | "action" | "if" | "wait";
interface GNode { kind: Kind; col: number; row: number; Icon: LucideIcon }
interface GEdge { from: number; to: number; branch?: "yes" | "no" }
interface Graph { nodes: GNode[]; edges: GEdge[] }

/* Design grid (px, before scaling) */
const NODE_W = 138;
const NODE_H = 58;
const COL_PITCH = 166;
const ROW_PITCH = 72;
const PAD_X = 24;
const PAD_R = 62; /* room for the "+" stubs on open outputs */
const PAD_Y = 26;
const COLS = 4;
const ROWS = 3;
const CANVAS_W = PAD_X + PAD_R + (COLS - 1) * COL_PITCH + NODE_W;
const CANVAS_H = PAD_Y * 2 + (ROWS - 1) * ROW_PITCH + NODE_H;

const NODE_MS = 900;
const STEP_MS = 5600;

const KIND_ACCENT: Record<Kind, string> = {
  trigger: "#f59e0b",
  action: "var(--brand)",
  if: "#8b5bf0",
  wait: "#64748b",
};

const GRAPHS: Graph[] = [
  /* form → welcome → wants a group? → yes: leader task / no: pastor digest */
  {
    nodes: [
      { kind: "trigger", col: 0, row: 1, Icon: ClipboardList },
      { kind: "action", col: 1, row: 1, Icon: Send },
      { kind: "if", col: 2, row: 1, Icon: GitFork },
      { kind: "action", col: 3, row: 0, Icon: UserCheck },
      { kind: "action", col: 3, row: 2, Icon: FileBarChart },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3, branch: "yes" }, { from: 2, to: 4, branch: "no" }],
  },
  /* missed 3 → tag → fan-out: call reminder + warm message */
  {
    nodes: [
      { kind: "trigger", col: 0, row: 1, Icon: UserX },
      { kind: "action", col: 1, row: 1, Icon: Tag },
      { kind: "action", col: 2, row: 0, Icon: Phone },
      { kind: "action", col: 2, row: 2, Icon: MessageCircle },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }],
  },
  /* saturday → remind team → wait → nudge unconfirmed */
  {
    nodes: [
      { kind: "trigger", col: 0, row: 1, Icon: CalendarClock },
      { kind: "action", col: 1, row: 1, Icon: Bell },
      { kind: "wait", col: 2, row: 1, Icon: Hourglass },
      { kind: "action", col: 3, row: 1, Icon: RefreshCw },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }],
  },
  /* sunday → attendance + people → merge into digest */
  {
    nodes: [
      { kind: "trigger", col: 0, row: 1, Icon: Clock },
      { kind: "action", col: 1, row: 0, Icon: ClipboardCheck },
      { kind: "action", col: 1, row: 2, Icon: Users },
      { kind: "action", col: 2, row: 1, Icon: FileBarChart },
    ],
    edges: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 }],
  },
];

/* Centre a graph that uses fewer columns than the grid. */
function layout(g: Graph) {
  const cols = Math.max(...g.nodes.map((n) => n.col)) + 1;
  const offset = ((COLS - cols) * COL_PITCH) / 2;
  return g.nodes.map((n) => ({
    x: PAD_X + offset + n.col * COL_PITCH,
    y: PAD_Y + n.row * ROW_PITCH,
  }));
}

function wire(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.max(28, (x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export default function Automations() {
  const t = useT().automations;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % GRAPHS.length), STEP_MS);
    return () => clearInterval(id);
  }, [paused]);

  /* Fit the design grid to the card; never smaller than 0.66 (then it scrolls). */
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, Math.max(0.66, el.clientWidth / CANVAS_W)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const link = hasModulePage("automations") ? "/modules/automations" : "/modules";
  const graph = GRAPHS[active];
  const recipe = t.recipes[active];
  const pos = layout(graph);
  const lastCol = Math.max(...graph.nodes.map((n) => n.col));
  const hasOut = new Set(graph.edges.map((e) => e.from));
  const kindLabel: Record<Kind, string> = { trigger: t.triggerLabel, action: t.actionLabel, if: t.ifLabel, wait: t.waitLabel };

  return (
    <section id="automations" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
        {/* ── Copy ─────────────────────────────────────── */}
        <FadeIn className="flex flex-col gap-5">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[30px] md:text-[42px] leading-[1.12] tracking-[-1px] md:tracking-[-1.5px]">{t.title}</h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55]">{t.text}</p>
          <ul className="flex flex-col gap-3 pt-1">
            {t.points.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center shrink-0">
                  <Check className="w-[13px] h-[13px] text-brand" strokeWidth={3} />
                </span>
                <span className="text-[15.5px] text-ink leading-[1.4]">{p}</span>
              </li>
            ))}
          </ul>
          <Link href={link} className="group inline-flex items-center gap-1.5 pt-1 text-[14.5px] font-semibold text-brand">
            {t.link}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
        </FadeIn>

        {/* ── Canvas ───────────────────────────────────── */}
        <FadeIn delay={2} variant="scale" className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[40px] -z-10 blur-3xl opacity-60"
            style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
          />
          <div
            className="rounded-[24px] border border-hairline bg-surface shadow-[0_30px_60px_-40px_rgba(0,50,120,0.4)] overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Workflow tabs */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-hairline bg-surface-2 overflow-x-auto no-scrollbar">
              {t.recipes.map((r, i) => (
                <button
                  key={r.name}
                  onClick={() => setActive(i)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium leading-none border transition-colors",
                    active === i
                      ? "bg-surface border-hairline-strong text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                      : "border-transparent text-ink-3 hover:text-ink-2"
                  )}
                >
                  <Zap className="w-3 h-3" strokeWidth={2.4} style={{ color: active === i ? KIND_ACCENT.trigger : undefined }} fill={active === i ? KIND_ACCENT.trigger : "none"} />
                  {r.name}
                </button>
              ))}
            </div>

            {/* Graph */}
            <div ref={frameRef} className="chat-wallpaper relative overflow-x-auto no-scrollbar">
              <div style={{ width: CANVAS_W * scale, height: CANVAS_H * scale, margin: "0 auto" }}>
                <div
                  key={active}
                  className="relative"
                  style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})`, transformOrigin: "0 0" }}
                >
                  {/* Wires */}
                  <svg aria-hidden className="absolute inset-0 overflow-visible" width={CANVAS_W} height={CANVAS_H}>
                    {graph.edges.map((e, i) => {
                      const a = pos[e.from], b = pos[e.to];
                      const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2, x2 = b.x, y2 = b.y + NODE_H / 2;
                      const d = wire(x1, y1, x2, y2);
                      const col = graph.nodes[e.from].col;
                      const begin = `${(col * NODE_MS + 420) / 1000}s`;
                      const lx = (x1 + x2) / 2, ly = (y1 + y2) / 2;
                      return (
                        <g key={i}>
                          <path d={d} fill="none" stroke="var(--hairline-strong)" strokeWidth="2" />
                          <path d={d} fill="none" stroke="var(--brand)" strokeWidth="2" className="flow-wire-on" style={{ animationDelay: begin }} pathLength={1} />
                          <circle r="4" fill="var(--brand)" opacity="0" className="flow-pulse-dot">
                            <animateMotion dur="0.55s" begin={begin} fill="freeze" path={d} />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="0.55s" begin={begin} fill="freeze" />
                          </circle>
                          {e.branch && (
                            <g transform={`translate(${lx} ${ly})`}>
                              <rect x="-15" y="-9" width="30" height="18" rx="9" fill="var(--surface)" stroke="var(--hairline-strong)" />
                              <text textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight="600" fill={e.branch === "yes" ? "#12a150" : "var(--ink-3)"} style={{ fontFamily: "inherit" }}>
                                {e.branch === "yes" ? t.yes : t.no}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                    {/* Open outputs: n8n's "+" stub */}
                    {graph.nodes.map((n, i) =>
                      hasOut.has(i) ? null : (
                        <g key={`plus-${i}`} transform={`translate(${pos[i].x + NODE_W} ${pos[i].y + NODE_H / 2})`}>
                          <line x1="0" y1="0" x2="18" y2="0" stroke="var(--hairline-strong)" strokeWidth="2" strokeDasharray="3 3" />
                          <circle cx="27" cy="0" r="8" fill="var(--surface)" stroke="var(--hairline-strong)" strokeWidth="1.5" />
                          <path d="M27 -3.5 V3.5 M23.5 0 H30.5" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" />
                        </g>
                      )
                    )}
                  </svg>

                  {/* Nodes */}
                  {graph.nodes.map((n, i) => {
                    const accent = KIND_ACCENT[n.kind];
                    const delay = n.col * NODE_MS;
                    const NIcon = n.Icon;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flow-node is-on absolute flex items-center gap-2.5 border bg-surface pl-2.5 pr-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
                          n.kind === "trigger" ? "rounded-l-[30px] rounded-r-2xl" : "rounded-2xl",
                          n.kind === "if" && "rounded-2xl"
                        )}
                        style={{ left: pos[i].x, top: pos[i].y, width: NODE_W, height: NODE_H, ["--accent" as string]: accent, animationDelay: `${delay}ms` }}
                      >
                        {n.kind !== "trigger" && <span aria-hidden className="flow-port absolute -left-[5px] top-1/2 -translate-y-1/2" />}
                        {n.kind === "if" ? (
                          <>
                            <span aria-hidden className="flow-port absolute -right-[5px] top-[30%] -translate-y-1/2" />
                            <span aria-hidden className="flow-port absolute -right-[5px] top-[70%] -translate-y-1/2" />
                          </>
                        ) : (
                          <span aria-hidden className="flow-port absolute -right-[5px] top-1/2 -translate-y-1/2" />
                        )}
                        <span
                          className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
                          style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
                        >
                          <NIcon className="w-4 h-4" strokeWidth={2.2} />
                        </span>
                        <span className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none">{kindLabel[n.kind]}</span>
                          <span className="text-[12.5px] font-medium text-ink leading-[1.25]">{recipe.nodes[i]}</span>
                        </span>
                        <span
                          className="flow-tick is-on absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#12a150] text-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
                          style={{ animationDelay: `${delay + 620}ms` }}
                        >
                          <Check className="w-3 h-3" strokeWidth={3.5} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Phone: the canvas scrolls sideways — hint at it with a soft edge */}
              {scale * CANVAS_W > 400 && (
                <div aria-hidden className="md:hidden pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-surface-2 to-transparent" />
              )}

              {/* Zoom controls, decorative like n8n's */}
              <div aria-hidden className="absolute left-3 bottom-3 flex flex-col rounded-lg border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
                {[Plus, Minus, Maximize2].map((I, k) => (
                  <span key={k} className={cn("w-7 h-7 flex items-center justify-center text-ink-3", k > 0 && "border-t border-hairline")}>
                    <I className="w-3.5 h-3.5" strokeWidth={2} />
                  </span>
                ))}
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-hairline bg-surface-2 text-[12px] text-ink-3">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="relative inline-flex w-7 h-4 rounded-full bg-[#12a150]">
                  <span className="absolute right-[2px] top-[2px] w-3 h-3 rounded-full bg-white" />
                </span>
                {t.activeLabel}
              </span>
              <span key={`s-${active}`} className="flow-status inline-flex items-center gap-1.5" style={{ animationDelay: `${(lastCol + 1) * NODE_MS}ms` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#12a150]" />
                <span className="font-medium text-[#0e7a3c]">{t.doneLabel}</span>
              </span>
              <span className="ml-auto tabular-nums">{active + 1} / {GRAPHS.length}</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
