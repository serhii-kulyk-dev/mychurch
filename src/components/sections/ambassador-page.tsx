"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, LayoutGrid, MapPin, Minus, Play } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import { MODULE_ICONS } from "@/components/shared/module-icons";
import { getAmbassador } from "@/content/ambassadors";
import { getModuleVideo, getModuleVideoPoster } from "@/content/modules/videos";
import type { AmbassadorCopy, AmbassadorDetail } from "@/content/ambassadors";
import { useDemoModal } from "@/context/demo-modal-context";
import { useLang, useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   One page per ambassador church, kept to five blocks: who they are,
   the church in photos, what changed, what they run, how the rollout
   went. All copy comes from src/content/ambassadors. We publish no
   counts of the church's people, accounts or groups — that is the
   church's own data, not our proof.
   ──────────────────────────────────────────────────────────────── */

interface Ctx {
  church: AmbassadorDetail;
  copy: AmbassadorCopy;
  accent: string;
}

function Logo({ church, accent }: { church: AmbassadorDetail; accent: string }) {
  const box = "w-16 h-16 md:w-20 md:h-20 rounded-[22px] flex items-center justify-center shrink-0 overflow-hidden border border-hairline";
  if (church.logo) {
    return (
      <span className={box} style={{ background: `color-mix(in oklab, ${accent} 12%, var(--surface))` }}>
        <Image src={church.logo} alt={church.name} width={56} height={45} className="w-11 md:w-12 h-auto" />
      </span>
    );
  }
  return (
    <span
      className={`${box} font-semibold text-[22px] tracking-[-0.5px]`}
      style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
    >
      {church.initials}
    </span>
  );
}

/* ── The church's own screen recording ──────────────────────────── */
/* Nothing loads until the visitor presses play — until then it is a poster. */
function Clip({ id, accent }: { id: string; accent: string }) {
  const c = useT().ambassadorPage;
  const t = useT();
  const [playing, setPlaying] = useState(false);

  const name = useMemo(() => {
    for (const group of t.modules.groups) for (const item of group.items) if (item.id === id) return item.name;
    return undefined;
  }, [t, id]);

  const file = getModuleVideo(id);
  const poster = getModuleVideoPoster(id);
  if (!file || !poster || !name) return null;

  return (
    <figure className="overflow-hidden rounded-[20px] md:rounded-[24px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
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
            <Image src={poster} alt="" fill sizes="(max-width: 1024px) 100vw, 460px" className="object-cover" />
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
        <span className="font-semibold text-ink text-[15.5px] leading-[1.3] tracking-[-0.2px]">{name}</span>
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
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-12">
        <FadeIn>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
            <Link href="/about" className="hover:text-ink transition-colors">{parentLabel}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink-2 font-medium">{church.name}</span>
          </nav>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] gap-10 lg:gap-14 items-center">
          <FadeIn className="flex flex-col gap-5 md:gap-6">
            <div className="flex items-center gap-4">
              <Logo church={church} accent={accent} />
              <div className="flex flex-col gap-1.5">
                <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                  {copy.eyebrow}
                </span>
                <span className="text-[17px] md:text-[19px] font-semibold text-ink leading-none tracking-[-0.3px]">
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
            <Clip id="people" accent={accent} />
          </FadeIn>
        </div>

        <FadeIn delay={3}>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 border-t border-hairline pt-6">
            {copy.facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <dt className="text-[13px] text-ink-3 leading-[1.35]">{f.label}</dt>
                <dd className="text-[15px] font-medium text-ink leading-[1.35]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Photos and one line the church wrote about itself ──────────── */
function Photos({ ctx }: { ctx: Ctx }) {
  const { copy, accent, church } = ctx;
  if (!copy.photos.length) return null;

  return (
    <section className="w-full flex flex-col items-center py-14 md:py-20">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {copy.photos.map((photo, i) => (
            <FadeIn key={photo.src} delay={i} variant="scale">
              <figure className="relative overflow-hidden rounded-[20px] md:rounded-[24px] border border-hairline aspect-[4/3]">
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover" />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-[14px] text-white leading-[1.4] drop-shadow">
                  {photo.caption}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={1} className="flex flex-col gap-3 max-w-[760px]">
          <blockquote className="flex flex-col gap-2.5">
            <p className="font-semibold text-ink text-[22px] md:text-[28px] leading-[1.3] tracking-[-0.6px]">
              «{copy.quote.text}»
            </p>
            <Link
              href={copy.quote.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1 self-start text-[13.5px] text-ink-3 hover:text-ink transition-colors"
            >
              {copy.quote.source}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </blockquote>

          <span className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-3">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>
              {copy.photosEyebrow}
            </span>
            <span aria-hidden>·</span>
            <span>{copy.photoCredit}</span>
            <Link
              href={church.website}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1 text-ink-2 hover:text-ink transition-colors"
            >
              {copy.photoCreditCta}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </span>
        </FadeIn>
      </div>
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
      </div>
    </section>
  );
}

/* ── Modules in use ─────────────────────────────────────────────── */
function Modules({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;

  return (
    <section id="modules" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <SectionHeading align="left" eyebrow={copy.modulesEyebrow} title={copy.modulesTitle} text={copy.modulesText} />

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 border-t border-hairline">
          {copy.modules.map((m) => {
            const Icon = MODULE_ICONS[m.id] ?? LayoutGrid;
            return (
              <FadeIn key={m.id}>
                <Link href={`/modules/${m.id}`} className="group flex gap-4 py-5 border-b border-hairline">
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

        <FadeIn>
          <Link href="/modules" className="link-underline text-[15px] font-medium text-ink-2 hover:text-ink transition-colors">
            {copy.modulesCta} →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Rollout timeline ───────────────────────────────────────────── */
function Timeline({ ctx }: { ctx: Ctx }) {
  const { copy, accent } = ctx;
  return (
    <section id="rollout" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-[128px]">
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
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[15px] shrink-0 border-4 border-surface"
                  style={{ background: accent }}
                >
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1.5 pt-1.5">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink-3">{step.when}</span>
                  <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.25px]">{step.title}</h3>
                  <p className="text-[15px] text-ink-2 leading-[1.5] max-w-[620px]">{step.text}</p>
                </div>
              </article>
            </FadeIn>
          ))}
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
      <Change ctx={ctx} />
      <Modules ctx={ctx} />
      <Timeline ctx={ctx} />
    </>
  );
}
