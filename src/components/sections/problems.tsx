"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Search,
  Send,
  Table2,
  NotebookPen,
  Check,
  EyeOff,
  Repeat,
  FolderOpen,
  UserX,
  Unplug,
  Users,
} from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import IllustratedAvatar, { AVATAR_LOOKS } from "@/components/shared/illustrated-avatar";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import s from "./problems.module.css";

type SceneText = ReturnType<typeof useT>["problems"]["scene"];

const CARD_ICONS = [UserX, EyeOff, Repeat, Unplug];
const SOURCE_ICONS = [Send, Table2, NotebookPen];
const P = AVATAR_LOOKS;

/* The stage fades out at the end of every --loop; when that fade-out ends the
   stage is re-mounted, so the one-shot animations inside start again from zero. */
function Scene({ className, children }: { className?: string; children: (cycle: number) => ReactNode }) {
  const [cycle, setCycle] = useState(0);
  return (
    <div className={cn(s.scene, className)} aria-hidden>
      <div
        key={cycle}
        className={s.stage}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && e.animationName.includes("stageOut")) setCycle((c) => c + 1);
        }}
      >
        {children(cycle)}
      </div>
    </div>
  );
}

function Chip({ look, name, className }: { look: (typeof P)[number]; name: string; className?: string }) {
  return (
    <span className={cn(s.chip, className)}>
      <span className={s.avatarRing}>
        <IllustratedAvatar look={look} size={18} />
      </span>
      {name}
    </span>
  );
}

function Source({ i, label }: { i: number; label: string }) {
  const Icon = SOURCE_ICONS[i];
  return (
    <span className={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <Icon className="w-3 h-3" strokeWidth={2.2} />
      {label}
    </span>
  );
}

/* 1 — contacts scattered across tools; one of them can't be found */
function LostPeople({ t }: { t: SceneText }) {
  return (
    <Scene>
      {() => (
        <>
          <div className={s.search}>
            <Search className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span className={cn(s.searchText, s.an)}>{t.search}</span>
            <span className={cn(s.caret, s.an)} />
          </div>
          <span className={cn(s.pill, s.pillPain, s.notFound, s.an)}>
            <UserX className="w-3.5 h-3.5" strokeWidth={2.2} />
            {t.notFound}
          </span>

          <div className={cn(s.cluster, s.clusterA)}>
            <Source i={0} label={t.sources[0]} />
            <Chip look={P[2]} name={t.people[1]} className={cn(s.float, s.an)} />
            <Chip look={P[3]} name={t.people[2]} className={cn(s.float, s.an)} />
          </div>
          <div className={cn(s.cluster, s.clusterB)}>
            <Source i={1} label={t.sources[1]} />
            <Chip look={P[4]} name={t.people[3]} className={cn(s.float, s.an)} />
          </div>
          <div className={cn(s.cluster, s.clusterC)}>
            <Source i={2} label={t.sources[2]} />
            <span className={cn(s.ghost, s.an)}>
              <Chip look={P[1]} name={t.people[0]} />
              <span className={cn(s.ghostMark, s.an)}>?</span>
            </span>
          </div>
        </>
      )}
    </Scene>
  );
}

/* 2 — attendance fills in week by week, until it doesn't */
function NoVisibility({ t }: { t: SceneText }) {
  const rows = [
    { look: P[1], name: t.people[0], gone: false },
    { look: P[2], name: t.people[1], gone: true },
    { look: P[5], name: t.people[2], gone: false },
    { look: P[0], name: t.people[3], gone: true },
  ];
  const cols = [s.c1, s.c2, s.c3, s.c4, s.c5];
  return (
    <Scene>
      {() => (
        <>
          <div className={cn(s.card, s.table)}>
            <div className={s.trow}>
              <span />
              <span />
              {t.weeks.map((w, i) => (
                <span key={i} className={s.thead}>
                  {w}
                </span>
              ))}
            </div>
            {rows.map((r) => (
              <div key={r.name} className={s.trow}>
                <span className={cn(s.avatarRing, r.gone && cn(s.dimRow, s.an))}>
                  <IllustratedAvatar look={r.look} size={18} />
                </span>
                <span className={cn(s.tname, r.gone && cn(s.dimRow, s.an))}>{r.name}</span>
                {cols.map((c, i) =>
                  r.gone && i >= 3 ? (
                    <span key={i} className={cn(s.miss, c, s.an)}>
                      ?
                    </span>
                  ) : (
                    <span key={i} className={cn(s.dot, c, s.an)}>
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
          <span className={cn(s.pill, s.pillPain, s.pastor, s.an)}>
            <EyeOff className="w-3.5 h-3.5" strokeWidth={2.2} />
            {t.pastor}
          </span>
        </>
      )}
    </Scene>
  );
}

/* 3 — the same three chores, every single week */
function LeaderOverload({ t }: { t: SceneText }) {
  const rowCls = [s.t1, s.t2, s.t3];
  const boxCls = [s.b1, s.b2, s.b3];
  const tickCls = [s.k1, s.k2, s.k3];
  return (
    <Scene>
      {(cycle) => (
        <>
          <div className={s.leader}>
            <IllustratedAvatar look={P[0]} size={46} />
            <span className={s.label}>{t.leader}</span>
            <span className={cn(s.week, s.an)}>
              {t.week} {cycle + 1}
            </span>
          </div>
          <div className={s.tasks}>
            {t.tasks.map((task, i) => (
              <div key={task} className={cn(s.task, rowCls[i], s.an)}>
                <span className={cn(s.box, boxCls[i], s.an)}>
                  <Check className={cn("w-2.5 h-2.5", s.tick, tickCls[i], s.an)} strokeWidth={3.5} />
                </span>
                {task}
              </div>
            ))}
          </div>
          <div className={cn(s.again, s.an)}>
            <span className={cn(s.pill, s.pillWarn)}>
              <Repeat className="w-3.5 h-3.5" strokeWidth={2.2} />
              {t.again}
            </span>
          </div>
        </>
      )}
    </Scene>
  );
}

/* 4 — the leader leaves and the whole base leaves with them */
function HandoverBreaks({ t }: { t: SceneText }) {
  return (
    <Scene>
      {() => (
        <>
          <div className={cn(s.crew, s.an)}>
            <div className={s.person}>
              <IllustratedAvatar look={P[3]} size={46} />
              <span className={s.label}>{t.leader}</span>
            </div>
            <div className={cn(s.card, s.base)}>
              <div className={s.baseHead}>
                <FolderOpen className="w-3.5 h-3.5 text-brand" strokeWidth={2.2} />
                {t.base}
                <span className={cn(s.count, s.countOk)}>{t.members}</span>
              </div>
              {[78, 62, 88].map((w, i) => (
                <div key={i} className={s.mrow}>
                  <span className={s.mdot} style={{ background: P[(i + 4) % P.length].shirt }} />
                  <span className={s.mbar} style={{ flex: "none", width: `${w}%` }} />
                </div>
              ))}
            </div>
          </div>

          <div className={cn(s.newcomer, s.an)}>
            <div className={s.person}>
              <IllustratedAvatar look={P[6]} size={46} />
              <span className={s.label}>{t.newLeader}</span>
            </div>
            <div className={cn(s.card, s.base)}>
              <div className={s.baseHead}>
                <FolderOpen className="w-3.5 h-3.5 text-ink-3" strokeWidth={2.2} />
                {t.base}
                <span className={cn(s.count, s.countPain)}>{t.empty}</span>
              </div>
              {[[s.g1, "30%"], [s.g2, "18%"], [s.g3, "24%"]].map(([g, w], i) => (
                <div key={i} className={s.mrow}>
                  <span className={cn(s.mdot, s.mdotEmpty)} />
                  <span className={cn(s.mbar, s.mbarEmpty)}>
                    <span className={cn(s.mfill, g, s.an)} style={{ "--w": w } as React.CSSProperties} />
                  </span>
                </div>
              ))}
            </div>
            <span className={cn(s.pill, s.pillWarn, s.restart, s.an)}>
              <Users className="w-3.5 h-3.5" strokeWidth={2.2} />
              {t.restart}
            </span>
          </div>
        </>
      )}
    </Scene>
  );
}

const SCENES = [LostPeople, NoVisibility, LeaderOverload, HandoverBreaks];

export default function Problems() {
  const t = useT().problems;
  const gridRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  /* scenes only play while the grid is on screen */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <div ref={gridRef} className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5", s.grid, on && s.on)}>
          {t.cards.map((card, i) => {
            const Icon = CARD_ICONS[i];
            const SceneView = SCENES[i];
            return (
              <FadeIn key={card.title} delay={i % 2 === 0 ? 0 : 1} variant="scale" className="h-full">
                <article
                  className={cn(
                    "hover-lift h-full rounded-[24px] bg-surface border border-hairline overflow-hidden flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
                    s.cardHover
                  )}
                >
                  <SceneView t={t.scene} />
                  <div className="p-6 md:p-7 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-surface-3 border border-hairline flex items-center justify-center text-ink-2">
                        <Icon className="w-4 h-4" strokeWidth={2.1} />
                      </span>
                      <span className="text-[12px] font-semibold tracking-[0.12em] text-ink-3 tabular-nums">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold text-ink text-[18px] md:text-[20px] leading-[1.3] tracking-[-0.3px]">
                      {card.title}
                    </h3>
                    <p className="text-[15.5px] font-normal text-ink-2 leading-[1.5]">{card.text}</p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
