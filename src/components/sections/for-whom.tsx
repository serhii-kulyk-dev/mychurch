"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import AnimatedHeadline, { countWords, softIn, useHeadlineStage } from "@/components/shared/animated-headline";
import RoleScreen from "@/components/shared/role-screen";
import CursorDemo from "@/components/shared/cursor-demo";
import { ROLE_ICONS, ROLE_ACCENTS, ROLE_ROTATE_ACCENTS } from "@/components/shared/role-icons";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { moduleHrefByName } from "@/content/modules";
import { cn } from "@/lib/utils";
import { centerInRail } from "@/lib/scroll";

const CYCLE_MS = 5000;
/* With the ghost pointer on, a role needs room to play itself out. */
const DEMO_CYCLE_MS = 9000;

/* Home-page tour of the roles: a list of who works in the church on the
   left, that role's screen and what it gets on the right. It walks through
   the roles on its own until the visitor picks one — nothing is remembered,
   nothing else on the site changes. */
export default function ForWhom({ demo = false }: { demo?: boolean } = {}) {
  const all = useT();
  const t = all.audience;
  const hostRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const headStage = useHeadlineStage(countWords(t.titleLines, undefined, t.titleRotate), headRef);
  const [auto, setAuto] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  const active = picked ?? auto;
  const touched = picked !== null;
  const cycle = demo ? DEMO_CYCLE_MS : CYCLE_MS;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || touched || prefersReducedMotion()) return;
    const id = setInterval(() => setAuto((i) => (i + 1) % t.roles.length), cycle);
    return () => clearInterval(id);
  }, [inView, touched, t.roles.length, cycle]);

  /* On small screens the list is a horizontal strip — keep the active role in
     view. Only the strip moves: scrollIntoView would take the page with it. */
  useEffect(() => {
    centerInRail(listRef.current, active, !prefersReducedMotion());
  }, [active]);

  const role = t.roles[active];
  const accent = ROLE_ACCENTS[role.id];
  const ActiveIcon = ROLE_ICONS[role.id];

  return (
    <section id="for-whom" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        {/* Заголовок розділу набирається по словах і далі перебирає ролі —
            той самий такт, що й у хедері /for-whom, але стартує, коли розділ
            доходить до екрана. */}
        <div ref={headRef} className="flex flex-col gap-4 items-center text-center">
          <span
            className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand"
            style={softIn(headStage >= 1, 8)}
          >
            {t.eyebrow}
          </span>
          <AnimatedHeadline
            as="h2"
            lines={t.titleLines}
            rotate={t.titleRotate}
            rotateShort={t.titleRotateShort}
            colors={ROLE_ROTATE_ACCENTS}
            stage={headStage}
            className="font-semibold text-ink text-[30px] md:text-[44px] leading-[1.12] tracking-[-1px] md:tracking-[-1.6px] max-w-[760px]"
          />
          <p
            className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55] max-w-[620px] mx-auto"
            style={softIn(headStage >= 2)}
          >
            {t.text}
          </p>
        </div>

        <FadeIn variant="scale">
          <div
            ref={hostRef}
            className="rounded-[24px] md:rounded-[32px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]"
          >
            {/* Roles: a vertical list on desktop, a scrollable strip on mobile */}
            <div className="lg:border-r border-b lg:border-b-0 border-hairline bg-surface-2/60">
              <div
                ref={listRef}
                role="tablist"
                aria-label={t.switcherHint}
                aria-orientation="vertical"
                className="flex lg:flex-col gap-1 p-2 lg:p-3 overflow-x-auto lg:overflow-visible snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {t.roles.map((r, i) => {
                  const Icon = ROLE_ICONS[r.id];
                  const a = ROLE_ACCENTS[r.id];
                  const on = i === active;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setPicked(i)}
                      className={cn(
                        "relative shrink-0 snap-center flex items-center gap-3 rounded-2xl text-left transition-colors duration-200 overflow-hidden",
                        "pl-2 pr-4 py-2 lg:pl-2.5 lg:pr-3 lg:py-2.5",
                        on ? "bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-hairline" : "border border-transparent text-ink-2 hover:bg-surface/70 hover:text-ink"
                      )}
                    >
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200"
                        style={{ background: on ? a : `color-mix(in oklab, ${a} 14%, var(--surface))`, color: on ? "#fff" : a }}
                      >
                        <Icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                      </span>
                      <span className="flex flex-col min-w-0">
                        <span className={cn("text-[14.5px] font-semibold leading-[1.2] whitespace-nowrap", on ? "text-ink" : "text-inherit")}>{r.name}</span>
                        <span className="hidden lg:block text-[12.5px] text-ink-3 leading-[1.35] truncate max-w-[190px]">{r.tagline}</span>
                      </span>
                      {on && !touched && (
                        <span aria-hidden className="absolute left-0 right-0 bottom-0 h-[2px] overflow-hidden">
                          <span className="block h-full origin-left" style={{ background: a, opacity: 0.6, animation: `barGrowX ${cycle}ms linear both` }} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The active role: its screen and what it gets */}
            <div
              className="relative p-5 md:p-8 lg:p-10 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,300px)] gap-8 xl:gap-10 items-center"
              style={{ background: `radial-gradient(ellipse 70% 80% at 30% 50%, color-mix(in oklab, ${accent} 10%, transparent), transparent 70%)` }}
            >
              <div className="flex justify-center">
                {demo ? (
                  <CursorDemo playKey={role.id} active={!touched} startDelay={1400} className="w-full flex justify-center">
                    <RoleScreen key={role.id} role={role} />
                  </CursorDemo>
                ) : (
                  <RoleScreen key={role.id} role={role} />
                )}
              </div>

              <div key={`${role.id}-copy`} className="reveal is-visible flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: accent }}>
                    <ActiveIcon className="w-5 h-5" strokeWidth={2.2} />
                  </span>
                  <h3 className="font-semibold text-ink text-[22px] md:text-[24px] leading-[1.15] tracking-[-0.5px]">{role.name}</h3>
                </div>
                <p className="text-[15px] text-ink-2 leading-[1.55]">{role.hero.subtitle}</p>
                <ul className="flex flex-col gap-2">
                  {role.hero.proof.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-ink leading-[1.4]">
                      <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {role.modules.slice(0, 4).map((m) => (
                    <Link key={m} href={moduleHrefByName(all.modules.groups, m)} className="rounded-full bg-surface border border-hairline px-3 py-1 text-[12.5px] font-medium text-ink-2 hover:text-ink hover:border-hairline-strong transition-colors">
                      {m}
                    </Link>
                  ))}
                </div>
                <Link href={`/for-whom/${role.id}`} className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold" style={{ color: accent }}>
                  {t.more}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="flex justify-center -mt-4 md:-mt-6">
          <Link href="/for-whom" className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ink-2 hover:text-ink transition-colors">
            {t.allRoles}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
