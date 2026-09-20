"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Zap } from "lucide-react";
import CursorDemo from "@/components/shared/cursor-demo";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import { AVATAR_LOOKS } from "@/components/shared/person-avatar";
import { TgDevice } from "@/components/shared/tg-phone";
import { TgHeader, TgInline, TgInput, TgMessage } from "@/components/shared/tg-screen";
import { hasModulePage } from "@/content/modules/ids";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Раніше тут стояв статичний макет: повідомлення вже лежало в чаті,
   і нічого не відбувалося. Тепер сценарій грає сам, як у житті:
   подія спалахує ліворуч → бот друкує → повідомлення приходить →
   у системі відмічаються дві дії, яких людина не бачить → палець
   тисне кнопку → відповідь іде назад → бот підтверджує. Далі
   наступна ситуація. Telegram справжній — шапка, бульбашки й
   inline-кнопки ті самі, що на /telegram.
   ──────────────────────────────────────────────────────────────── */

const AMBER = "#f59e0b";

/* Крок сценарію: 0 порожній чат, 1 бот друкує, 2 повідомлення,
   3 людина відповіла, 4 бот підтвердив. */
const TYPING_MS = 500;
const MESSAGE_MS = 1500;
const ACK_MS = 900;
const NEXT_MS = 2600;
const TAP_DELAY = 900;

/* Обличчя того, чий це телефон — для таблички біля курсора. */
const FACES = [4, 5, 2, 3];

export default function Automations() {
  const t = useT().automations;
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const paused = useRef(false);
  const timers = useRef<number[]>([]);

  const r = t.recipes[active];
  const count = t.recipes.length;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /* Перехід на іншу ситуацію завжди починає чат спочатку. */
  const go = (i: number) => {
    setStep(0);
    setActive(i);
  };

  /* Нова ситуація — далі все грає само. */
  useEffect(() => {
    clear();
    if (prefersReducedMotion()) {
      later(10, () => setStep(4));
      later(9000, () => setActive((a) => (a + 1) % count));
      return clear;
    }
    later(TYPING_MS, () => setStep(1));
    later(MESSAGE_MS, () => setStep(2));
    return clear;
  }, [active, count]);

  useEffect(() => () => clear(), []);

  /* Палець натиснув кнопку — відповідь, підтвердження, наступна ситуація. */
  const onTap = () => {
    setStep(3);
    later(ACK_MS, () => setStep(4));
    later(ACK_MS + NEXT_MS, () => {
      if (!paused.current) go((active + 1) % count);
    });
  };

  const pick = (i: number) => {
    if (i !== active) go(i);
  };

  const link = hasModulePage("automations") ? "/modules/automations" : "/modules";
  const reply = r.buttons[0].t;
  /* Довгі підписи не влазять у два стовпці — тоді Telegram ставить їх у стовпчик. */
  const rows = r.buttons.reduce((n, b) => n + b.t.length, 0) > 28 ? r.buttons.map((b) => [b]) : [r.buttons];

  return (
    <section
      id="automations"
      className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24 overflow-hidden"
      style={{
        background:
          "radial-gradient(900px 440px at 8% 0%, rgba(0,105,224,0.42), transparent 70%), " +
          "radial-gradient(760px 420px at 92% 104%, rgba(245,158,11,0.20), transparent 70%), " +
          "linear-gradient(165deg, #0a1020 0%, #070b14 100%)",
      }}
    >
      <div
        className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-10 lg:gap-16 items-center"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocusCapture={() => (paused.current = true)}
        onBlurCapture={() => (paused.current = false)}
      >
        {/* ── Подія і те, що сталося в системі ────────── */}
        <FadeIn className="flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: AMBER }}>
              {t.eyebrow}
            </span>
            <h2 className="font-semibold text-white text-[34px] md:text-[50px] leading-[1.06] tracking-[-1.4px] md:tracking-[-1.8px]">
              {t.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible">
            {t.recipes.map((x, i) => (
              <button
                key={x.name}
                onClick={() => pick(i)}
                aria-pressed={active === i}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2.5 text-[13.5px] font-medium leading-none border transition-colors",
                  active === i
                    ? "bg-white/[0.14] border-white/25 text-white"
                    : "border-white/10 text-white/50 hover:text-white/85"
                )}
              >
                {x.name}
              </button>
            ))}
          </div>

          <span key={`t-${active}`} className="zap-hit flex items-start gap-3 rounded-2xl self-start border border-white/12 bg-white/[0.06] px-4 py-3.5">
            <Zap className="w-[18px] h-[18px] shrink-0 mt-0.5" strokeWidth={2.4} style={{ color: AMBER }} fill={AMBER} />
            <span className="flex flex-col gap-1">
              <span className="text-[12px] uppercase tracking-[0.12em] text-white/40 leading-none tabular-nums">{r.at}</span>
              <span className="text-[16px] md:text-[18px] text-white leading-[1.35]">{r.trigger}</span>
            </span>
          </span>

          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase tracking-[0.12em] text-white/35 leading-none">{t.alsoLabel}</span>
            <ul className="flex flex-col gap-2.5">
              {r.also.map((a, i) => (
                <li
                  key={a.text}
                  className={cn("flex items-start gap-3 transition-opacity duration-300", step >= 2 ? "opacity-100" : "opacity-0")}
                  style={{ transitionDelay: `${i * 260}ms` }}
                >
                  <span
                    className={cn(
                      "mt-[3px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300",
                      step >= 2 ? "bg-[#12a150]/25" : "bg-white/10"
                    )}
                    style={{ transitionDelay: `${i * 260}ms` }}
                  >
                    <Check className="w-3 h-3 text-[#3ddc97]" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] md:text-[16px] text-white/80 leading-[1.4]">{a.text}</span>
                  <span className="ml-auto shrink-0 text-[12.5px] text-white/35 tabular-nums pt-1">{a.at}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href={link} className="group inline-flex self-start items-center gap-1.5 text-[14.5px] font-semibold text-white/75 hover:text-white transition-colors">
            {t.link}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
        </FadeIn>

        {/* ── Те, що бачить людина ────────────────────── */}
        <FadeIn delay={2} variant="scale" className="flex justify-center lg:justify-end">
          <CursorDemo
            playKey={`${active}-${step >= 2 ? "on" : "off"}`}
            active={step === 2}
            startDelay={TAP_DELAY}
            onDone={onTap}
            mode="touch"
            label={r.who}
            look={AVATAR_LOOKS[FACES[active]]}
            accent={AMBER}
            className="w-full flex justify-center lg:justify-end"
          >
            <TgDevice className="max-w-[300px]">
              <TgHeader title={t.botName} sub={t.botSub} />
              <div className="tg-wallpaper flex-1 min-h-0 px-4 py-4 flex flex-col">
                <div className="mt-auto flex flex-col gap-2.5">
                  <span className="self-center rounded-full bg-ink/20 px-2.5 py-1 text-[11.5px] font-medium text-white leading-none">
                    {t.todayLabel}
                  </span>

                  {step === 1 && (
                    <span className="tg-bubble bubble-in self-start rounded-[14px] rounded-bl-[4px] px-3.5 py-3 flex items-center gap-1.5">
                      <i className="tg-dot" />
                      <i className="tg-dot" />
                      <i className="tg-dot" />
                    </span>
                  )}

                  {step >= 2 && (
                    <TgMessage lines={r.lines} className="bubble-in" time={r.msgTime}>
                      <TgInline rows={rows} className="pt-1.5" dense demo={step === 2 ? reply : undefined} />
                    </TgMessage>
                  )}

                  {step >= 3 && (
                    <span className="tg-bubble-out bubble-in self-end max-w-[86%] rounded-[14px] rounded-br-[4px] px-3.5 py-2 flex items-end gap-2">
                      <span className="text-[14.5px] leading-[1.35] text-ink">{reply}</span>
                      <span className="text-[11px] text-ink-3 leading-none tabular-nums shrink-0 pb-0.5">{r.ackTime}</span>
                    </span>
                  )}

                  {step >= 4 && <TgMessage lines={r.ack} className="bubble-in" time={r.ackTime} />}
                </div>
              </div>
              <TgInput placeholder={t.inputPlaceholder} />
            </TgDevice>
          </CursorDemo>
        </FadeIn>
      </div>
    </section>
  );
}
