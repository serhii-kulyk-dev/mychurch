"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CheckCheck, Sparkles } from "lucide-react";
import FadeIn, { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   Головна не розповідає про асистента — вона показує переписку.
   Лідер питає своїми словами, асистент відповідає даними церкви,
   а на дію спершу приносить чернетку з кнопкою: поки її не
   натиснули, не пішло нічого. Діалог грає сам і починається
   спочатку. Повний каталог і межі — на /ai.
   ──────────────────────────────────────────────────────────────── */

const FIRST_MS = 500;
const READ_MS = 1500;
const TYPING_MS = 1100;
const PRESS_MS = 1300;
const LOOP_MS = 3600;

export default function Assistant() {
  const t = useT().assistant;
  const script = t.script;

  const hostRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [pressed, setPressed] = useState<number[]>([]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Одне повідомлення за раз: пауза на прочитання → «друкує…» →
     бульбашка. Чернетка чекає на натискання, і лише тоді розмова
     йде далі. */
  useEffect(() => {
    if (!inView) return;
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

    if (prefersReducedMotion()) {
      setShown(script.length);
      setPressed(script.map((_, i) => i));
      setTyping(false);
      return clear;
    }

    const last = shown - 1;
    if (last >= 0 && script[last].buttons && !pressed.includes(last)) {
      later(PRESS_MS, () => setPressed((p) => [...p, last]));
      return clear;
    }

    if (shown >= script.length) {
      later(LOOP_MS, () => {
        setPressed([]);
        setShown(0);
      });
      return clear;
    }

    if (script[shown].who === "bot") {
      setTyping(true);
      later(TYPING_MS, () => {
        setTyping(false);
        setShown((n) => n + 1);
      });
    } else {
      later(shown === 0 ? FIRST_MS : READ_MS, () => setShown((n) => n + 1));
    }
    return clear;
  }, [shown, pressed, inView, script]);

  /* Нове повідомлення завжди внизу — як у справжньому чаті. */
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown, typing, pressed]);

  const bubbleBot =
    "rounded-[18px] rounded-bl-[6px] bg-surface border border-hairline px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]";

  return (
    <section
      id="assistant"
      ref={hostRef}
      className="w-full flex flex-col items-center py-16 md:py-24 bg-page scroll-mt-24"
    >
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] gap-10 lg:gap-16 items-center">
        <FadeIn className="flex flex-col gap-5">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand leading-none">
            {t.eyebrow}
          </span>
          <h2 className="font-semibold text-ink text-[38px] md:text-[56px] leading-[1.05] tracking-[-1.4px] md:tracking-[-2px]">
            {t.title}
          </h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55] max-w-[420px]">{t.text}</p>
          <Link
            href="/ai"
            className="group inline-flex self-start items-center gap-1.5 text-[14.5px] font-semibold text-ink-2 transition-colors hover:text-ink"
          >
            {t.link}
            <ArrowRight className="w-4 h-4 text-brand transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </Link>
        </FadeIn>

        <FadeIn delay={2} variant="scale" className="w-full">
          <div className="rounded-[26px] border border-hairline bg-surface shadow-[0_34px_70px_-45px_rgba(0,50,120,0.5)] overflow-hidden">
            <div className="flex items-center gap-3 border-b border-hairline bg-surface px-4 py-3">
              <span className="w-9 h-9 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Sparkles className="w-[18px] h-[18px]" strokeWidth={2.2} />
              </span>
              <span className="flex flex-col gap-1 min-w-0">
                <span className="text-[14.5px] font-semibold text-ink leading-none truncate">{t.name}</span>
                <span className={cn("text-[12px] leading-none", typing ? "text-brand" : "text-ink-3")}>
                  {typing ? t.typing : t.sub}
                </span>
              </span>
            </div>

            <div ref={listRef} className="chat-wallpaper h-[440px] md:h-[500px] overflow-hidden">
              <div className="min-h-full flex flex-col justify-end gap-2.5 p-3 md:p-4">
                {script.slice(0, shown).map((m, i) =>
                  m.who === "me" ? (
                    <div key={i} className="bubble-in self-end max-w-[84%]">
                      <div className="rounded-[18px] rounded-br-[6px] bg-brand text-white px-4 py-2.5">
                        <p className="text-[15px] leading-[1.4]">{m.text}</p>
                        <span className="mt-0.5 flex items-center justify-end gap-1 text-[10.5px] text-white/70 leading-none">
                          {m.time}
                          <CheckCheck className="w-3.5 h-3.5" strokeWidth={2.4} />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="bubble-in self-start max-w-[92%] sm:max-w-[86%]">
                      <div className={cn(bubbleBot, "flex flex-col gap-2.5")}>
                        <p className="text-[15px] text-ink leading-[1.4]">{m.text}</p>

                        {m.rows && (
                          <ul className="flex flex-col divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-surface-2">
                            {m.rows.map((r) => (
                              <li key={r.k} className="flex items-center justify-between gap-3 px-3 py-2 text-[13.5px] leading-none">
                                <span className="font-medium text-ink truncate">{r.k}</span>
                                <span className="shrink-0 text-ink-2 tabular-nums">{r.v}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {m.buttons && (
                          <div className="flex flex-wrap gap-2">
                            {m.buttons.map((b, bi) => {
                              const done = bi === 0 && pressed.includes(i);
                              return (
                                <span
                                  key={b}
                                  className={cn(
                                    "h-9 px-4 rounded-full flex items-center justify-center gap-1.5 text-[13.5px] font-semibold leading-none transition-colors duration-300",
                                    done
                                      ? "press-pulse bg-[#12a150] text-white"
                                      : bi === 0
                                        ? "btn-brand text-white"
                                        : "border border-hairline-strong bg-surface text-ink-2"
                                  )}
                                >
                                  {done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                                  {b}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        <span className="self-end text-[10.5px] text-ink-3 leading-none tabular-nums">{m.time}</span>
                      </div>
                    </div>
                  )
                )}

                {typing && (
                  <div className="bubble-in self-start">
                    <div className={cn(bubbleBot, "flex items-center gap-1.5 py-3.5")}>
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="typing-dot w-1.5 h-1.5 rounded-full bg-ink-3" style={{ animationDelay: `${d * 0.18}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
