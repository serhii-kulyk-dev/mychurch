"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { BatteryFull, Check, CheckCheck, ChevronLeft, Send, Signal, Wifi } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* Simple hero demo: the visitor types a request (or taps a suggestion) and Eva answers.
   Answers come from the same catalogue the "try it" section uses; free text is matched by keywords. */

type Item = Dict["ai"]["tryIt"]["items"][number];

type MsgInput =
  | { role: "bot"; text: string }
  | { role: "user"; text: string }
  | { role: "typing" }
  | { role: "answer"; item: Item };
type Msg = MsgInput & { id: number };

const TYPING_DELAY = 450;
const ANSWER_DELAY = 1300;
const AFTER_DELAY = 550;
const CHIPS = 3;

function normalize(s: string) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function matchItem(items: readonly Item[], text: string): Item | undefined {
  const q = normalize(text);
  let best: Item | undefined;
  let bestScore = 0;
  for (const item of items) {
    const score = item.keys.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}

export default function EvaChat() {
  const t = useT().ai;
  const c = t.chat;
  const items = t.tryIt.items;

  const nextId = useRef(1);
  const timers = useRef<number[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: "bot", text: c.greeting }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
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

  const send = (text: string, item?: Item) => {
    const clean = text.trim();
    if (busy || !clean) return;
    setBusy(true);
    setDraft("");
    if (item) setAsked((a) => (a.includes(item.q) ? a : [...a, item.q]));
    push({ role: "user", text: clean });
    later(TYPING_DELAY, () => push({ role: "typing" }));
    later(TYPING_DELAY + ANSWER_DELAY, () => {
      setMsgs((list) => list.filter((m) => m.role !== "typing"));
      if (item) push({ role: "answer", item });
      else push({ role: "bot", text: c.fallback });
      setBusy(false);
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(draft, matchItem(items, draft));
  };

  /* Enter sends, like in Telegram; IME composition (e.g. on mobile) is left alone. */
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    send(draft, matchItem(items, draft));
  };

  const act = (msgId: number, item: Item) => {
    if (acted.includes(msgId)) return;
    setActed((a) => [...a, msgId]);
    later(AFTER_DELAY, () => push({ role: "bot", text: item.after }));
  };

  const chips = items.filter((i) => !asked.includes(i.q)).slice(0, CHIPS);
  const bubbleBot = "rounded-[16px] rounded-bl-[4px] bg-surface border border-hairline px-3.5 py-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]";

  return (
    <div className="relative w-full max-w-[380px] mx-auto">
      <div className="relative rounded-[36px] border border-hairline bg-surface shadow-[0_40px_80px_-40px_rgba(0,50,120,0.45)] overflow-hidden flex flex-col">
        {/* Status bar */}
        <div className="h-9 flex items-center justify-between px-6 text-[12px] font-semibold text-ink">
          <span className="tabular-nums">{c.time}</span>
          <span className="flex items-center gap-1.5 text-ink">
            <Signal className="w-[13px] h-[13px]" strokeWidth={2.4} />
            <Wifi className="w-[13px] h-[13px]" strokeWidth={2.4} />
            <BatteryFull className="w-[15px] h-[15px]" strokeWidth={2.2} />
          </span>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-hairline bg-surface">
          <ChevronLeft className="w-5 h-5 text-brand shrink-0" strokeWidth={2.2} />
          <span className="relative shrink-0">
            <Image src="/eva.jpg" alt={c.name} width={36} height={36} sizes="36px" className="rounded-full" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#12a150] border-2 border-surface" />
          </span>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <span className="text-[14.5px] font-semibold text-ink leading-none truncate">{c.name}</span>
            <span className={cn("text-[12px] leading-none", busy ? "text-brand" : "text-[#0e7a3c] dark:text-[#3ddc97]")}>
              {busy ? c.typing : c.online}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div ref={listRef} className="chat-wallpaper h-[380px] overflow-y-auto overscroll-contain">
          <div className="min-h-full flex flex-col justify-end gap-2 p-3">
            {msgs.map((m) => {
              if (m.role === "bot") {
                return (
                  <div key={m.id} className="bubble-in self-start max-w-[88%]">
                    <p className={cn(bubbleBot, "text-[14px] text-ink leading-[1.4]")}>{m.text}</p>
                  </div>
                );
              }
              if (m.role === "user") {
                return (
                  <div key={m.id} className="bubble-in self-end max-w-[86%]">
                    <div className="rounded-[16px] rounded-br-[4px] bg-brand text-white px-3.5 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
                      <p className="text-[14px] leading-[1.4] break-words">{m.text}</p>
                      <span className="flex items-center justify-end gap-1 mt-0.5 text-[10.5px] text-white/70 leading-none">
                        {c.time}
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
              const done = acted.includes(m.id);
              return (
                <div key={m.id} className="bubble-in self-start w-[92%] flex flex-col gap-1">
                  <div className={cn(bubbleBot, "flex flex-col gap-2")}>
                    <p className="text-[14px] text-ink leading-[1.4]">{m.item.a}</p>
                    <ul className="flex flex-col divide-y divide-hairline rounded-xl border border-hairline bg-surface-2 overflow-hidden">
                      {m.item.rows.map((r) => (
                        <li key={r.k} className="flex items-center justify-between gap-3 px-3 py-2 text-[12.5px] leading-none">
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
                      "h-8 rounded-[10px] flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-colors duration-200",
                      done ? "press-pulse bg-brand text-white cursor-default" : "bg-surface/90 border border-hairline text-brand hover:bg-brand-soft"
                    )}
                  >
                    {done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    {m.item.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions — one tap sends the request */}
        {chips.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 pt-2.5 pb-1 bg-surface border-t border-hairline">
            {chips.map((item) => (
              <button
                key={item.q}
                type="button"
                onClick={() => send(item.q, item)}
                disabled={busy}
                className="shrink-0 rounded-full border border-hairline-strong bg-surface px-3 py-1.5 text-[12.5px] font-medium text-ink leading-none whitespace-nowrap transition-colors duration-200 hover:border-brand/50 hover:text-brand disabled:opacity-60"
              >
                {item.q}
              </button>
            ))}
          </div>
        )}

        {/* Composer — a real input */}
        <form onSubmit={submit} className="flex items-center gap-2 px-3 py-2.5 bg-surface">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            placeholder={c.placeholder}
            maxLength={140}
            autoComplete="off"
            aria-label={c.placeholder}
            className="flex-1 min-w-0 h-9 rounded-full bg-surface-2 border border-hairline px-3.5 text-[14px] text-ink placeholder:text-ink-3 outline-none focus:border-brand/60 transition-colors"
          />
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            aria-label={c.send}
            className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0 transition-opacity disabled:opacity-40"
          >
            <Send className="w-[15px] h-[15px] text-white" strokeWidth={2.2} />
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-[13px] text-ink-3 leading-[1.4]">{c.caption}</p>
    </div>
  );
}
