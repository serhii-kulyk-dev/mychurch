"use client";

import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { TELEGRAM_COPY } from "@/content/telegram";
import { useLang } from "@/lib/lang";

/* Один вечір групи по хвилинах: що бот почув, кому й коли написав.
   Не картки — рейка з часом, бо головне тут саме послідовність. */

export default function TelegramSpeed() {
  const { lang } = useLang();
  const t = TELEGRAM_COPY[lang].speed;
  const last = t.timeline.length - 1;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24 bg-page">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] gap-10 lg:gap-16 items-start">
          <ol className="flex flex-col">
            {t.timeline.map((item, i) => {
              const done = i === last;
              return (
                /* FadeIn — це div: усередині <ol> він має жити в <li>,
                   інакше список перестає бути списком для скрінрідера. */
                <li key={item.at}>
                  <FadeIn delay={i} className="flex gap-4 md:gap-5">
                  <div className="flex flex-col items-center shrink-0">
                    <span
                      className="w-[52px] md:w-[58px] text-right text-[13px] font-semibold text-ink-3 tabular-nums leading-none pt-[3px]"
                    >
                      {item.at}
                    </span>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <span
                      className="w-3 h-3 rounded-full border-2 mt-[1px]"
                      style={{
                        borderColor: done ? "#12a150" : "var(--brand)",
                        background: done ? "#12a150" : "var(--surface)",
                      }}
                    />
                    {i < last && <span className="w-[2px] flex-1 min-h-[26px] bg-hairline-strong my-1.5" />}
                  </div>
                  <div className={i === last ? "pb-0 flex-1 min-w-0" : "pb-7 flex-1 min-w-0"}>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-[16.5px] font-semibold text-ink leading-[1.3]">{item.title}</h3>
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none"
                        style={{
                          background: done ? "color-mix(in oklab, #12a150 14%, var(--surface))" : "var(--brand-soft)",
                          color: done ? "#0f8a45" : "var(--brand)",
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14.5px] text-ink-2 leading-[1.5] max-w-[560px]">{item.text}</p>
                  </div>
                  </FadeIn>
                </li>
              );
            })}
          </ol>

          {/* Правила бота — числами, без іконкових карток */}
          <FadeIn delay={2} variant="scale" className="rounded-[22px] border border-hairline bg-surface divide-y divide-[color:var(--hairline)] overflow-hidden">
            {t.rules.map((r) => (
              <div key={r.label} className="px-5 py-4 flex items-baseline gap-3">
                <span className="w-[74px] shrink-0 text-[24px] font-semibold text-ink leading-none tracking-[-0.8px] tabular-nums">{r.value}</span>
                <span className="text-[13.5px] text-ink-2 leading-[1.4]">{r.label}</span>
              </div>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
