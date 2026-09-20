"use client";

import Image from "next/image";
import { useState } from "react";
import { MessageSquare, Pencil, Send, Smartphone, Smile } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import PersonAvatar, { AVATAR_LOOKS } from "@/components/shared/person-avatar";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

const NAME_MAX = 24;
const CHANNEL_ICONS = [Send, Smartphone, MessageSquare];
const AVATAR_OPTIONS = [null, AVATAR_LOOKS[0], AVATAR_LOOKS[3]] as const;

function Avatar({ option, size }: { option: number; size: number }) {
  const look = AVATAR_OPTIONS[option];
  if (!look) {
    return <Image src="/eva.jpg" alt="" width={size} height={size} sizes={`${size}px`} className="rounded-full" />;
  }
  return <PersonAvatar look={look} size={size} />;
}

export default function AiPersona() {
  const t = useT().ai.persona;
  const m = t.mock;
  const { lang } = useLang();
  const [name, setName] = useState(lang === "en" ? "Eva" : "Єва");
  const [avatar, setAvatar] = useState(0);
  const [tone, setTone] = useState(0);
  const [channels, setChannels] = useState([true, true, false]);

  const shown = name.trim() || m.fallbackName;
  const greeting = m.greetings[tone].replace("{name}", shown);

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
        <FadeIn className="flex flex-col gap-5">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
          <h2 className="font-semibold text-ink text-[30px] md:text-[42px] leading-[1.12] tracking-[-1px] md:tracking-[-1.5px]">{t.title}</h2>
          <p className="text-[16.5px] md:text-[18px] text-ink-2 leading-[1.55]">{t.text}</p>
        </FadeIn>

        <FadeIn delay={2} variant="scale" className="relative">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[40px] -z-10 blur-3xl opacity-60"
            style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
          />
          <div className="rounded-[24px] border border-hairline bg-surface shadow-[0_30px_60px_-40px_rgba(0,50,120,0.4)] overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-hairline bg-surface-2">
              <span className="text-[15px] font-semibold text-ink leading-none">{m.title}</span>
              <span className="flex items-center gap-1.5 text-[12px] text-ink-3 leading-none">
                <Pencil className="tap-hint w-3.5 h-3.5 text-brand" strokeWidth={2.2} />
                {m.hint}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr]">
              {/* Settings */}
              <div className="p-5 flex flex-col gap-5 sm:border-r border-hairline">
                <label className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{m.nameLabel}</span>
                  <input
                    type="text"
                    value={name}
                    maxLength={NAME_MAX}
                    placeholder={m.namePlaceholder}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-hairline-strong bg-surface px-3.5 text-[15px] font-medium text-ink placeholder:text-ink-3 placeholder:font-normal outline-none transition-[border-color,box-shadow] duration-150 focus:border-brand focus:ring-[3px] focus:ring-brand/20"
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{m.avatarLabel}</span>
                  <div className="flex gap-2.5">
                    {AVATAR_OPTIONS.map((_, i) => {
                      const on = avatar === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAvatar(i)}
                          aria-pressed={on}
                          aria-label={`${m.avatarLabel} ${i + 1}`}
                          className={cn(
                            "rounded-full p-0.5 transition-all duration-200",
                            on ? "ring-[3px] ring-brand/40 scale-105" : "opacity-70 hover:opacity-100 hover:scale-105"
                          )}
                        >
                          <Avatar option={i} size={44} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{m.toneLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {m.tones.map((label, i) => {
                      const on = tone === i;
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setTone(i)}
                          aria-pressed={on}
                          className={cn(
                            "h-9 px-3.5 rounded-full border text-[13.5px] font-medium transition-colors duration-150",
                            on ? "bg-brand border-brand text-white" : "bg-surface border-hairline-strong text-ink-2 hover:bg-surface-2 hover:text-ink"
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{m.channelsLabel}</span>
                  <ul className="flex flex-col gap-1.5">
                    {m.channels.map((label, i) => {
                      const Icon = CHANNEL_ICONS[i % CHANNEL_ICONS.length];
                      const on = channels[i];
                      return (
                        <li key={label} className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 px-3 py-2">
                          <span className="flex items-center gap-2.5 text-[14px] text-ink">
                            <Icon className="w-4 h-4 text-ink-3" strokeWidth={2.2} />
                            {label}
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={on}
                            aria-label={label}
                            onClick={() => setChannels((c) => c.map((v, j) => (j === i ? !v : v)))}
                            className={cn("relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0", on ? "bg-brand" : "bg-surface-3 border border-hairline-strong")}
                          >
                            <span
                              className={cn(
                                "absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-[left] duration-200",
                                on ? "left-[19px]" : "left-[2px]"
                              )}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Live preview */}
              <div className="p-5 flex flex-col gap-3 bg-surface-2/60 border-t sm:border-t-0 border-hairline">
                <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{m.previewLabel}</span>
                <div className="rounded-[18px] border border-hairline bg-surface overflow-hidden flex flex-col flex-1">
                  <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-hairline">
                    <span className="relative shrink-0">
                      <Avatar option={avatar} size={34} />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#12a150] border-2 border-surface" />
                    </span>
                    <span className="flex flex-col gap-1 min-w-0">
                      <span className="text-[14px] font-semibold text-ink leading-none truncate">{shown}</span>
                      <span className="text-[11.5px] text-ink-3 leading-none">{channels[0] ? "Telegram" : m.channels[1]}</span>
                    </span>
                  </div>
                  <div className="chat-wallpaper flex-1 p-3 flex flex-col gap-2 min-h-[190px]">
                    <div key={`${tone}-${shown}`} className="bubble-in self-start max-w-[92%] flex items-end gap-2">
                      <span className="shrink-0 mb-0.5">
                        <Avatar option={avatar} size={24} />
                      </span>
                      <p className="rounded-[16px] rounded-bl-[4px] bg-surface border border-hairline px-3.5 py-2.5 text-[13.5px] text-ink leading-[1.45] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                        {greeting}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 border-t border-hairline">
                    <div className="flex-1 h-8 rounded-full bg-surface-2 border border-hairline px-3 flex items-center justify-between">
                      <span className="text-[12.5px] text-ink-3">…</span>
                      <Smile className="w-4 h-4 text-ink-3" strokeWidth={2} />
                    </div>
                    <span className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                      <Send className="w-[14px] h-[14px] text-white" strokeWidth={2.2} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
