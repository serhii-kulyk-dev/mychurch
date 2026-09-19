"use client";

import Link from "next/link";
import { ArrowRight, Check, Coffee, X } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { PRICING_COPY } from "@/content/pricing";
import { LEAD_AMBASSADOR, LEAD_AMBASSADOR_HREF } from "@/content/ambassadors";
import { useLang } from "@/lib/lang";

/* Сходинка тарифів. Щаблі йдуть згори вниз і накопичуються, тому це
   не чотири однакові картки поруч, а рядки, що ростуть: ліворуч —
   номер, назва і ціна, праворуч — яку рутину щабель знімає і які
   модулі додає. Індикатор ліворуч показує, котрий це щабель із
   чотирьох. */

const SHELL = "w-full max-w-[1000px] px-5 md:px-8";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">{children}</span>;
}

export default function PricingPage() {
  const { lang } = useLang();
  const c = PRICING_COPY[lang];
  const total = c.tiers.length;
  const accent = LEAD_AMBASSADOR.accent;

  return (
    <div className="w-full flex flex-col items-center">
      {/* hero */}
      <section className={`${SHELL} pt-14 md:pt-20 pb-8 md:pb-12`}>
        <FadeIn className="flex flex-col gap-4 max-w-[780px]">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className="font-semibold text-ink text-[32px] md:text-[46px] leading-[1.1] tracking-[-1.2px] md:tracking-[-1.7px]">
            {c.title}
          </h1>
          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55]">{c.lead}</p>
        </FadeIn>
      </section>

      {/* програма, що діє зараз */}
      <section className={`${SHELL} py-8 md:py-10`}>
        <FadeIn variant="scale">
          <div className="rounded-[24px] border border-hairline bg-surface overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col gap-3 p-6 md:p-8 bg-brand/[0.055] border-b border-hairline">
              <Eyebrow>{c.programEyebrow}</Eyebrow>
              <h2 className="font-semibold text-ink text-[23px] md:text-[29px] leading-[1.18] tracking-[-0.8px]">
                {c.programTitle}
              </h2>
              <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.58] max-w-[640px]">{c.programText}</p>
            </div>

            <ul className="flex flex-col divide-y divide-hairline">
              {c.program.map((item) => (
                <li key={item.title} className="flex items-start gap-4 px-6 md:px-8 py-5">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-brand/12 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-brand" aria-hidden />
                  </span>
                  <span className="flex flex-col gap-1 min-w-0">
                    <span className="text-[16px] font-semibold text-ink leading-[1.35] tracking-[-0.2px]">
                      {item.title}
                    </span>
                    <span className="text-[15px] text-ink-2 leading-[1.55]">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="px-6 md:px-8 py-5 border-t border-hairline text-[14px] text-ink-3 leading-[1.55]">
              {c.programNote}
            </p>
          </div>
        </FadeIn>
      </section>

      {/* сходинка щаблів */}
      <section className={`${SHELL} py-10 md:py-16`}>
        <FadeIn className="flex flex-col gap-4 max-w-[700px]">
          <Eyebrow>{c.tiersEyebrow}</Eyebrow>
          <h2 className="font-semibold text-ink text-[26px] md:text-[36px] leading-[1.15] tracking-[-1px]">
            {c.tiersTitle}
          </h2>
          <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.58]">{c.tiersText}</p>
        </FadeIn>

        <FadeIn delay={1} className="mt-8 md:mt-10">
          <ol className="flex flex-col border-t border-hairline">
            {c.tiers.map((tier, i) => (
              <li
                key={tier.id}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-x-10 gap-y-4 py-7 md:py-9 border-b border-hairline"
              >
                {/* ліворуч: щабель, назва, ціна */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2" aria-hidden>
                    {Array.from({ length: total }, (_, s) => (
                      <span
                        key={s}
                        className={`h-1 w-5 rounded-full ${s <= i ? "bg-brand" : "bg-hairline"}`}
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold text-ink text-[24px] md:text-[27px] leading-[1.15] tracking-[-0.7px]">
                    {tier.name}
                  </h3>
                  <p className="flex items-start gap-2 text-[15px] font-medium text-brand leading-[1.4]">
                    <Coffee className="w-4 h-4 mt-[3px] shrink-0" aria-hidden />
                    {tier.coffee}
                  </p>
                  {tier.uah && <p className="text-[14px] text-ink-3 leading-[1.4]">{tier.uah}</p>}
                  <p className="text-[14px] text-ink-3 leading-[1.5]">{tier.who}</p>
                </div>

                {/* праворуч: що знімає, що повертає, що додається */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[17px] md:text-[18px] font-semibold text-ink leading-[1.4] tracking-[-0.3px]">
                      {tier.problem}
                    </p>
                    <p className="text-[15.5px] text-ink-2 leading-[1.55]">{tier.time}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                      {c.addsLabel}
                    </span>
                    <ul className="flex flex-wrap gap-1.5">
                      {i > 0 && (
                        <li className="rounded-full border border-dashed border-hairline px-2.5 py-1 text-[13px] text-ink-3 leading-none">
                          {c.includesPrevLabel}
                        </li>
                      )}
                      {tier.adds.map((m) => (
                        <li
                          key={m}
                          className="rounded-full border border-hairline bg-surface-2 px-2.5 py-1 text-[13px] text-ink-2 leading-none"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </FadeIn>

        <FadeIn delay={2}>
          <p className="mt-6 max-w-[760px] text-[14px] text-ink-3 leading-[1.6]">{c.tiersNote}</p>
        </FadeIn>
      </section>

      {/* амбасадор — свідомо поза сходинкою */}
      <section className={`${SHELL} py-10 md:py-14`}>
        <FadeIn variant="scale">
          <div
            className="rounded-[24px] border border-hairline p-6 md:p-8 flex flex-col gap-5"
            style={{
              background: `linear-gradient(150deg, color-mix(in oklab, ${accent} 11%, var(--surface)), var(--surface) 64%)`,
            }}
          >
            <div className="flex flex-col gap-3 max-w-[660px]">
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                {c.ambassadorEyebrow}
              </span>
              <h2 className="font-semibold text-ink text-[23px] md:text-[29px] leading-[1.18] tracking-[-0.8px]">
                {c.ambassadorTitle}
              </h2>
              <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.58]">{c.ambassadorText}</p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {c.ambassadorPerks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-[15px] text-ink-2 leading-[1.55]">
                  <Check className="w-4 h-4 mt-[3px] shrink-0" style={{ color: accent }} aria-hidden />
                  {perk}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <p className="text-[14px] text-ink-3 leading-[1.5]">{c.ambassadorNote}</p>
              <Link
                href={LEAD_AMBASSADOR_HREF}
                className="group inline-flex items-center gap-1.5 text-[14.5px] font-medium transition-opacity hover:opacity-75"
                style={{ color: accent }}
              >
                {c.ambassadorCta}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* чого не буде */}
      <section className={`${SHELL} pb-4 md:pb-8`}>
        <FadeIn>
          <div className="rounded-[20px] border border-hairline bg-surface-2 p-6 md:p-7 flex flex-col gap-4">
            <h2 className="text-[16px] font-semibold text-ink leading-[1.3] tracking-[-0.3px]">{c.promisesTitle}</h2>
            <ul className="flex flex-col gap-2.5">
              {c.promises.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[15px] text-ink-2 leading-[1.55]">
                  <X className="w-4 h-4 mt-[3px] shrink-0 text-ink-3" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </section>

      {/* що входить завжди */}
      <section className={`${SHELL} py-10 md:py-16`}>
        <FadeIn className="flex flex-col gap-4 max-w-[680px]">
          <Eyebrow>{c.alwaysEyebrow}</Eyebrow>
          <h2 className="font-semibold text-ink text-[26px] md:text-[36px] leading-[1.15] tracking-[-1px]">
            {c.alwaysTitle}
          </h2>
          <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.58]">{c.alwaysText}</p>
        </FadeIn>

        <FadeIn delay={1} className="mt-8 md:mt-10">
          <dl className="flex flex-col divide-y divide-hairline border-t border-hairline">
            {c.always.map((item) => (
              <div
                key={item.title}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] gap-x-8 gap-y-1.5 py-5 md:py-6"
              >
                <dt className="text-[16.5px] font-semibold text-ink leading-[1.35] tracking-[-0.3px]">{item.title}</dt>
                <dd className="text-[15px] md:text-[15.5px] text-ink-2 leading-[1.58]">{item.text}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </section>
    </div>
  );
}
