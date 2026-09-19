"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { LayoutGrid, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import IllustratedAvatar, { AVATAR_LOOKS } from "@/components/shared/illustrated-avatar";
import { MODULE_ICONS, GROUP_ICONS, GROUP_ACCENTS, moduleAccent } from "@/components/shared/module-icons";
import { hasModulePage } from "@/content/modules";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   "How it all fits together": one person's profile in the middle,
   module groups in two flanking columns. Every group is wired to the
   exact row it owns inside the profile, with an orthogonal connector
   measured from the real DOM — so you can see which module writes
   which line of a person's record.
   ──────────────────────────────────────────────────────────────── */

type NodeId = "tools" | "activities" | "clubs" | "hr" | "planning" | "resources" | "channels" | "insight";

interface NodeDef {
  id: NodeId;
  /** Module groups this node stands for; icon and accent come from the first. */
  groups: string[];
  side: "left" | "right";
  /** "in" = the module writes this row, "out" = it reads it. */
  dir: "in" | "out";
  Icon?: LucideIcon;
}

/* Column order top-to-bottom; `ROWS` keeps the same order per side, so no
   connector ever crosses another. */
const NODES: NodeDef[] = [
  { id: "tools", groups: ["tools"], side: "left", dir: "in" },
  { id: "activities", groups: ["activities"], side: "left", dir: "in" },
  { id: "clubs", groups: ["clubs"], side: "left", dir: "in" },
  { id: "hr", groups: ["hr"], side: "left", dir: "in" },
  { id: "planning", groups: ["planning"], side: "right", dir: "in" },
  { id: "resources", groups: ["resources"], side: "right", dir: "in" },
  { id: "channels", groups: ["integrations"], side: "right", dir: "out" },
  { id: "insight", groups: ["analytics", "ai"], side: "right", dir: "out", Icon: Sparkles },
];

/** Row order inside the profile card. Each side stays monotonic. */
const ROWS: NodeId[] = ["tools", "activities", "clubs", "planning", "hr", "resources", "channels", "insight"];

const LEFT = NODES.filter((n) => n.side === "left");
const RIGHT = NODES.filter((n) => n.side === "right");

const STORY: (NodeId | "platform")[] = [...ROWS, "platform"];

const PLATFORM_MODULES = ["customization", "templates", "telegram-bot", "campuses"];

const STEP_MS = 3200;

/* prefers-reduced-motion as a store: false on the server, live on the client. */
const RM_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReduced = () => window.matchMedia(RM_QUERY).matches;
const getReducedServer = () => false;

function findModule(t: Dict, id: string) {
  for (const group of t.modules.groups) {
    const item = group.items.find((i) => i.id === id);
    if (item) return { group, item };
  }
  return null;
}

function nodeOfModule(t: Dict, id: string): NodeId | "profile" | "platform" | null {
  const found = findModule(t, id);
  if (!found) return null;
  const gid = found.group.id;
  if (gid === "people") return "profile";
  if (gid === "platform" || gid === "campuses") return "platform";
  return NODES.find((n) => n.groups.includes(gid))?.id ?? null;
}

/** Every module of a node, in dictionary order. */
function nodeModules(t: Dict, def: NodeDef) {
  return def.groups.flatMap((g) => t.modules.groups.find((x) => x.id === g)?.items ?? []);
}

/* ── Geometry ───────────────────────────────────────────────────── */
interface Pt { x: number; y: number }

const GAP = 6;
const R = 8; // corner radius of the elbow
/** Ideal distance between two neighbouring vertical lanes. */
const LANE_STEP = 13;

/** Horizontal → vertical → horizontal connector, turning at `lane`, arrow at `to`. */
function elbow(from: Pt, to: Pt, lane: number) {
  const dir = to.x > from.x ? 1 : -1;
  const end = { x: to.x - dir * GAP, y: to.y };
  let d: string;
  if (Math.abs(to.y - from.y) < 2) {
    d = `M ${from.x} ${from.y} L ${end.x} ${end.y}`;
  } else {
    const midX = Math.min(Math.max(lane, Math.min(from.x, end.x)), Math.max(from.x, end.x));
    const vy = end.y > from.y ? 1 : -1;
    const r = Math.min(R, Math.abs(end.y - from.y) / 2, Math.abs(midX - from.x), Math.abs(end.x - midX));
    d = [
      `M ${from.x} ${from.y}`,
      `L ${midX - dir * r} ${from.y}`,
      `Q ${midX} ${from.y} ${midX} ${from.y + vy * r}`,
      `L ${midX} ${end.y - vy * r}`,
      `Q ${midX} ${end.y} ${midX + dir * r} ${end.y}`,
      `L ${end.x} ${end.y}`,
    ].join(" ");
  }
  const sz = 6.5;
  const tip = { x: end.x + dir * 2.5, y: end.y };
  const head = `M ${tip.x} ${tip.y} L ${end.x - dir * sz} ${end.y - sz * 0.72} L ${end.x - dir * sz} ${end.y + sz * 0.72} Z`;
  return { d, head };
}

interface Wire { id: NodeId; card: Pt; row: Pt; dir: "in" | "out" }

/* Every connector of a side turns on its own vertical lane inside the gap
   between the column and the card, so no two wires ever run down the same
   line. The longer the drop, the closer to the card its turn — with rows and
   cards in the same order that also keeps the fan free of crossings. */
function lanesOf(wires: Wire[], hubEdge: number, colEdge: number) {
  const dir = colEdge >= hubEdge ? 1 : -1;
  const span = Math.max(0, Math.abs(colEdge - hubEdge) - GAP);
  const bent = wires
    .filter((w) => Math.abs(w.row.y - w.card.y) >= 2)
    .sort((a, b) => Math.abs(b.row.y - b.card.y) - Math.abs(a.row.y - a.card.y));
  const step = Math.min(LANE_STEP, span / (bent.length + 1));
  const lanes: Partial<Record<NodeId, number>> = {};
  bent.forEach((w, i) => { lanes[w.id] = hubEdge + dir * step * (i + 1); });
  return lanes;
}

/* ── Group card ─────────────────────────────────────────────────── */
function GroupCard({
  t, def, on, dim, onHover, refCb,
}: {
  t: Dict; def: NodeDef; on: boolean; dim: boolean;
  onHover: (id: NodeId | null) => void; refCb: (el: HTMLDivElement | null) => void;
}) {
  const accent = GROUP_ACCENTS[def.groups[0]] ?? "#007aff";
  const Icon = def.Icon ?? GROUP_ICONS[def.groups[0]] ?? LayoutGrid;
  const mods = nodeModules(t, def);
  return (
    <div
      ref={refCb}
      onMouseEnter={() => onHover(def.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "rounded-[16px] bg-surface border px-3 py-2.5 flex flex-col gap-2 transition-[box-shadow,border-color,opacity] duration-300",
        dim ? "opacity-55" : "opacity-100"
      )}
      style={{
        borderColor: on ? `color-mix(in oklab, ${accent} 55%, var(--hairline-strong))` : "var(--hairline)",
        boxShadow: on
          ? `0 0 0 4px color-mix(in oklab, ${accent} 12%, transparent), 0 12px 26px -18px color-mix(in oklab, ${accent} 70%, transparent)`
          : "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <Link href={`/modules#m-${def.groups[0]}`} className="flex items-center gap-2 group/head">
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300"
          style={{ background: on ? accent : `color-mix(in oklab, ${accent} 13%, var(--surface))`, color: on ? "#fff" : accent }}
        >
          <Icon className="w-[15px] h-[15px]" strokeWidth={2.2} />
        </span>
        <span className="font-semibold text-ink text-[13.5px] leading-none tracking-[-0.2px] truncate group-hover/head:text-brand transition-colors">
          {t.modulesMap.nodes[def.id]}
        </span>
        <span className="ml-auto text-[11.5px] text-ink-3 tabular-nums shrink-0">{mods.length}</span>
      </Link>

      <div className="flex flex-wrap gap-1">
        {mods.map((m) => {
          const cls = "rounded-md border border-hairline bg-surface-2 px-1.5 py-[3px] text-[11.5px] leading-none text-ink-2 whitespace-nowrap transition-colors";
          return hasModulePage(m.id) ? (
            <Link key={m.id} href={`/modules/${m.id}`} className={cn(cls, "hover:text-ink hover:border-hairline-strong")}>
              {m.name}
            </Link>
          ) : (
            <span key={m.id} className={cls}>{m.name}</span>
          );
        })}
      </div>
    </div>
  );
}

/* ── Map ────────────────────────────────────────────────────────── */
export default function ModulesMap({ focusModule, bare }: { focusModule?: string; bare?: boolean }) {
  const t = useT();
  const copy = t.modulesMap;
  const uid = useId().replace(/:/g, "");

  const focusNode = focusModule ? nodeOfModule(t, focusModule) : null;
  const story: (NodeId | "platform")[] = focusNode && focusNode !== "profile" ? [focusNode] : STORY;

  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<NodeId | null>(null);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedServer);

  const boxRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<Partial<Record<NodeId, HTMLDivElement | null>>>({});
  const rowEls = useRef<Partial<Record<NodeId, HTMLDivElement | null>>>({});
  const [geo, setGeo] = useState<{ w: number; h: number; wires: Partial<Record<NodeId, { d: string; head: string }>> } | null>(null);

  /* Measure card + its row → one connector each. Re-runs on any size change. */
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const base = box.getBoundingClientRect();
        const hubEl = hubRef.current;
        if (!hubEl || base.width === 0) return;
        const hub = hubEl.getBoundingClientRect();
        const wires: Partial<Record<NodeId, { d: string; head: string }>> = {};
        const pts: (Wire & { side: "left" | "right" })[] = [];
        for (const def of NODES) {
          const cardEl = cardEls.current[def.id];
          const rowEl = rowEls.current[def.id];
          if (!cardEl || !rowEl) continue;
          const c = cardEl.getBoundingClientRect();
          const r = rowEl.getBoundingClientRect();
          const left = def.side === "left";
          pts.push({
            id: def.id,
            dir: def.dir,
            side: def.side,
            card: { x: (left ? c.right : c.left) - base.left, y: c.top + c.height / 2 - base.top },
            row: { x: (left ? hub.left : hub.right) - base.left, y: r.top + r.height / 2 - base.top },
          });
        }
        for (const side of ["left", "right"] as const) {
          const group = pts.filter((p) => p.side === side);
          if (!group.length) continue;
          const hubEdge = group[0].row.x;
          const colEdge = side === "left"
            ? Math.max(...group.map((p) => p.card.x))
            : Math.min(...group.map((p) => p.card.x));
          const lanes = lanesOf(group, hubEdge, colEdge);
          for (const p of group) {
            const lane = lanes[p.id] ?? (hubEdge + colEdge) / 2;
            wires[p.id] = p.dir === "in" ? elbow(p.card, p.row, lane) : elbow(p.row, p.card, lane);
          }
        }
        setGeo({ w: base.width, h: base.height, wires });
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    if (hubRef.current) ro.observe(hubRef.current);
    for (const el of Object.values(cardEls.current)) if (el) ro.observe(el);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, [t]);

  /* Only animate while on screen. */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setInView(en.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = hover !== null || !inView || reduced || story.length <= 1;
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setStep((s) => (s + 1) % story.length), STEP_MS);
    return () => clearInterval(id);
  }, [paused, story.length]);

  const active: NodeId | "platform" = hover ?? story[step % story.length];

  const column = (defs: NodeDef[]) => (
    <div className="flex flex-col gap-2.5 md:justify-between">
      {defs.map((def) => (
        <GroupCard
          key={def.id}
          t={t}
          def={def}
          on={active === def.id || focusNode === def.id}
          dim={hover !== null && hover !== def.id}
          onHover={setHover}
          refCb={(el) => { cardEls.current[def.id] = el; }}
        />
      ))}
    </div>
  );

  return (
    <section className={cn("w-full flex flex-col items-center", bare ? "" : "py-16 md:py-24")}>
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-6 md:gap-8">
        {bare ? null : (
          <FadeIn className="flex flex-col items-center gap-3 text-center">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{copy.eyebrow}</span>
            <h2 className="font-semibold text-ink text-[26px] md:text-[34px] leading-[1.15] tracking-[-0.9px] max-w-[680px]">
              {focusModule ? copy.focusTitle.replace("{name}", findModule(t, focusModule)?.item.name ?? "") : copy.title}
            </h2>
          </FadeIn>
        )}

        <FadeIn className="flex flex-col gap-5">
          <div
            ref={boxRef}
            className="relative flex flex-col gap-2.5 md:grid md:items-stretch md:gap-x-9 lg:gap-x-12 md:grid-cols-[minmax(0,1fr)_338px_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_360px_minmax(0,1fr)]"
          >
            {geo && (
              <svg
                aria-hidden
                className="hidden md:block absolute inset-0 pointer-events-none"
                width={geo.w}
                height={geo.h}
                viewBox={`0 0 ${geo.w} ${geo.h}`}
              >
                {NODES.map((def) => {
                  const w = geo.wires[def.id];
                  if (!w) return null;
                  const on = active === def.id;
                  const c = GROUP_ACCENTS[def.groups[0]] ?? "#007aff";
                  const pid = `${uid}-${def.id}`;
                  return (
                    <g key={def.id} style={{ transition: "opacity 0.3s", opacity: on ? 1 : 0.62 }}>
                      <path
                        id={pid}
                        d={w.d}
                        fill="none"
                        stroke={on ? c : `color-mix(in oklab, ${c} 34%, var(--hairline-strong))`}
                        strokeWidth={on ? 2 : 1.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                      />
                      <path
                        d={w.head}
                        fill={on ? c : `color-mix(in oklab, ${c} 34%, var(--hairline-strong))`}
                        style={{ transition: "fill 0.3s" }}
                      />
                      {on && !reduced && (
                        <>
                          <circle r="4.5" fill={c} opacity="0.25">
                            <animateMotion dur="1.5s" repeatCount="indefinite" begin="0.12s"><mpath href={`#${pid}`} /></animateMotion>
                          </circle>
                          <circle r="2.75" fill={c}>
                            <animateMotion dur="1.5s" repeatCount="indefinite"><mpath href={`#${pid}`} /></animateMotion>
                          </circle>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Left column */}
            <div className="relative z-10 order-2 md:order-1">{column(LEFT)}</div>

            {/* Hub: the person's record */}
            <div
              ref={hubRef}
              className="relative z-10 order-1 md:order-2 md:self-center rounded-[20px] bg-surface border border-hairline shadow-[0_18px_46px_-28px_rgba(0,0,0,0.38)] overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline bg-surface-2">
                <IllustratedAvatar look={AVATAR_LOOKS[1]} size={40} className="rounded-full shrink-0" />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-semibold text-ink text-[15px] leading-none tracking-[-0.2px]">{copy.profile.name}</span>
                  <span className="text-[12px] text-ink-2 leading-none truncate">{copy.profile.status}</span>
                </div>
                <span className="ml-auto rounded-full bg-brand-soft text-brand px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] leading-none shrink-0">
                  {copy.profile.badge}
                </span>
              </div>

              <div className="flex flex-col p-1.5">
                {ROWS.map((id) => {
                  const def = NODES.find((n) => n.id === id)!;
                  const row = copy.rows[id];
                  const accent = GROUP_ACCENTS[def.groups[0]] ?? "#007aff";
                  const Icon = def.Icon ?? GROUP_ICONS[def.groups[0]] ?? LayoutGrid;
                  const on = active === id || focusNode === id;
                  return (
                    <div
                      key={id}
                      ref={(el) => { rowEls.current[id] = el; }}
                      className="flex items-center gap-2 rounded-lg px-1.5 py-[7px] transition-colors duration-300"
                      style={on ? { background: `color-mix(in oklab, ${accent} 10%, var(--surface))` } : undefined}
                    >
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors duration-300"
                        style={{ background: on ? accent : `color-mix(in oklab, ${accent} 12%, var(--surface))`, color: on ? "#fff" : accent }}
                      >
                        <Icon className="w-[11px] h-[11px]" strokeWidth={2.4} />
                      </span>
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.05em] text-ink-3 w-[62px] shrink-0 truncate">{row.label}</span>
                      <span className={cn("text-[12.5px] leading-[1.3] truncate transition-colors duration-300", on ? "text-ink font-medium" : "text-ink-2")}>
                        {row.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div className="relative z-10 order-3">{column(RIGHT)}</div>
          </div>

          {/* Platform: the layer under everything */}
          <div
            className="rounded-[16px] border border-dashed px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2.5 transition-colors duration-300"
            style={{
              borderColor: active === "platform" ? "color-mix(in oklab, #64748b 55%, var(--hairline-strong))" : "var(--hairline-strong)",
              background: active === "platform" ? "var(--surface-2)" : "transparent",
            }}
          >
            <span className="flex items-center gap-2 shrink-0">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface-3 text-ink-2">
                <LayoutGrid className="w-[15px] h-[15px]" strokeWidth={2.2} />
              </span>
              <span className="font-semibold text-ink text-[13.5px] tracking-[-0.2px]">{copy.nodes.platform}</span>
            </span>
            <div className="flex flex-wrap gap-1 sm:ml-auto">
              {PLATFORM_MODULES.map((id) => {
                const found = findModule(t, id);
                if (!found) return null;
                const Icon = MODULE_ICONS[id] ?? LayoutGrid;
                const c = moduleAccent(id, found.group.id);
                const href = hasModulePage(id) ? `/modules/${id}` : `/modules#m-${found.group.id}`;
                return (
                  <Link
                    key={id}
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-1.5 py-[3px] text-[11.5px] font-medium text-ink-2 leading-none hover:text-ink hover:border-hairline-strong transition-colors"
                  >
                    <Icon className="w-3 h-3" strokeWidth={2.2} style={{ color: c }} />
                    {found.item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Caption */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5" aria-live="polite">
            {story.length > 1 && (
              <div className="flex items-center gap-1.5 shrink-0">
                {story.map((id, i) => {
                  const on = !hover && i === step % story.length;
                  return (
                    <button
                      key={id}
                      aria-label={copy.nodeHints[id]}
                      onClick={() => { setStep(i); setHover(null); }}
                      className="h-5 flex items-center px-0.5 group"
                    >
                      <span className={cn("block h-1.5 rounded-full transition-all duration-300", on ? "w-6 bg-brand" : "w-1.5 bg-hairline-strong group-hover:bg-ink-3")} />
                    </button>
                  );
                })}
              </div>
            )}
            <p key={active} className="text-[15px] text-ink-2 leading-[1.45]" style={{ animation: "revealUp 0.4s var(--ease-out-soft) both" }}>
              {copy.nodeHints[active]}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
