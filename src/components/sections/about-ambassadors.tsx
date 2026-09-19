"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { getAmbassador, hasAmbassadorPage } from "@/content/ambassadors";
import { useLang, useT } from "@/lib/lang";

/* Brand colours per church; copy comes from the dictionary. The first
   ambassador is shown as a wide panel with the church's own public facts —
   city, address, service times — never counts of its people. The rest
   (once there are more) fall back to cards underneath. */
const CHURCHES: Record<string, { color: string; website: string; logo?: string }> = {
  "nove-zhyttia": { color: "#0f766e", website: "https://newlife.ck.ua/", logo: "/new-life-logo.png" },
};

const FALLBACK = { color: "#007aff", website: "#", logo: undefined as string | undefined };

export default function AboutAmbassadors() {
  const { lang } = useLang();
  const t = useT().about.ambassadors;
  const [first, ...rest] = t.items;
  const lead = CHURCHES[first.id] ?? FALLBACK;
  const leadDetail = getAmbassador(first.id);
  const leadFacts = leadDetail?.copy[lang].facts ?? [];
  const leadHref = hasAmbassadorPage(first.id) ? `/ambassadors/${first.id}` : lead.website;

  return (
    <section className="w-full flex flex-col items-center bg-page py-16 md:py-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <FadeIn variant="scale">
          <article
            className="rounded-[24px] border border-hairline overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            style={{ background: `linear-gradient(150deg, color-mix(in oklab, ${lead.color} 11%, var(--surface)), var(--surface) 62%)` }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] gap-8 lg:gap-12 p-6 md:p-8">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  {lead.logo ? (
                    <span
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-hairline"
                      style={{ background: `color-mix(in oklab, ${lead.color} 14%, var(--surface))` }}
                    >
                      <Image src={lead.logo} alt={first.name} width={48} height={39} className="w-11 h-auto" />
                    </span>
                  ) : (
                    <span
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-semibold text-[18px] tracking-[-0.3px] shrink-0"
                      style={{ backgroundColor: lead.color }}
                    >
                      {first.logoInitials}
                    </span>
                  )}
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-ink text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.6px]">{first.name}</h3>
                    {leadDetail && <span className="text-[13.5px] text-ink-3 leading-none">{leadDetail.city}</span>}
                  </div>
                </div>

                <p className="text-[15.5px] md:text-[16.5px] text-ink-2 leading-[1.55] max-w-[560px]">{first.description}</p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    href={leadHref}
                    className="group flex items-center gap-2 h-11 px-5 rounded-full text-white font-semibold text-[15px] tracking-[-0.3px] transition-opacity hover:opacity-90"
                    style={{ background: lead.color }}
                  >
                    {t.profileCta}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-[14.5px] font-medium transition-opacity hover:opacity-75"
                    style={{ color: lead.color }}
                  >
                    {t.siteCta}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {leadFacts.length > 0 && (
                <dl className="rounded-[18px] border border-hairline bg-surface divide-y divide-hairline overflow-hidden self-start w-full">
                  {leadFacts.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4 px-5 py-4">
                      <dt className="text-[13.5px] text-ink-3 leading-[1.35] shrink-0">{f.label}</dt>
                      <dd className="text-[14.5px] font-medium text-ink leading-[1.35] text-right">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </article>
        </FadeIn>

        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {rest.map((church, i) => {
              const meta = CHURCHES[church.id] ?? FALLBACK;
              const external = meta.website.startsWith("http");
              const href = hasAmbassadorPage(church.id) ? `/ambassadors/${church.id}` : meta.website;
              return (
                <FadeIn key={church.id} delay={i % 3} variant="scale" className="h-full">
                  <article className="hover-lift group h-full rounded-[20px] bg-surface border border-hairline p-6 flex flex-col gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <span
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-semibold text-[16px] tracking-[-0.3px] shrink-0"
                      style={{ backgroundColor: meta.color }}
                    >
                      {church.logoInitials}
                    </span>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <h3 className="font-semibold text-ink text-[18px] leading-[1.3] tracking-[-0.2px]">{church.name}</h3>
                      <p className="text-[15px] text-ink-2 leading-[1.5]">{church.description}</p>
                    </div>
                    <Link
                      href={href}
                      target={external && href === meta.website ? "_blank" : undefined}
                      rel={external && href === meta.website ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-[14.5px] font-medium transition-opacity hover:opacity-75"
                      style={{ color: meta.color }}
                    >
                      {church.websiteLabel}
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
