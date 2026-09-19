"use client";

import { useState } from "react";
import { Check, Lock } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { TgHeader, TgInput, TgKeyboard, TgMessage } from "@/components/shared/tg-screen";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

const ACCENTS = ["#12a150", "#007aff", "#8b5bf0", "#f07b5b"];

export default function TelegramMenus() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].menus;
  const [active, setActive] = useState(0);
  /* Відмову показуємо лише після натискання «чужої» кнопки — як у боті. */
  const [denied, setDenied] = useState(false);

  const role = t.roles[active];
  const accent = ACCENTS[active % ACCENTS.length];

  const pick = (i: number) => {
    setActive(i);
    setDenied(false);
  };

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_minmax(0,330px)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          {/* Ролі — вертикальним списком, не вкладками-таблетками */}
          <FadeIn className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0">
            {t.roles.map((r, i) => {
              const on = i === active;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={on}
                  className={cn(
                    "shrink-0 lg:shrink text-left rounded-[16px] border px-4 py-3.5 transition-all duration-200 min-w-[220px] lg:min-w-0",
                    on ? "bg-surface shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]" : "bg-surface/50 border-hairline hover:bg-surface"
                  )}
                  style={on ? { borderColor: `color-mix(in oklab, ${ACCENTS[i % ACCENTS.length]} 55%, transparent)` } : undefined}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 transition-opacity duration-200"
                      style={{ background: ACCENTS[i % ACCENTS.length], opacity: on ? 1 : 0.3 }}
                    />
                    <span className={cn("text-[15.5px] font-semibold leading-none", on ? "text-ink" : "text-ink-2")}>{r.tab}</span>
                  </span>
                  <span className="block mt-2 pl-[18px] text-[13px] text-ink-3 leading-[1.4]">{r.who}</span>
                </button>
              );
            })}
          </FadeIn>

          {/* Телефон із реальною клавіатурою цієї людини */}
          <FadeIn variant="scale" className="min-w-0 flex flex-col gap-3">
            <span className="px-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.keyboardLabel}</span>
            <div className="rounded-[24px] border border-hairline bg-surface overflow-hidden shadow-[0_30px_60px_-45px_rgba(0,50,120,0.5)]">
              <TgHeader title={TELEGRAM_COPY[lang].hero.phone.bot} sub={role.who} />
              <div key={role.id} className="view-in">
                <div className="tg-wallpaper px-4 py-4 flex flex-col justify-end min-h-[86px]">
                  <TgMessage lines={[{ t: lang === "ua" ? "📋 Меню оновлено" : "📋 Menu updated" }]} />
                </div>
                <TgInput placeholder="…" />
                <TgKeyboard rows={role.keyboard} />
              </div>
            </div>
          </FadeIn>

          {/* Що відкривається + що не відкриється */}
          <FadeIn delay={2} className="min-w-0 flex flex-col gap-5">
            <div key={role.id} className="view-in flex flex-col gap-3">
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.seesLabel}</span>
              <ul className="flex flex-col gap-2.5">
                {role.sees.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
                    >
                      <Check className="w-3 h-3" strokeWidth={3.2} />
                    </span>
                    <span className="text-[14.5px] text-ink-2 leading-[1.45]">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {role.denied && (
              <div key={`${role.id}-denied`} className="view-in flex flex-col gap-3 pt-5 border-t border-hairline">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.deniedLabel}</span>
                <button
                  type="button"
                  onClick={() => setDenied((d) => !d)}
                  className={cn(
                    "self-start h-10 px-4 rounded-[10px] border text-[13.5px] font-medium leading-none transition-colors",
                    denied ? "bg-surface-2 border-hairline text-ink-3" : "bg-surface border-hairline-strong text-ink hover:bg-surface-2"
                  )}
                >
                  {role.denied.button}
                </button>
                {denied && (
                  <div className="bubble-in flex items-start gap-3 rounded-[16px] border border-hairline bg-[#0b0b0f]/90 dark:bg-surface-2 px-4 py-3.5 max-w-[420px]">
                    <Lock className="w-4 h-4 text-white/70 dark:text-ink-3 shrink-0 mt-0.5" strokeWidth={2.2} />
                    <p className="text-[13.5px] text-white dark:text-ink-2 leading-[1.5] whitespace-pre-line">
                      {role.denied.text.replace(/^🔒\s*/, "")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </FadeIn>
        </div>

        <FadeIn className="rounded-[18px] border border-hairline bg-surface px-5 py-4 md:px-6 md:py-5 max-w-[760px]">
          <p className="text-[14.5px] text-ink-2 leading-[1.55]">{t.note}</p>
        </FadeIn>
      </div>
    </section>
  );
}
