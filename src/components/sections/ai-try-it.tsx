"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, Send, Sparkles } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import type { Dict } from "@/lib/i18n";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

type Item = Dict["ai"]["tryIt"]["items"][number];

type MsgInput =
  | { role: "greeting" }
  | { role: "user"; item: number }
  | { role: "typing" }
  | { role: "answer"; item: number }
  | { role: "after"; item: number };
type Msg = MsgInput & { id: number };

const TYPING_DELAY = 500;
const ANSWER_DELAY = 1400;
const AFTER_DELAY = 600;

export default function AiTryIt() {
  const t = useT().ai;
  const tr = t.tryIt;
  const items = tr.items;

  const nextId = useRef(1);
  const timers = useRef<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: "greeting" }]);
  const [busy, setBusy] = useState(false);
  const [asked, setAsked] = useState<number[]>([]);
  const [acted, setActed] = useState<number[]>([]);

  useEffect(() => {
    const current = timers.current;
    return () => current.forEach(clearTimeout);
  }, []);

  /* Keep the newest message in view, like a real chat. */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const push = (m: MsgInput) => {
    const id = nextId.current++;
    setMsgs((list) => [...list, { ...m, id }]);
    return id;
  };
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const ask = (i: number) => {
    if (busy) return;
    setBusy(true);
    setAsked((a) => (a.includes(i) ? a : [...a, i]));
    push({ role: "user", item: i });
    later(TYPING_DELAY, () => push({ role: "typing" }));
    later(TYPING_DELAY + ANSWER_DELAY, () => {
      setMsgs((list) => list.filter((m) => m.role !== "typing"));
      push({ role: "answer", item: i });
      setBusy(false);
    });
  };

  const act = (msgId: number, i: number) => {
    if (acted.includes(msgId)) return;
    setActed((a) => [...a, msgId]);
    later(AFTER_DELAY, () => push({ role: "after", item: i }));
  };

  const bubbleBot = "rounded-[16px] rounded-bl-[4px] bg-surface border border-hairline px-3.5 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]";

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={tr.eyebrow} title={tr.title} text={tr.text} />

        <FadeIn variant="scale" className="w-full max-w-[760px] mx-auto">
          <div className="rounded-[24px] border border-hairline bg-surface shadow-[0_30px_60px_-40px_rgba(0,50,120,0.4)] overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline bg-surface">
              <Image src="/eva.jpg" alt={t.chat.name} width={36} height={36} sizes="36px" className="rounded-full shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-[14.5px] font-semibold text-ink leading-none truncate">{t.chat.name}</span>
                <span className={cn("text-[12px] leading-none", busy ? "text-brand" : "text-ink-3")}>{busy ? t.chat.typing : t.chat.kind}</span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1.5 text-[12px] font-medium text-brand leading-none">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={2.4} />
                {tr.eyebrow}
              </span>
            </div>

            <div ref={listRef} className="chat-wallpaper h-[420px] overflow-y-auto overscroll-contain">
              <div className="min-h-full flex flex-col justify-end gap-2.5 p-3 md:p-4">
                {msgs.map((m) => {
                  if (m.role === "greeting") {
                    return (
                      <div key={m.id} className="bubble-in self-start max-w-[88%]">
                        <p className={cn(bubbleBot, "text-[14px] text-ink leading-[1.4]")}>{tr.greeting}</p>
                      </div>
                    );
                  }
                  if (m.role === "user") {
                    return (
                      <div key={m.id} className="bubble-in self-end max-w-[86%]">
                        <div className="rounded-[16px] rounded-br-[4px] bg-brand text-white px-3.5 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
                          <p className="text-[14px] leading-[1.4]">{items[m.item].q}</p>
                          <span className="flex items-center justify-end gap-1 mt-0.5 text-[10.5px] text-white/70 leading-none">
                            {t.chat.time}
                            <CheckCheck className="w-3.5 h-3.5" strokeWidth={2.4} />
                          </span>
                        </div>
                      </div>
                    );
                  }
                  if (m.role === "typing") {
                    return (
                      <div key={m.id} className="bubble-in self-start">
                        <div className={cn(bubbleBot, "flex items-center gap-1.5 py-3")}>
                          {[0, 1, 2].map((d) => (
                            <span key={d} className="typing-dot w-1.5 h-1.5 rounded-full bg-ink-3" style={{ animationDelay: `${d * 0.18}s` }} />
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (m.role === "after") {
                    return (
                      <div key={m.id} className="bubble-in self-start max-w-[88%]">
                        <p className={cn(bubbleBot, "text-[14px] text-ink leading-[1.4]")}>{items[m.item].after}</p>
                      </div>
                    );
                  }
                  const item: Item = items[m.item];
                  const done = acted.includes(m.id);
                  return (
                    <div key={m.id} className="bubble-in self-start w-[92%] sm:w-[80%] flex flex-col gap-1">
                      <div className={cn(bubbleBot, "flex flex-col gap-2")}>
                        <p className="text-[14px] text-ink leading-[1.4]">{item.a}</p>
                        <ul className="flex flex-col divide-y divide-hairline rounded-xl border border-hairline bg-surface-2 overflow-hidden">
                          {item.rows.map((r) => (
                            <li key={r.k} className="flex items-center justify-between gap-3 px-3 py-2 text-[13px] leading-none">
                              <span className="font-medium text-ink truncate">{r.k}</span>
                              <span className="text-ink-2 tabular-nums shrink-0">{r.v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => act(m.id, m.item)}
                        disabled={done}
                        className={cn(
                          "h-9 rounded-[10px] flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-colors duration-200",
                          done ? "press-pulse bg-brand text-white cursor-default" : "bg-surface/90 border border-hairline text-brand hover:bg-brand-soft"
                        )}
                      >
                        {done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        {item.action}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggested questions — Telegram reply-keyboard style */}
            <div className="border-t border-hairline bg-surface px-3 md:px-4 pt-3 pb-2 flex flex-col gap-2">
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{tr.chipsLabel}</span>
              <div className="flex flex-wrap gap-2">
                {items.map((item, i) => {
                  const used = asked.includes(i);
                  return (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => ask(i)}
                      disabled={busy}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13.5px] font-medium leading-none transition-all duration-200 disabled:opacity-60",
                        used ? "bg-surface-2 border-hairline text-ink-2" : "bg-surface border-hairline-strong text-ink hover:border-brand/50 hover:text-brand hover:-translate-y-0.5"
                      )}
                    >
                      {used && <Check className="w-3.5 h-3.5 text-[#0e7a3c] dark:text-[#3ddc97]" strokeWidth={3} />}
                      {item.q}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 border-t border-hairline bg-surface">
              <div className="flex-1 h-9 rounded-full bg-surface-2 border border-hairline px-3.5 flex items-center">
                <span className="text-[14px] text-ink-3">{t.chat.placeholder}</span>
              </div>
              <span className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0">
                <Send className="w-[15px] h-[15px] text-white" strokeWidth={2.2} />
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
