"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { TgHeader, TgInline, TgMessage } from "@/components/shared/tg-screen";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useLang } from "@/lib/lang";

/* Дві однакові групи різними очима — і екран відмітки, де ім'я справді
   перемикає статус по колу, як у боті. */

export default function TelegramGroups() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].groups;
  const cycle = t.attendance.legend.map((l) => l.icon);

  const [marks, setMarks] = useState<string[]>(() => t.attendance.people.map((p) => p.icon));

  /* У списку видно шість імен із тринадцяти — решту вважаємо вже відміченими,
     щоб лічильник збігався з числом у копії й рухався від натискань. */
  const shownAtStart = t.attendance.people.filter((p) => p.icon === "✅").length;
  const startCount = Number(/(\d+)\//.exec(t.attendance.head[1].t)?.[1] ?? shownAtStart);
  const present = startCount - shownAtStart + marks.filter((m) => m === "✅").length;

  const bump = (i: number) =>
    setMarks((prev) => {
      const next = [...prev];
      const at = cycle.indexOf(next[i]);
      next[i] = cycle[(at + 1) % cycle.length];
      return next;
    });

  const headLines = t.attendance.head.map((line, i) =>
    i === 1 ? { ...line, t: line.t.replace(/\d+\/(\d+)/, `${present}/$1`) } : line
  );

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} align="left" />

        {/* Та сама група — два екрани */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
          {[
            { label: t.leaderLabel, data: t.leader, accent: "var(--brand)" },
            { label: t.memberLabel, data: t.member, accent: "var(--ink-3)" },
          ].map((side, i) => (
            <FadeIn key={side.label} delay={i * 2} variant="scale" className="min-w-0 flex flex-col gap-3">
              <span className="px-1 flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: side.accent }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: side.accent }} />
                {side.label}
              </span>
              <div
                className="rounded-[22px] border bg-surface overflow-hidden shadow-[0_26px_54px_-44px_rgba(0,50,120,0.5)]"
                style={{ borderColor: i === 0 ? "color-mix(in oklab, var(--brand) 32%, transparent)" : "var(--hairline)" }}
              >
                <TgHeader title={TELEGRAM_COPY[lang].hero.phone.bot} sub={side.label} />
                <div className="tg-wallpaper p-4 flex flex-col gap-2.5 min-h-[300px] justify-end">
                  <TgMessage lines={side.data.lines} />
                  <TgInline rows={side.data.buttons} className="pl-1 pr-5" dense />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Екран відмітки — інша розкладка: список ліворуч, коло статусів праворуч */}
        <FadeIn className="rounded-[24px] border border-hairline bg-surface-2/60 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,330px)]">
            <div className="p-5 md:p-7 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-hairline">
              <TgMessage lines={headLines} className="max-w-none self-stretch" />

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {t.attendance.people.map((p, i) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      onClick={() => bump(i)}
                      className="w-full h-11 rounded-[10px] border border-hairline-strong bg-surface hover:bg-surface-2 transition-colors flex items-center gap-2.5 px-3.5 text-left"
                    >
                      <span key={marks[i]} className="pin-in text-[15px] leading-none w-5 text-center">{marks[i]}</span>
                      <span className="text-[14px] text-ink leading-none truncate">{p.name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <TgInline rows={[[t.attendance.actions[0]], [t.attendance.actions[1], t.attendance.actions[2]]]} />
            </div>

            <div className="p-5 md:p-7 flex flex-col gap-5">
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.attendance.title}</span>
              <ol className="flex flex-col gap-1">
                {t.attendance.legend.map((l, i) => (
                  <li key={l.label} className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-surface border border-hairline flex items-center justify-center text-[14px] leading-none">
                      {l.icon}
                    </span>
                    <span className="text-[13.5px] text-ink-2 leading-none">{l.label}</span>
                    {i < t.attendance.legend.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-ink-3 ml-auto rotate-90" strokeWidth={2.4} />
                    )}
                  </li>
                ))}
              </ol>
              <p className="text-[13.5px] text-ink-3 leading-[1.5] pt-4 border-t border-hairline">{t.attendance.note}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
