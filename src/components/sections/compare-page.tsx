"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Minus, Plus, X } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { COMPARE_COPY } from "@/content/compare";
import { useLang } from "@/lib/lang";

/* Сторінка «Порівняння».

   Три варіанти йдуть не картками поруч, а досьє одне під одним: у
   кожного своя смуга ліворуч і однакова послідовність питань — як це
   виглядає, за що беруть, де ламається, що робимо ми. Колонки поруч
   з'являються лише в таблиці нижче, і наша колонка там підсвічена,
   щоб око не шукало, де ми.

   Блок «де вони сильніші» свідомо стоїть поруч із блоком «коли нас
   брати не треба»: це одна думка, розказана з двох боків. */

const SHELL = "w-full max-w-[1000px] px-5 md:px-8";
const WIDE = "w-full max-w-[1180px] px-5 md:px-8";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">{children}</span>;
}

/* Дрібний підпис усередині досьє — щоб блоки читались як одна анкета. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-3 leading-[1.2]">{children}</span>
  );
}

export default function ComparePage() {
  const { lang } = useLang();
  const c = COMPARE_COPY[lang];

  return (
    <div className="w-full flex flex-col items-center">
      {/* hero */}
      <section className={`${SHELL} pt-14 md:pt-20 pb-6 md:pb-10`}>
        <FadeIn className="flex flex-col gap-4 max-w-[820px]">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className="font-semibold text-ink text-[32px] md:text-[46px] leading-[1.1] tracking-[-1.2px] md:tracking-[-1.7px]">
            {c.title}
          </h1>
          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55]">{c.lead}</p>
        </FadeIn>

        <FadeIn delay={1} className="mt-6 md:mt-8">
          <p className="max-w-[760px] border-l-2 border-brand/35 pl-4 md:pl-5 text-[15px] md:text-[16px] text-ink-2 leading-[1.6]">
            {c.fairness}
          </p>
        </FadeIn>

        <FadeIn delay={2} className="mt-5">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[14.5px] text-ink-3 leading-[1.5]">
            {c.guide.text}
            <Link
              href={c.guide.href}
              className="group inline-flex items-center gap-1.5 font-medium text-brand hover:opacity-75 transition-opacity"
            >
              {c.guide.label}
              <ArrowRight
                className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </p>
        </FadeIn>
      </section>

      {/* три варіанти — досьє одне під одним */}
      <section className={`${SHELL} py-10 md:py-14`}>
        <FadeIn className="flex flex-col gap-4 max-w-[720px]">
          <Eyebrow>{c.rivalsEyebrow}</Eyebrow>
          <h2 className="font-semibold text-ink text-[26px] md:text-[36px] leading-[1.15] tracking-[-1px]">
            {c.rivalsTitle}
          </h2>
          <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.58]">{c.rivalsText}</p>
        </FadeIn>

        <div className="mt-8 md:mt-10 flex flex-col gap-5 md:gap-6">
          {c.rivals.map((rival, i) => (
            <FadeIn key={rival.id} delay={i === 0 ? 1 : 0} variant="scale">
              <article className="rounded-[24px] border border-hairline bg-surface overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
                  {/* ліворуч: який це варіант */}
                  <div className="flex flex-col gap-2.5 p-6 md:p-8 bg-surface-2 border-b md:border-b-0 md:border-r border-hairline">
                    <span className="text-[13px] font-semibold text-ink-3 tabular-nums leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-ink text-[21px] md:text-[23px] leading-[1.2] tracking-[-0.6px]">
                      {rival.short}
                    </h3>
                    <p className="text-[14px] text-ink-3 leading-[1.5]">{rival.name}</p>
                  </div>

                  {/* праворуч: та сама анкета для всіх трьох */}
                  <div className="flex flex-col gap-5 p-6 md:p-8">
                    <div className="flex flex-col gap-1.5">
                      <Label>{c.realityLabel}</Label>
                      <p className="text-[16px] md:text-[17px] text-ink leading-[1.55] tracking-[-0.2px]">
                        {rival.reality}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label>{c.strengthLabel}</Label>
                      <p className="flex items-start gap-2.5 text-[15.5px] text-ink-2 leading-[1.55]">
                        <Plus className="w-4 h-4 mt-[4px] shrink-0 text-brand" aria-hidden />
                        {rival.strength}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>{c.breaksLabel}</Label>
                      <ul className="flex flex-col gap-2">
                        {rival.breaks.map((line) => (
                          <li key={line} className="flex items-start gap-2.5 text-[15.5px] text-ink-2 leading-[1.55]">
                            <Minus className="w-4 h-4 mt-[4px] shrink-0 text-ink-3" aria-hidden />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* смуга з нашою відповіддю — єдине місце, де ми говоримо про себе */}
                <div className="flex flex-col gap-1.5 px-6 md:px-8 py-5 md:py-6 bg-brand/[0.055] border-t border-hairline">
                  <Label>{c.oursLabel}</Label>
                  <p className="flex items-start gap-2.5 text-[15.5px] md:text-[16.5px] text-ink leading-[1.55]">
                    <Check className="w-4 h-4 mt-[4px] shrink-0 text-brand" aria-hidden />
                    {rival.ours}
                  </p>
                </div>

                <p className="px-6 md:px-8 py-4 border-t border-hairline text-[14px] text-ink-3 leading-[1.55]">
                  <span className="font-semibold text-ink-2">{c.enoughLabel}. </span>
                  {rival.enough}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* таблиця */}
      <section className={`${WIDE} py-10 md:py-16`}>
        <FadeIn className="flex flex-col gap-4 max-w-[720px]">
          <Eyebrow>{c.tableEyebrow}</Eyebrow>
          <h2 className="font-semibold text-ink text-[26px] md:text-[36px] leading-[1.15] tracking-[-1px]">
            {c.tableTitle}
          </h2>
          <p className="text-[16px] md:text-[17px] text-ink-2 leading-[1.58]">{c.tableText}</p>
        </FadeIn>

        {/* широкий екран: справжня сітка, наша колонка підсвічена наскрізь */}
        <FadeIn delay={1} className="mt-8 md:mt-10 hidden lg:block">
          <div
            role="table"
            className="grid grid-cols-[minmax(0,13rem)_repeat(3,minmax(0,1fr))_minmax(0,1.15fr)] border-t border-hairline"
          >
            <div role="row" className="contents">
              <div role="columnheader" className="py-4 pr-4" />
              {c.rivals.map((rival) => (
                <div
                  key={rival.id}
                  role="columnheader"
                  className="py-4 px-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3 leading-[1.3]"
                >
                  {rival.short}
                </div>
              ))}
              <div
                role="columnheader"
                className="py-4 px-4 rounded-t-[14px] bg-brand/[0.07] text-[13px] font-semibold uppercase tracking-[0.1em] text-brand leading-[1.3]"
              >
                {c.usColumn}
              </div>
            </div>

            {c.rows.map((row) => (
              <div key={row.id} role="row" className="contents">
                <div
                  role="rowheader"
                  className="py-5 pr-4 border-t border-hairline text-[15px] font-semibold text-ink leading-[1.4] tracking-[-0.2px]"
                >
                  {row.criterion}
                </div>
                {c.rivals.map((rival) => (
                  <div
                    key={rival.id}
                    role="cell"
                    className="py-5 px-4 border-t border-hairline text-[14.5px] text-ink-3 leading-[1.5]"
                  >
                    {row.cells[rival.id]}
                  </div>
                ))}
                <div
                  role="cell"
                  className="py-5 px-4 border-t border-hairline bg-brand/[0.055] text-[14.5px] text-ink leading-[1.5]"
                >
                  {row.ours}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* вужчий екран: та сама таблиця, розгорнута по критеріях */}
        <FadeIn delay={1} className="mt-8 lg:hidden">
          <div className="flex flex-col border-t border-hairline">
            {c.rows.map((row) => (
              <div key={row.id} className="flex flex-col gap-3 py-6 border-b border-hairline">
                <h3 className="text-[16.5px] font-semibold text-ink leading-[1.35] tracking-[-0.3px]">
                  {row.criterion}
                </h3>

                <p className="flex flex-col gap-1 rounded-[14px] bg-brand/[0.055] px-4 py-3">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-brand leading-[1.2]">
                    {c.usColumn}
                  </span>
                  <span className="text-[15px] text-ink leading-[1.5]">{row.ours}</span>
                </p>

                <dl className="flex flex-col gap-2 px-1">
                  {c.rivals.map((rival) => (
                    <div key={rival.id} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-3">
                      <dt className="text-[13px] text-ink-3 leading-[1.45]">{rival.short}</dt>
                      <dd className="text-[14.5px] text-ink-2 leading-[1.45]">{row.cells[rival.id]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={2}>
          <p className="mt-6 max-w-[780px] text-[14px] text-ink-3 leading-[1.6]">{c.tableNote}</p>
        </FadeIn>
      </section>

      {/* дві половини однієї чесності */}
      <section className={`${SHELL} py-10 md:py-14`}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-5 md:gap-6 items-start">
          <FadeIn variant="scale">
            <div className="rounded-[24px] border border-hairline bg-surface overflow-hidden">
              <div className="flex flex-col gap-3 p-6 md:p-8 border-b border-hairline">
                <Eyebrow>{c.strongerEyebrow}</Eyebrow>
                <h2 className="font-semibold text-ink text-[23px] md:text-[29px] leading-[1.18] tracking-[-0.8px]">
                  {c.strongerTitle}
                </h2>
                <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.58]">{c.strongerText}</p>
              </div>

              <dl className="flex flex-col divide-y divide-hairline">
                {c.stronger.map((item) => (
                  <div key={item.title} className="flex flex-col gap-1.5 px-6 md:px-8 py-5">
                    <dt className="text-[16px] font-semibold text-ink leading-[1.35] tracking-[-0.2px]">
                      {item.title}
                    </dt>
                    <dd className="text-[15px] text-ink-2 leading-[1.55]">{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>

          <FadeIn delay={1} variant="scale">
            <div className="rounded-[24px] border border-hairline bg-surface-2 p-6 md:p-7 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-[19px] md:text-[21px] font-semibold text-ink leading-[1.25] tracking-[-0.4px]">
                  {c.noTitle}
                </h2>
                <p className="text-[14.5px] text-ink-3 leading-[1.55]">{c.noText}</p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {c.no.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-[15px] text-ink-2 leading-[1.55]">
                    <X className="w-4 h-4 mt-[4px] shrink-0 text-ink-3" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* джерела */}
      <section className={`${SHELL} pb-12 md:pb-16`}>
        <FadeIn>
          <div className="flex flex-col gap-4 border-t border-hairline pt-8">
            <div className="flex flex-col gap-2 max-w-[720px]">
              <h2 className="text-[16px] font-semibold text-ink leading-[1.3] tracking-[-0.3px]">{c.sourcesTitle}</h2>
              <p className="text-[14px] text-ink-3 leading-[1.6]">{c.sourcesText}</p>
            </div>

            <ul className="flex flex-col divide-y divide-hairline border-y border-hairline">
              {c.sources.map((source) => (
                <li key={source.href} className="grid grid-cols-1 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-x-6 gap-y-1 py-3.5">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group inline-flex items-start gap-1.5 text-[14.5px] font-medium text-ink-2 hover:text-brand transition-colors leading-[1.45]"
                  >
                    {source.label}
                    <ArrowUpRight
                      className="w-3.5 h-3.5 mt-[3px] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </a>
                  <span className="text-[14px] text-ink-3 leading-[1.5]">{source.fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
