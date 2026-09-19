"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, LayoutGrid, MapPin, Minus, Play } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { MODULE_ICONS } from "@/components/shared/module-icons";
import { getAmbassador } from "@/content/ambassadors";
import { getModuleVideo, getModuleVideoPoster } from "@/content/modules/videos";
import type { AmbassadorCopy, AmbassadorDetail } from "@/content/ambassadors";
import { useDemoModal } from "@/context/demo-modal-context";
import { useLang, useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   One page per ambassador church. All copy comes from
   src/content/ambassadors. We publish no counts of the church's people,
   accounts or groups — that is the church's own data, not our proof.
   ──────────────────────────────────────────────────────────────── */

interface Ctx {
  church: AmbassadorDetail;
  copy: AmbassadorCopy;
  accent: string;
}

function Logo({ church, size }: { church: AmbassadorDetail; size: "sm" | "lg" }) {
  const box = size === "lg" ? "w-16 h-16 md:w-20 md:h-20 rounded-[22px]" : "w-12 h-12 rounded-2xl";
  if (church.logo) {
    return (
      <span
        className={`${box} flex items-center justify-center shrink-0 overflow-hidden border border-hairline`}
        style={{ background: `color-mix(in oklab, ${church.accent} 12%, var(--surface))` }}
      >
        <Image
          src={church.logo}
          alt={church.name}
          width={56}
          height={45}
          className={size === "lg" ? "w-11 md:w-12 h-auto" : "w-7 h-auto"}
        />
      </span>
    );
  }
  return (
    <span
      className={`${box} flex items-center justify-center shrink-0 text-white font-semibold text-[18px] tracking-[-0.3px]`}
      style={{ background: church.accent }}
    >
      {church.initials}
    </span>
  );
}

/* ── Hero ───────────────────────────────────────────────────────── */
function Hero({ ctx, parentLabel }: { ctx: Ctx; parentLabel: string }) {
  const { church, copy, accent } = ctx;
  const { open } = useDemoModal();
  const t = useT();

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-8 md:pt-12 pb-14 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[320px] left-[20%] w-[900px] h-[620px] rounded-full opacity-70"
          style={{ background: `radial-gradient(closest-side, color-mix(in oklab, ${accent} 20%, transparent), transparent 100%)` }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 30% 10%, black 10%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 10%, black 10%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-12">
        <FadeIn>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
            <Link href="/about" className="hover:text-ink transition-colors">{parentLabel}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink-2 font-medium">{church.name}</span>
          </nav>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] gap-10 lg:gap-14 items-start">
          <FadeIn className="flex flex-col gap-5 md:gap-6">
            <div className="flex items-center gap-4">
              <Logo church={church} size="lg" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                  {copy.eyebrow}
                </span>
                <span className="flex items-center gap-2 text-[17px] md:text-[19px] font-semibold text-ink leading-none tracking-[-0.3px]">
                  {church.name}
                </span>
                <span className="flex items-center gap-1.5 text-[13.5px] text-ink-3 leading-none">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                  {church.city}
                </span>
              </div>
            </div>

            <h1 className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-1.8px] text-[34px] sm:text-[42px] md:text-[52px] max-w-[660px]">
              {copy.title}
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[580px]">{copy.lead}</p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={open}
                className="btn-primary btn-brand group relative flex items-center justify-center gap-2 h-12 px-7 rounded-full overflow-hidden"
              >
                <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.3px] whitespace-nowrap">
                  {t.ambassadorsPage.becomeCta}
                </span>
                <ArrowRight className="relative w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <Link
                href={church.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary group relative flex items-center justify-center gap-2 h-12 px-7 rounded-full overflow-hidden border border-hairline-strong"
              >
                <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
                <span className="relative text-ink font-medium text-[15.5px] tracking-[-0.3px] whitespace-nowrap">{copy.siteCta}</span>
                <ArrowUpRight className="relative w-4 h-4 text-ink-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={2} variant="scale" className="w-full">
            <dl className="rounded-[24px] border border-hairline bg-surface-2 divide-y divide-hairline overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              {copy.facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-4 px-5 py-4">
                  <dt className="text-[13.5px] text-ink-3 leading-[1.35] shrink-0">{f.label}</dt>
                  <dd className="text-[15px] font-medium text-ink leading-[1.35] text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}

/* ── Before / after ─────────────────────────────────────────────── */
function Change({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  return (
    <section id="change" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <SectionHeading align="left" eyebrow={copy.changeEyebrow} title={copy.changeTitle} />

        <div className="flex flex-col">
          <div className="hidden md:grid grid-cols-2 gap-6 pb-3 border-b border-hairline">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">{copy.beforeLabel}</span>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>{copy.afterLabel}</span>
          </div>

          {copy.change.map((row, i) => (
            <FadeIn key={row.after} delay={i}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 py-5 border-b border-hairline">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-3 border border-hairline flex items-center justify-center shrink-0 mt-[1px] text-ink-3">
                    <Minus className="w-[13px] h-[13px]" strokeWidth={3} />
                  </span>
                  <p className="text-[15.5px] text-ink-3 leading-[1.5]">
                    <span className="md:hidden font-medium text-ink-2">{copy.beforeLabel}: </span>
                    {row.before}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-[1px]"
                    style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
                  >
                    <Check className="w-[13px] h-[13px]" strokeWidth={3} />
                  </span>
                  <p className="text-[15.5px] text-ink leading-[1.5]">
                    <span className="md:hidden font-medium text-ink-2">{copy.afterLabel}: </span>
                    {row.after}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <FadeIn variant="scale">
            <Clip id="automations" accent={accent} />
          </FadeIn>
          <FadeIn delay={1} variant="scale">
            <Clip id="links" accent={accent} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ── Modules in use ─────────────────────────────────────────────── */
function Modules({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  const [lead, ...rest] = copy.modules;
  const LeadIcon = MODULE_ICONS[lead.id] ?? LayoutGrid;

  return (
    <section id="modules" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <SectionHeading align="left" eyebrow={copy.modulesEyebrow} title={copy.modulesTitle} text={copy.modulesText} />

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-4 md:gap-6 items-stretch">
          <FadeIn variant="scale" className="h-full">
            <Link
              href={`/modules/${lead.id}`}
              className="hover-lift group h-full rounded-[24px] border border-hairline p-6 md:p-8 flex flex-col justify-center gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              style={{ background: `linear-gradient(150deg, color-mix(in oklab, ${accent} 11%, var(--surface)), var(--surface) 62%)` }}
            >
              <span
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-hairline shrink-0"
                style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
              >
                <LeadIcon className="w-7 h-7" strokeWidth={2} />
              </span>
              <div className="flex flex-col gap-2.5">
                <h3 className="flex items-center gap-1.5 font-semibold text-ink text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.6px]">
                  {lead.name}
                  <ArrowUpRight className="w-5 h-5 text-ink-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </h3>
                <p className="text-[16px] md:text-[16.5px] text-ink-2 leading-[1.55]">{lead.text}</p>
              </div>
            </Link>
          </FadeIn>

          <div className="rounded-[24px] border border-hairline bg-surface divide-y divide-hairline overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {rest.map((m, i) => {
              const Icon = MODULE_ICONS[m.id] ?? LayoutGrid;
              return (
                <FadeIn key={m.id} delay={i}>
                  <Link href={`/modules/${m.id}`} className="group flex gap-4 px-5 py-4 md:px-6 md:py-[18px] transition-colors duration-200 hover:bg-surface-2">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in oklab, ${accent} 12%, var(--surface))`, color: accent }}
                    >
                      <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="font-semibold text-ink text-[16.5px] leading-[1.3] tracking-[-0.2px]">{m.name}</h3>
                      <p className="text-[14.5px] text-ink-2 leading-[1.5]">{m.text}</p>
                    </div>
                    <ArrowUpRight className="ml-auto w-4 h-4 text-ink-3 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-4 md:gap-6 items-start">
          <FadeIn variant="scale">
            <Clip id={lead.id} accent={accent} />
          </FadeIn>
          <FadeIn delay={1} variant="scale">
            <Clip id="org" accent={accent} />
          </FadeIn>
        </div>

        <FadeIn>
          <Link href="/modules" className="link-underline text-[15px] font-medium text-ink-2 hover:text-ink transition-colors">
            {copy.modulesCta} →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Module clips ───────────────────────────────────────────────── */
/* The church's own screen recordings, scattered through the page: each clip
   sits next to the block it explains and links on to that module's page.
   Nothing loads until the visitor presses play — until then it is a poster. */
function useModuleNames() {
  const t = useT();
  return useMemo(() => {
    const names = new Map<string, string>();
    for (const group of t.modules.groups) for (const item of group.items) names.set(item.id, item.name);
    return names;
  }, [t]);
}

function Clip({ id, accent, className }: { id: string; accent: string; className?: string }) {
  const c = useT().ambassadorPage;
  const names = useModuleNames();
  const [playing, setPlaying] = useState(false);

  const file = getModuleVideo(id);
  const poster = getModuleVideoPoster(id);
  const name = names.get(id);
  if (!file || !poster || !name) return null;

  /* Some modules share one recording — name the others so the links make sense. */
  const also = [...names.keys()].filter((other) => other !== id && getModuleVideo(other) === file);

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[20px] md:rounded-[24px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
        className
      )}
    >
      <div className="relative w-full aspect-video bg-ink">
        {playing ? (
          <iframe
            src={`https://drive.google.com/file/d/${file}/preview?autoplay=1`}
            title={name}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${c.clipPlay}: ${name}`}
            className="group absolute inset-0 w-full h-full cursor-pointer"
          >
            <Image src={poster} alt="" fill sizes="(max-width: 768px) 100vw, 620px" className="object-cover" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
            <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11.5px] font-medium text-white leading-none backdrop-blur">
              {c.clipBadge}
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105"
                style={{ background: accent }}
              >
                <Play className="w-6 h-6 fill-current translate-x-[1px]" strokeWidth={0} />
              </span>
            </span>
          </button>
        )}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 md:px-5 py-3">
        <span className="flex flex-col min-w-0">
          <span className="font-semibold text-ink text-[15.5px] leading-[1.3] tracking-[-0.2px]">{name}</span>
          {also.length > 0 && (
            <span className="text-[12.5px] text-ink-3 leading-[1.4]">
              {c.clipAlso}{" "}
              {also.map((other, i) => (
                <Fragment key={other}>
                  {i > 0 && ", "}
                  <Link href={`/modules/${other}`} className="link-underline text-ink-2 hover:text-ink transition-colors">
                    {names.get(other)}
                  </Link>
                </Fragment>
              ))}
            </span>
          )}
        </span>
        <Link
          href={`/modules/${id}`}
          className="link-underline inline-flex items-center gap-1 text-[14px] font-medium text-ink-2 hover:text-ink transition-colors"
        >
          {c.clipOpen}
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </figcaption>
    </figure>
  );
}

/* ── Photos ─────────────────────────────────────────────────────── */
/* Real photographs of the church, published by the church itself. */
function Photos({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  if (!copy.photos.length) return null;
  const [lead, ...rest] = copy.photos;

  const frame = (photo: (typeof copy.photos)[number], tall: boolean) => (
    <figure className={cn("relative overflow-hidden rounded-[20px] md:rounded-[24px] border border-hairline", tall ? "aspect-[4/3]" : "aspect-[16/10] md:aspect-[16/9]")}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={tall ? "(max-width: 768px) 100vw, 620px" : "(max-width: 768px) 100vw, 420px"}
        className="object-cover"
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-[14px] md:text-[15px] text-white leading-[1.4] drop-shadow">
        {photo.caption}
      </figcaption>
    </figure>
  );

  return (
    <section className="w-full flex flex-col items-center pt-2 pb-10 md:pb-14">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-4">
          <FadeIn variant="scale">{frame(lead, true)}</FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {rest.map((photo, i) => (
              <FadeIn key={photo.src} delay={i + 1} variant="scale">
                {frame(photo, false)}
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={2} className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-3">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>
            {copy.photosEyebrow}
          </span>
          <span aria-hidden>·</span>
          <span>{copy.photoCredit}</span>
          <Link
            href={ctx.church.website}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-1 text-ink-2 hover:text-ink transition-colors"
          >
            {copy.photoCreditCta}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Voices ─────────────────────────────────────────────────────── */
/* What the church says about itself, quoted from its own site, with our
   note on what carries that promise inside MyChurch. */
function Voices({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  if (!copy.voices.length) return null;

  return (
    <section id="voices" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading align="left" eyebrow={copy.voicesEyebrow} title={copy.voicesTitle} text={copy.voicesText} />

        <div className="flex flex-col gap-10 md:gap-14">
          {copy.voices.map((voice, i) => (
            <FadeIn key={voice.quote} delay={i}>
              <article className={cn("grid grid-cols-1 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-6 md:gap-10 items-center", i % 2 === 1 && "md:[&>figure]:order-2")}>
                <figure className="relative aspect-[4/3] overflow-hidden rounded-[20px] md:rounded-[24px] border border-hairline">
                  <Image src={voice.photo} alt={voice.alt} fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" />
                </figure>

                <div className="flex flex-col gap-4">
                  <blockquote className="flex flex-col gap-3">
                    <span aria-hidden className="text-[44px] leading-none font-semibold" style={{ color: `color-mix(in oklab, ${accent} 45%, transparent)` }}>
                      “
                    </span>
                    <p className="font-semibold text-ink text-[21px] md:text-[26px] leading-[1.3] tracking-[-0.5px]">{voice.quote}</p>
                    <Link
                      href={voice.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1 self-start text-[13.5px] text-ink-3 hover:text-ink transition-colors"
                    >
                      {voice.source}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </blockquote>

                  <div
                    className="rounded-[16px] border border-hairline bg-page px-5 py-4 flex flex-col gap-1.5"
                    style={{ borderLeft: `3px solid ${accent}` }}
                  >
                    <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                      {copy.voicesNoteLabel}
                    </span>
                    <p className="text-[15px] text-ink-2 leading-[1.5]">{voice.note}</p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Ministries ─────────────────────────────────────────────────── */
function Ministries({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  return (
    <section id="ministries" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 lg:gap-14">
        <FadeIn className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-3">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>{copy.ministriesEyebrow}</span>
          <h2 className="font-semibold text-ink text-[28px] md:text-[36px] leading-[1.12] tracking-[-0.9px]">{copy.ministriesTitle}</h2>
          <p className="text-[15.5px] text-ink-2 leading-[1.55]">{copy.ministriesText}</p>
        </FadeIn>

        <div className="flex flex-col">
          {copy.ministries.map((m, i) => (
            <FadeIn key={m.name} delay={i}>
              <article className="flex items-start gap-4 py-4 border-b border-hairline first:border-t first:border-hairline">
                <span className="relative w-[84px] h-[62px] md:w-[108px] md:h-[76px] rounded-[14px] overflow-hidden border border-hairline shrink-0 bg-surface-2">
                  <Image src={m.photo} alt={m.alt} fill sizes="108px" className="object-cover" />
                </span>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                    <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.2px]">{m.name}</h3>
                    <span
                      className="rounded-full px-3 py-1.5 text-[13px] font-medium leading-none tabular-nums whitespace-nowrap"
                      style={{ background: `color-mix(in oklab, ${accent} 12%, var(--surface))`, color: accent }}
                    >
                      {m.meta}
                    </span>
                  </div>
                  <p className="text-[14.5px] text-ink-2 leading-[1.5]">{m.text}</p>
                </div>
              </article>
            </FadeIn>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 pt-8">
            <FadeIn variant="scale">
              <Clip id="groups" accent={accent} />
            </FadeIn>
            <FadeIn delay={1} variant="scale">
              <Clip id="learning" accent={accent} />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Rollout timeline ───────────────────────────────────────────── */
function Timeline({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  return (
    <section id="rollout" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <SectionHeading align="left" eyebrow={copy.timelineEyebrow} title={copy.timelineTitle} text={copy.timelineText} />

        <div className="relative flex flex-col gap-4">
          <span
            aria-hidden
            className="absolute left-[19px] top-8 bottom-8 w-[2px]"
            style={{ backgroundImage: "repeating-linear-gradient(to bottom, var(--hairline-strong) 0 6px, transparent 6px 12px)" }}
          />
          {copy.timeline.map((step, i) => (
            <FadeIn key={step.title} delay={i}>
              <article className="flex items-start gap-4">
                <span
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[15px] shrink-0 border-4 border-page"
                  style={{ background: accent }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 rounded-[16px] border border-hairline bg-surface px-5 py-4 flex flex-col gap-1.5">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{step.when}</span>
                  <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.25px]">{step.title}</h3>
                  <p className="text-[15px] text-ink-2 leading-[1.5]">{step.text}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <FadeIn variant="scale">
            <Clip id="onboarding" accent={accent} />
          </FadeIn>
          <FadeIn delay={1} variant="scale">
            <Clip id="forms" accent={accent} />
          </FadeIn>
        </div>

        <FadeIn>
          <Link href="/about" className="link-underline text-[15px] font-medium text-ink-2 hover:text-ink transition-colors">
            ← {copy.backLabel}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

export default function AmbassadorPage({ id }: { id: string }) {
  const { lang } = useLang();
  const t = useT();
  const church = getAmbassador(id);
  if (!church) return null;

  const copy = church.copy[lang];
  const ctx: Ctx = { church, copy, accent: church.accent };

  return (
    <>
      <Hero ctx={ctx} parentLabel={t.nav.about} />
      <Photos ctx={ctx} />
      <Voices ctx={ctx} />
      <Change ctx={ctx} />
      <Modules ctx={ctx} />
      <Ministries ctx={ctx} />
      <Timeline ctx={ctx} />
    </>
  );
}
