"use client";

import { useState } from "react";
import { Check, Circle } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { TgHeader, TgMessage } from "@/components/shared/tg-screen";
import type { TgButton } from "@/content/telegram";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Служіння: питання служителю, його графік і те, що бачить лідер.
   Відповідь не відкриває новий екран — міняється те саме повідомлення. */

type View = "ask" | "reasons" | "tasks";
type Answer = "none" | "yes" | "no";

const STATE_TONE = {
  yes: { dot: "#12a150", bg: "color-mix(in oklab, #12a150 12%, var(--surface))" },
  no: { dot: "#f05b8b", bg: "color-mix(in oklab, #f05b8b 12%, var(--surface))" },
  ask: { dot: "var(--ink-3)", bg: "var(--surface-2)" },
} as const;

export default function TelegramServing() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].serving;
  const [view, setView] = useState<View>("ask");
  const [answer, setAnswer] = useState<Answer>("none");
  /* Причина відмови дописується в той самий рядок, як у боті. */
  const [reason, setReason] = useState<string | null>(null);

  const base = t.slot.lines.slice(0, -1);
  const tail =
    answer === "yes"
      ? { s: "d" as const, t: `✅ ${t.rotaStates.yes}` }
      : answer === "no"
        ? {
            s: "d" as const,
            t: reason
              ? `❌ ${t.rotaStates.no} — ${reason.replace(/^\S+\s/, "").toLowerCase()}`
              : `❌ ${t.rotaStates.no}`,
          }
        : t.slot.lines[t.slot.lines.length - 1];

  const noButton = t.slot.buttons[0][1];
  const tasksButton = t.slot.buttons[1][0];
  const backLabel = lang === "ua" ? "◀️ Назад" : "◀️ Back";
  const swapLabel = lang === "ua" ? "🔄 Запропонувати заміну" : "🔄 Suggest a swap";

  /* Кнопки під повідомленням — рівно ті, що бот показує в цьому стані. */
  const buttons: TgButton[][] =
    view === "reasons"
      ? [t.slot.reasons.slice(0, 2).map((r) => ({ t: r })), t.slot.reasons.slice(2).map((r) => ({ t: r }))]
      : view === "tasks"
        ? [[{ t: backLabel }]]
        : answer === "yes"
          ? [[tasksButton], [noButton]]
          : answer === "no"
            ? [[{ t: lang === "ua" ? "✅ Все ж буду" : "✅ Actually, I'm in", tone: "green" as const }], [{ t: swapLabel }]]
            : t.slot.buttons;

  const onTap = (label: string) => {
    if (label === noButton.t) {
      setView("reasons");
    } else if (label === tasksButton.t) {
      setView("tasks");
    } else if (t.slot.reasons.includes(label)) {
      setAnswer("no");
      setReason(label);
      setView("ask");
    } else if (label === backLabel || label === swapLabel) {
      setView("ask");
    } else {
      setAnswer("yes");
      setReason(null);
      setView("ask");
    }
  };

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
          {/* Питання служителю — усе в одному повідомленні */}
          <FadeIn variant="scale" className="min-w-0 flex flex-col gap-3">
            <span className="px-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.slotLabel}</span>
            <div className="rounded-[22px] border border-hairline bg-surface overflow-hidden shadow-[0_26px_54px_-44px_rgba(0,50,120,0.5)]">
              <TgHeader title={TELEGRAM_COPY[lang].hero.phone.bot} sub={t.eyebrow} />
              <div className="tg-wallpaper p-4 flex flex-col gap-2.5 min-h-[300px] justify-end">
                <TgMessage lines={[...base, tail]}>
                  {view === "tasks" && (
                    <ul className="mt-2 flex flex-col gap-2 pt-2.5 border-t border-hairline">
                      {t.slot.tasks.map((task) => (
                        <li key={task.t} className="flex items-start gap-2.5">
                          {task.done ? (
                            <span className="w-[18px] h-[18px] rounded-md bg-[#12a150] flex items-center justify-center shrink-0 mt-[1px]">
                              <Check className="w-3 h-3 text-white" strokeWidth={3.2} />
                            </span>
                          ) : (
                            <Circle className="w-[18px] h-[18px] text-ink-3 shrink-0 mt-[1px]" strokeWidth={1.8} />
                          )}
                          <span className={cn("text-[13.5px] leading-[1.4]", task.done ? "text-ink-3 line-through" : "text-ink-2")}>
                            {task.t}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TgMessage>
                <div key={`${view}-${answer}-${reason ?? ""}`} className="view-in pl-1 pr-5" onClickCapture={(e) => {
                  const label = (e.target as HTMLElement).closest("[data-tg]")?.getAttribute("data-tg");
                  if (label) onTap(label);
                }}>
                  <div className="flex flex-col gap-1.5">
                    {buttons.map((row, r) => (
                      <div key={r} className="flex gap-1.5">
                        {row.map((b) => (
                          <button
                            key={b.t}
                            type="button"
                            data-tg={b.t}
                            className={cn(
                              "flex-1 min-w-0 h-9 rounded-[10px] border flex items-center justify-center text-center px-2.5 text-[12.5px] font-medium leading-[1.2] truncate transition-colors",
                              b.tone === "green" && "bg-[#12a150]/12 border-[#12a150]/35 text-[#0f8a45] dark:text-[#3ddc97] font-semibold",
                              b.tone === "red" && "bg-[#f05b8b]/12 border-[#f05b8b]/35 text-[#d1376b] dark:text-[#ff8fb4] font-semibold",
                              !b.tone && "bg-surface border-hairline-strong text-ink-2 hover:bg-surface-2"
                            )}
                          >
                            {b.t}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="min-w-0 flex flex-col gap-8">
            {/* Мій графік — рядками, як список у боті */}
            <FadeIn delay={2} className="flex flex-col gap-3">
              <span className="px-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.rotaLabel}</span>
              <ul className="rounded-[20px] border border-hairline bg-surface divide-y divide-[color:var(--hairline)] overflow-hidden">
                {t.rota.map((row) => {
                  const tone = STATE_TONE[row.state];
                  return (
                    <li key={`${row.when}-${row.what}`} className="flex items-center gap-3 px-4 py-3.5">
                      <span className="w-[86px] shrink-0 text-[13px] font-semibold text-ink tabular-nums leading-none">{row.when}</span>
                      <span className="flex-1 min-w-0 flex flex-col gap-1">
                        <span className="text-[14px] text-ink leading-none truncate">{row.what}</span>
                        <span className="text-[12.5px] text-ink-3 leading-none">{row.role}</span>
                      </span>
                      <span
                        className="shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11.5px] font-semibold leading-none"
                        style={{ background: tone.bg, color: row.state === "ask" ? "var(--ink-3)" : tone.dot }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: tone.dot }} />
                        {t.rotaStates[row.state]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </FadeIn>

            {/* Лідеру — лише те, що не закрито */}
            <FadeIn delay={3} className="flex flex-col gap-3">
              <span className="px-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.digestLabel}</span>
              <div className="rounded-[20px] border border-[#ff9500]/35 bg-[#ff9500]/[0.07] p-5 flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  {t.digest.lines.map((line, i) => (
                    <span
                      key={i}
                      className={cn(
                        "text-[14.5px] leading-[1.4]",
                        line.s === "b" ? "font-semibold text-ink text-[15.5px]" : "text-ink-2"
                      )}
                    >
                      {line.t}
                    </span>
                  ))}
                </div>
                <p className="text-[13px] text-ink-3 leading-[1.5] pt-3 border-t border-[#ff9500]/25">{t.digest.note}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
