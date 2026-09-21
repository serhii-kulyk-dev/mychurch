"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, MessageSquare } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import PersonAvatar, { lookFor } from "@/components/shared/person-avatar";
import { hasModulePage } from "@/content/modules/ids";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Малі групи — назва модуля великими і одна зустріч, розібрана на
   чотири речі, заради яких модуль і існує:

     подія        — тиждень: хто, де і коли збирається;
     відвідуваність — галочки лягають по людині, один лишається сірим;
     тема         — що саме проходили цього четверга;
     відгуки      — що люди написали ввечері після зустрічі.

   Тому слів над картинкою немає: заголовок — це назва модуля, а
   решту розповідає сам екран.
   ──────────────────────────────────────────────────────────────── */

const TEAL = "#0d9488";
const TICK_MS = 170;
/* Відгуки приходять уже після того, як лідер відмітив явку. */
const FEEDBACK_GAP_MS = 320;

function tint(pct: number) {
  return `color-mix(in oklab, ${TEAL} ${pct}%, var(--surface))`;
}

/* `onModulePage` — демо стоїть на власній сторінці модуля «Малі групи»:
   назву й посилання «на себе» там уже дає шапка сторінки. */
export default function HomeGroups({ onModulePage = false }: { onModulePage?: boolean }) {
  const t = useT().homeGroups;
  const open = t.open;
  const hostRef = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState(0);
  const [notes, setNotes] = useState(0);

  /* Учасники з номером у черзі на галочку: той, кого немає, її не отримає. */
  let seen = 0;
  const roster = open.members.map((name) => {
    const missing = name === open.missing;
    return { name, missing, order: missing ? -1 : seen++ };
  });
  const presentCount = seen;
  const noteCount = open.feedback.length;

  /* Явка відмічається, коли блок доходить до екрана — по людині за раз,
     а слідом, з паузою, лягають відгуки. */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setTicks(presentCount);
      setNotes(noteCount);
      return;
    }
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        for (let i = 1; i <= presentCount; i++) {
          timers.push(window.setTimeout(() => setTicks(i), TICK_MS * i));
        }
        const after = TICK_MS * presentCount + FEEDBACK_GAP_MS;
        for (let i = 1; i <= noteCount; i++) {
          timers.push(window.setTimeout(() => setNotes(i), after + FEEDBACK_GAP_MS * i));
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [presentCount, noteCount]);

  const link = hasModulePage("groups") ? "/modules/groups" : "/modules";

  return (
    <section id="home-groups" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-12 md:gap-16">
        {/* Заголовок — назва модуля, поставлена так велико, як читається. */}
        {!onModulePage && (
          <FadeIn className="flex flex-col items-center text-center gap-5">
            <h2 className="font-semibold text-ink text-[46px] sm:text-[66px] md:text-[88px] leading-[1.0] tracking-[-2px] md:tracking-[-3.6px]">
              {t.title}
            </h2>
            <Link href={link} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand">
              {t.link}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
            </Link>
          </FadeIn>
        )}

        <FadeIn variant="scale">
          <div ref={hostRef} className="flex flex-col gap-3 md:gap-4">
            {/* ── Подія: тиждень громади ───────────────────────── */}
            <div className="rounded-[20px] border border-hairline bg-page overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-2">
                <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TEAL }} />
                <span className="text-[12.5px] font-semibold text-ink-2 leading-none">{t.weekTitle}</span>
              </div>

              {/* Сім колонок на широкому екрані, рядки по днях — на вузькому. */}
              <div className="hidden sm:grid grid-cols-7 gap-1.5 p-3">
                {t.days.map((day, d) => {
                  const inDay = t.groups.filter((g) => g.day === d);
                  return (
                    <div key={day} className="flex flex-col gap-1.5 min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3 text-center leading-none py-1">
                        {day}
                      </span>
                      {inDay.length === 0 && (
                        <span aria-hidden className="min-h-[54px] rounded-xl border border-dashed border-hairline" />
                      )}
                      {inDay.map((g) => {
                        const on = g.name === open.name;
                        return (
                          <span
                            key={g.name}
                            className={cn(
                              "min-h-[54px] rounded-xl px-2.5 py-1.5 flex flex-col justify-center gap-1 min-w-0",
                              on ? "" : "bg-surface border border-hairline"
                            )}
                            style={on ? { background: tint(14), boxShadow: `inset 0 0 0 1.5px ${TEAL}` } : undefined}
                          >
                            <span className="text-[12.5px] font-semibold text-ink leading-[1.2] truncate">{g.name}</span>
                            <span className="text-[11px] text-ink-3 leading-none tabular-nums">{g.time}</span>
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div className="sm:hidden flex flex-col divide-y divide-hairline">
                {t.days.map((day, d) => {
                  const inDay = t.groups.filter((g) => g.day === d);
                  if (inDay.length === 0) return null;
                  return (
                    <div key={day} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="w-8 shrink-0 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none">
                        {day}
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {inDay.map((g) => {
                          const on = g.name === open.name;
                          return (
                            <span
                              key={g.name}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5",
                                on ? "" : "bg-surface border border-hairline"
                              )}
                              style={on ? { background: tint(14), boxShadow: `inset 0 0 0 1.5px ${TEAL}` } : undefined}
                            >
                              <span className="text-[12.5px] font-semibold text-ink leading-none">{g.name}</span>
                              <span className="text-[11.5px] text-ink-3 leading-none tabular-nums">{g.time}</span>
                            </span>
                          );
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 items-stretch">
              {/* ── Тема і відвідуваність однієї зустрічі ───────── */}
              <div className="rounded-[20px] border border-hairline bg-page overflow-hidden flex flex-col">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline bg-surface-2">
                  <PersonAvatar look={lookFor(open.leader)} size={36} className="w-9 h-9" />
                  <span className="flex flex-col min-w-0">
                    <span className="text-[14.5px] font-semibold text-ink leading-tight truncate">{open.name}</span>
                    <span className="text-[12px] text-ink-3 leading-tight truncate">
                      {open.when} · {open.leader}
                    </span>
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-3.5 flex-1">
                  {/* Тема зустрічі — те, заради чого люди й прийшли. */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface-2 px-3 py-2.5">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: tint(16), color: TEAL }}
                    >
                      <BookOpen className="w-[15px] h-[15px]" strokeWidth={2.2} />
                    </span>
                    <span className="flex flex-col min-w-0 gap-1">
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3 leading-none">
                        {open.topicLabel}
                      </span>
                      <span className="text-[14px] font-medium text-ink leading-none truncate">{open.topic}</span>
                    </span>
                  </div>

                  {/* Лічильник іде тільки по присутніх: галочки лягають підряд. */}
                  <div className="mock-on flex flex-wrap gap-1.5 sm:gap-2">
                    {roster.map(({ name, missing, order }) => {
                      const ticked = !missing && order < ticks;
                      return (
                        <span key={name} className="relative shrink-0">
                          <PersonAvatar
                            look={lookFor(name)}
                            size={44}
                            className={cn("w-9 h-9 sm:w-11 sm:h-11 transition-all duration-300", missing && "grayscale opacity-45")}
                          />
                          {ticked && (
                            <span
                              className="mock-pop absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-white border-2 border-page"
                              style={{ background: TEAL }}
                            >
                              <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-hairline-strong px-3 py-2">
                    <PersonAvatar look={lookFor(open.missing)} size={22} className="w-[22px] h-[22px] grayscale opacity-60" />
                    <span className="text-[12.5px] text-ink-2 leading-none truncate">{open.missing}</span>
                    <span className="ml-auto shrink-0 rounded-full bg-[#ff9500]/14 px-2 py-1 text-[11.5px] font-medium leading-none text-[#c46a00] dark:text-[#ffb454]">
                      {open.missingNote}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 px-4 py-3 border-t border-hairline bg-surface-2">
                  <span className="text-[12.5px] text-ink-3 leading-none">
                    {open.rateLabel} · {open.countLabel}
                  </span>
                  <span className="text-[18px] font-semibold leading-none tabular-nums" style={{ color: TEAL }}>
                    {open.rate}
                  </span>
                </div>
              </div>

              {/* ── Відгуки: що написали ввечері після зустрічі ── */}
              <div className="rounded-[20px] border border-hairline bg-page overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-surface-2">
                  <MessageSquare className="w-4 h-4 shrink-0" strokeWidth={2.2} style={{ color: TEAL }} />
                  <span className="text-[12.5px] font-semibold text-ink-2 leading-none">{open.feedbackTitle}</span>
                  <span className="ml-auto text-[11.5px] text-ink-3 leading-none truncate">{open.feedbackCount}</span>
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  {open.feedback.map((f, i) => (
                    <div
                      key={f.who}
                      className={cn("flex items-start gap-2.5", i < notes ? "bubble-in" : "opacity-0")}
                    >
                      <PersonAvatar look={lookFor(f.who)} size={28} className="w-7 h-7 mt-0.5" />
                      <span className="flex flex-col min-w-0 gap-1">
                        <span className="flex items-baseline gap-2 min-w-0">
                          <span className="text-[12.5px] font-semibold text-ink leading-none truncate">{f.who}</span>
                          <span className="text-[11px] text-ink-3 leading-none tabular-nums shrink-0">{f.when}</span>
                        </span>
                        <span className="rounded-xl rounded-tl-sm bg-surface-2 border border-hairline px-3 py-2 text-[13px] text-ink-2 leading-[1.45]">
                          {f.text}
                        </span>
                        {f.tag && (
                          <span
                            className="self-start rounded-full px-2 py-1 text-[11px] font-medium leading-none"
                            style={{ background: tint(14), color: TEAL }}
                          >
                            {f.tag}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
