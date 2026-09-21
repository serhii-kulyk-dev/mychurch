"use client";

import { Fragment } from "react";
import { CheckCheck, MoreVertical } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import BrandMark from "@/components/shared/brand-mark";
import { TgInput } from "@/components/shared/tg-screen";
import { useLang } from "@/lib/lang";
import { SUPPORT_COPY } from "@/content/support";
import { cn } from "@/lib/utils";

/* Кроки обробки звернення не переказуємо іконками в ряд — показуємо
   саму переписку. Кожен крок підписаний там, де він справді
   відбувається: сірою плашкою над реплікою, як Telegram розділяє дні.

   Вікно ліворуч, заголовок праворуч — навпаки до «Надійності» нижче,
   щоб два сусідні блоки не лягали однаково. */

export default function SupportFlow() {
  const { lang } = useLang();
  const c = SUPPORT_COPY[lang].flow;
  const chat = c.chat;

  /* Нумеруємо кроки заздалегідь: усередині рендера нічого не рахуємо
     лічильником, інакше React Compiler справедливо свариться. */
  const rows = chat.turns.map((turn, i) => ({
    turn,
    no: turn.step ? chat.turns.filter((t, j) => j <= i && t.step).length : 0,
  }));

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] gap-10 lg:gap-16 items-start">
        <SectionHeading
          align="left"
          eyebrow={c.eyebrow}
          title={c.title}
          text={c.text}
          className="lg:order-2 lg:sticky lg:top-28"
        />

        <FadeIn variant="left" delay={1} className="lg:order-1 w-full">
          <figure className="m-0 flex flex-col gap-3">
            <div className="rounded-[22px] border border-hairline bg-surface overflow-hidden shadow-[0_28px_70px_-48px_rgba(0,60,140,0.5)]">
              {/* Шапка чату: це ми, а не вигадана людина з іменем. */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline bg-surface">
                <span className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0">
                  <BrandMark className="w-[19px] h-[19px] text-white" />
                </span>
                <span className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="block text-[14.5px] font-semibold text-ink leading-none truncate">
                    {chat.title}
                  </span>
                  <span className="block text-[12px] text-brand leading-none truncate">{chat.status}</span>
                </span>
                <MoreVertical className="w-[18px] h-[18px] text-ink-3 shrink-0" strokeWidth={2} aria-hidden />
              </div>

              <div className="tg-wallpaper px-4 md:px-5 py-5 flex flex-col gap-2.5">
                {rows.map(({ turn, no }, i) => {
                  const out = turn.from === "you";
                  return (
                    <Fragment key={i}>
                      {turn.step && (
                        <span className="self-center rounded-full bg-[rgba(12,32,56,0.3)] dark:bg-white/14 px-3 py-[5px] text-[11.5px] font-semibold text-white leading-none">
                          {String(no).padStart(2, "0")} · {turn.step}
                        </span>
                      )}
                      <div
                        className={cn(
                          "max-w-[88%] sm:max-w-[80%] rounded-[16px] px-3.5 py-2.5 flex flex-col gap-1",
                          out
                            ? "tg-bubble-out self-end rounded-br-[4px]"
                            : "tg-bubble self-start rounded-bl-[4px]"
                        )}
                      >
                        <span className="text-[14.5px] md:text-[15px] leading-[1.45] text-ink">
                          {turn.text}
                        </span>
                        <span className="self-end flex items-center gap-1 text-[11px] text-ink-3 leading-none">
                          {turn.at}
                          {out && (
                            <CheckCheck
                              className="w-[13px] h-[13px] text-brand"
                              strokeWidth={2.4}
                              aria-hidden
                            />
                          )}
                        </span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>

              <TgInput placeholder={chat.placeholder} />
            </div>

            <figcaption className="text-[13.5px] text-ink-3 leading-[1.5] max-w-[620px]">
              {chat.caption}
            </figcaption>
          </figure>
        </FadeIn>
      </div>
    </section>
  );
}
