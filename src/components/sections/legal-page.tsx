"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import FadeIn from "@/components/shared/fade-in";
import AnalyticsOptOut from "@/components/shared/analytics-optout";
import { useLang } from "@/lib/lang";
import { LEGAL_UPDATED, type LegalCopy } from "@/content/legal";
import { SITE_EMAIL, SITE_PHONE } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";

/* Спільний макет для «Політики конфіденційності» та «Умов використання».
   Один стовпчик тексту — тут читають, а не розглядають. */

/** «19 вересня 2026» замість ISO: дати на сторінці пишемо словами. */
function formatUpdated(iso: string, lang: Lang) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === "en" ? "en-GB" : "uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function LegalPage({ copy }: { copy: Record<Lang, LegalCopy> }) {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="w-full flex flex-col items-center bg-page">
        <article className="w-full max-w-[760px] px-5 md:px-8 py-14 md:py-20 flex flex-col gap-10">
          <FadeIn className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 self-start text-[14px] text-ink-2 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              {c.backLabel}
            </Link>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{c.eyebrow}</span>
            <h1 className="font-semibold text-ink text-[34px] md:text-[46px] leading-[1.1] tracking-[-1.2px]">
              {c.title}
            </h1>
            <p className="text-[13.5px] text-ink-2">
              {c.updatedLabel}: <time dateTime={LEGAL_UPDATED}>{formatUpdated(LEGAL_UPDATED, lang)}</time>
            </p>
            <p className="text-[17px] md:text-[18px] text-ink-2 leading-[1.6]">{c.lead}</p>
          </FadeIn>

          <div className="flex flex-col gap-9">
            {c.sections.map((section) => (
              <FadeIn key={section.heading} className="flex flex-col gap-3">
                <h2 className="font-semibold text-ink text-[21px] md:text-[23px] leading-[1.3] tracking-[-0.5px]">
                  {section.heading}
                </h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="text-[16px] text-ink-2 leading-[1.65]">
                    {paragraph}
                  </p>
                ))}
                {section.optOut && <AnalyticsOptOut />}
                {section.list && (
                  <ul className="flex flex-col gap-2 pl-5 list-disc marker:text-ink-3">
                    {section.list.map((item) => (
                      <li key={item} className="text-[16px] text-ink-2 leading-[1.65]">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </FadeIn>
            ))}
          </div>

          <FadeIn className="flex flex-col gap-2 rounded-[20px] border border-hairline bg-surface p-6 md:p-8">
            <h2 className="font-semibold text-ink text-[19px] leading-[1.3]">{c.contactHeading}</h2>
            <p className="text-[16px] text-ink-2 leading-[1.6]">{c.contactText}</p>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-[16px]">
              <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-ink hover:underline underline-offset-2">
                {SITE_EMAIL}
              </a>
              <a href={`tel:${SITE_PHONE}`} className="font-medium text-ink hover:underline underline-offset-2">
                {SITE_PHONE}
              </a>
            </p>
          </FadeIn>
        </article>
      </main>
      <Footer />
    </>
  );
}
