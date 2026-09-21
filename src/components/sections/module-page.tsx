"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, LayoutGrid, MonitorPlay, Play, Zap } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import ModuleMock from "@/components/shared/module-mock";
import ServiceNeeds from "@/components/sections/service-needs";
import ServicePlanning from "@/components/sections/service-planning";
import Ministries from "@/components/sections/ministries";
import HomeGroups from "@/components/sections/home-groups";
import {
  FEATURE_ICONS, MODULE_ICONS, moduleAccent, AUDIENCE_ROLE_ICONS, AUDIENCE_ROLE_ACCENTS,
} from "@/components/shared/module-icons";
import { getModule, hasModulePage } from "@/content/modules";
import { getModuleVideo, getModuleVideoPoster } from "@/content/modules/videos";
import type { ModuleCopy, Tone } from "@/content/modules/types";
import { useDemoModal } from "@/context/demo-modal-context";
import { useWorkspace } from "@/context/workspace-context";
import { useLang, useT } from "@/lib/lang";
import { centerInRail } from "@/lib/scroll";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import type { Dict } from "@/lib/i18n";

/* ────────────────────────────────────────────────────────────────
   One page per module. Copy comes from src/content/modules; group,
   item name and chrome strings come from the dictionary.
   ──────────────────────────────────────────────────────────────── */

function findItem(t: Dict, id: string) {
  for (const group of t.modules.groups) {
    const item = group.items.find((i) => i.id === id);
    if (item) return { group, item };
  }
  return null;
}

interface Ctx {
  id: string;
  name: string;
  accent: string;
  copy: ModuleCopy;
  t: Dict;
}

/* ── Hero ───────────────────────────────────────────────────────── */
function Hero({ ctx, groupId, groupTitle, soon }: { ctx: Ctx; groupId: string; groupTitle: string; soon?: boolean }) {
  const { open } = useDemoModal();
  const { open: openSpace } = useWorkspace();
  const { id, name, accent, copy, t } = ctx;
  const Icon = MODULE_ICONS[id] ?? LayoutGrid;

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
        {/* Breadcrumb */}
        <FadeIn>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
            <Link href="/modules" className="hover:text-ink transition-colors">{t.modulePage.breadcrumbModules}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/modules#m-${groupId}`} className="hover:text-ink transition-colors">{groupTitle}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink-2 font-medium">{name}</span>
          </nav>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] gap-10 lg:gap-16 items-center">
          <FadeIn className="flex flex-col gap-5 md:gap-6">
            <div className="flex items-center gap-3.5">
              <span
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border border-hairline shrink-0"
                style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
              >
                <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>{groupTitle}</span>
                <span className="flex items-center gap-2 text-[15px] font-medium text-ink-2 leading-none">
                  {name}
                  {soon && (
                    <span className="rounded-full border border-dashed border-hairline-strong px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3 leading-none">
                      {t.modulePage.soon}
                    </span>
                  )}
                </span>
              </div>
            </div>

            <h1 className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-1.8px] text-[36px] sm:text-[44px] md:text-[54px] max-w-[640px]">
              {copy.title}
            </h1>
            <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[560px]">{copy.lead}</p>

            <ul className="flex flex-col gap-2.5">
              {copy.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}>
                    <Check className="w-[13px] h-[13px]" strokeWidth={3} />
                  </span>
                  <span className="text-[15.5px] text-ink leading-[1.4]">{h}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={open}
                className="btn-primary btn-brand btn-sheen group relative flex items-center justify-center gap-2 h-12 px-7 rounded-full overflow-hidden"
              >
                <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.3px] whitespace-nowrap">{t.common.bookDemo}</span>
                <ArrowRight className="relative w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => openSpace(id)}
                className="btn-secondary relative flex items-center justify-center gap-2 h-12 px-7 rounded-full overflow-hidden border border-hairline-strong"
              >
                <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
                <MonitorPlay className="relative w-4 h-4" style={{ color: accent }} />
                <span className="relative text-ink font-medium text-[15.5px] tracking-[-0.3px] whitespace-nowrap">{t.workspace.open}</span>
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={2} variant="scale" className="w-full">
            <ModuleMock spec={copy.mock} accent={accent} Icon={Icon} />
          </FadeIn>
        </div>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}

/* ── Video ──────────────────────────────────────────────────────── */
function Video({ ctx, fileId }: { ctx: Ctx; fileId: string }) {
  const { id, name, accent, t } = ctx;
  /* Плеєр Google Drive не вантажимо, поки не натиснули «грати»: інакше кожне
     відкриття сторінки тягне чужі запити (і 401 у консоль) заради кадру, який
     ми й так маємо своєю картинкою. Так само зроблено на сторінці амбасадора. */
  const [playing, setPlaying] = useState(false);
  const poster = getModuleVideoPoster(id);
  const title = t.modulePage.videoTitle.replace("{name}", name);
  return (
    <section id="video" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading
          eyebrow={t.modulePage.videoEyebrow}
          title={t.modulePage.videoTitle.replace("{name}", name)}
          text={t.modulePage.videoText}
        />
        <FadeIn variant="scale" className="w-full">
          <div
            className="relative w-full max-w-[960px] mx-auto aspect-video overflow-hidden rounded-[20px] md:rounded-[28px] border border-hairline bg-ink shadow-[0_30px_60px_-40px_rgba(0,50,120,0.35)]"
            style={{ boxShadow: `0 30px 60px -40px color-mix(in oklab, ${accent} 45%, transparent)` }}
          >
            {playing || !poster ? (
              <iframe
                src={`https://drive.google.com/file/d/${fileId}/preview${playing ? "?autoplay=1" : ""}`}
                title={title}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={title}
                className="group absolute inset-0 w-full h-full cursor-pointer"
              >
                <Image src={poster} alt="" fill sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105"
                    style={{ background: accent }}
                  >
                    <Play className="w-7 h-7 fill-current translate-x-[1px]" strokeWidth={0} />
                  </span>
                </span>
              </button>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Features ─────────────────────────────────────────────────── */
/* One lead feature as a large tile, the rest as a divided list — so this
   section never reads as another grid of identical cards. */
function Features({ ctx }: { ctx: Ctx }) {
  const { name, accent, copy, t } = ctx;
  const [lead, ...rest] = copy.features;
  const LeadIcon = FEATURE_ICONS[lead.icon] ?? LayoutGrid;
  return (
    <section id="inside" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
        <SectionHeading align="left" eyebrow={t.modulePage.insideEyebrow} title={t.modulePage.insideTitle.replace("{name}", name)} />
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] gap-4 md:gap-6 items-stretch">
          <FadeIn variant="scale" className="h-full">
            <article
              className="h-full rounded-[24px] border border-hairline p-6 md:p-8 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              style={{ background: `linear-gradient(150deg, color-mix(in oklab, ${accent} 11%, var(--surface)), var(--surface) 62%)` }}
            >
              <span
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-hairline shrink-0"
                style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}
              >
                <LeadIcon className="w-7 h-7" strokeWidth={2} />
              </span>
              <div className="flex flex-col gap-2.5">
                <h3 className="font-semibold text-ink text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.6px]">{lead.title}</h3>
                <p className="text-[16px] md:text-[16.5px] text-ink-2 leading-[1.55]">{lead.text}</p>
              </div>
            </article>
          </FadeIn>

          <div className="rounded-[24px] border border-hairline bg-surface divide-y divide-hairline overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {rest.map((f, i) => {
              const Icon = FEATURE_ICONS[f.icon] ?? LayoutGrid;
              return (
                <FadeIn key={f.title} delay={i}>
                  <article className="flex gap-4 px-5 py-4 md:px-6 md:py-5 transition-colors duration-200 hover:bg-surface-2">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in oklab, ${accent} 12%, var(--surface))`, color: accent }}
                    >
                      <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                    </span>
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="font-semibold text-ink text-[16.5px] leading-[1.3] tracking-[-0.2px]">{f.title}</h3>
                      <p className="text-[14.5px] text-ink-2 leading-[1.5]">{f.text}</p>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────── */
function Steps({ ctx }: { ctx: Ctx }) {
  const { accent, copy, t } = ctx;
  return (
    <section id="how" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 lg:gap-14">
        <FadeIn className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-3">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>{t.modulePage.howEyebrow}</span>
          <h2 className="font-semibold text-ink text-[28px] md:text-[36px] leading-[1.12] tracking-[-0.9px]">{t.modulePage.howTitle}</h2>
          <p className="text-[15.5px] text-ink-2 leading-[1.55]">{t.modulePage.howText}</p>
        </FadeIn>

        <div className="relative flex flex-col gap-4">
          <span
            aria-hidden
            className="absolute left-[19px] top-8 bottom-8 w-[2px]"
            style={{ backgroundImage: "repeating-linear-gradient(to bottom, var(--hairline-strong) 0 6px, transparent 6px 12px)" }}
          />
          {copy.steps.map((step, i) => (
            <FadeIn key={step.title} delay={i}>
              <article className="flex items-start gap-4">
                <span
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[16px] shrink-0 border-4 border-surface"
                  style={{ background: accent }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 rounded-[16px] border border-hairline bg-surface-2 px-5 py-4 flex flex-col gap-1.5">
                  <h3 className="font-semibold text-ink text-[17px] leading-[1.3] tracking-[-0.25px]">{step.title}</h3>
                  <p className="text-[15px] text-ink-2 leading-[1.5]">{step.text}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Audience ────────────────────────────────────────────────── */
function Audience({ ctx }: { ctx: Ctx }) {
  const { copy, t } = ctx;
  return (
    <section id="who" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <SectionHeading align="left" eyebrow={t.modulePage.audienceEyebrow} title={t.modulePage.audienceTitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
          {copy.audience.map((a, i) => {
            const role = t.audience.roles.find((r) => r.id === a.role);
            const Icon = AUDIENCE_ROLE_ICONS[a.role];
            const c = AUDIENCE_ROLE_ACCENTS[a.role];
            return (
              <FadeIn key={a.role} delay={i}>
                {/* Ведемо на сторінку ролі, а не на якір у списку: блоки
                    ролей на /for-whom не мають id, тож якір падав на початок
                    сторінки, а окрема сторінка ролі вже є. */}
                <Link
                  href={`/for-whom/${a.role}`}
                  className="group flex items-center gap-4 rounded-[18px] bg-surface border border-hairline px-5 py-4 transition-colors duration-200 hover:border-hairline-strong hover:bg-surface-2"
                >
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${c} 14%, var(--surface))`, color: c }}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <h3 className="font-semibold text-ink text-[16px] leading-[1.3] tracking-[-0.2px]">{role?.name ?? a.role}</h3>
                    <p className="text-[14px] text-ink-2 leading-[1.45]">{a.text}</p>
                  </div>
                  <ArrowUpRight className="ml-auto w-4 h-4 text-ink-3 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn>
          <Link href="/for-whom" className="link-underline text-[15px] font-medium text-ink-2 hover:text-ink transition-colors">
            {t.modulePage.allRoles} →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────── */
function QaCard({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className="w-full text-left rounded-[16px] border border-hairline bg-surface px-5 py-4 md:px-6 md:py-5 flex flex-col transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-medium text-ink text-[16.5px] md:text-[17px] leading-[1.36] tracking-[-0.17px]">{q}</span>
        <span
          className="shrink-0 w-6 h-6 rounded-full bg-surface-3 border border-hairline flex items-center justify-center text-ink-2 mt-[1px] transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
        <div style={{ overflow: "hidden" }}>
          <p className="mt-3 text-[15.5px] text-ink-2 leading-[1.55]">{a}</p>
        </div>
      </div>
    </button>
  );
}

function Faq({ ctx }: { ctx: Ctx }) {
  const { copy, t } = ctx;
  return (
    <section id="faq" className="w-full flex flex-col items-center py-16 md:py-24 bg-surface border-y border-hairline scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 lg:gap-14">
        <FadeIn className="lg:sticky lg:top-36 lg:self-start flex flex-col gap-3">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.modulePage.faqEyebrow}</span>
          <h2 className="font-semibold text-ink text-[28px] md:text-[36px] leading-[1.12] tracking-[-0.9px]">{t.modulePage.faqTitle}</h2>
          <Link href="/faq" className="link-underline text-[15px] font-medium text-ink-2 hover:text-ink transition-colors w-fit">
            {t.nav.faq} →
          </Link>
        </FadeIn>
        <div className="flex flex-col gap-3">
          {copy.faq.map((item, i) => (
            <FadeIn key={item.q} delay={i}>
              <QaCard q={item.q} a={item.a} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Related ─────────────────────────────────────────────────── */
function Related({ ctx, related }: { ctx: Ctx; related: string[] }) {
  const { t } = ctx;
  const cards = related
    .map((rid) => {
      const found = findItem(t, rid);
      return found ? { rid, ...found } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  if (cards.length === 0) return null;

  return (
    <section className="w-full flex flex-col items-center py-16 md:py-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <SectionHeading align="left" eyebrow={t.modulePage.relatedEyebrow} title={t.modulePage.relatedTitle} text={t.modulePage.relatedText} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {cards.map(({ rid, group, item }, i) => {
            const Icon = MODULE_ICONS[rid] ?? LayoutGrid;
            const c = moduleAccent(rid, group.id);
            const href = hasModulePage(rid) ? `/modules/${rid}` : `/modules#m-${group.id}`;
            return (
              <FadeIn key={rid} delay={i}>
                <Link
                  href={href}
                  className="group flex items-center gap-3 rounded-[14px] bg-surface border border-hairline px-4 py-3 transition-colors duration-200 hover:border-hairline-strong hover:bg-surface-2"
                >
                  <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${c} 12%, var(--surface))`, color: c }}>
                    <Icon className="w-[17px] h-[17px]" strokeWidth={2} />
                  </span>
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-ink text-[15px] leading-none tracking-[-0.2px] truncate">{item.name}</span>
                    <span className="text-[12px] text-ink-3 leading-none">{group.title}</span>
                  </span>
                  <ArrowUpRight className="ml-auto w-4 h-4 text-ink-3 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn>
          <Link href="/modules" className="btn-secondary relative inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full overflow-hidden border border-hairline-strong">
            <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
            <LayoutGrid className="relative w-4 h-4 text-ink-2" />
            <span className="relative text-ink-2 font-medium text-[15px] tracking-[-0.3px]">{t.modulePage.allModules}</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Benefits (optional) ─────────────────────────────────────── */
function Benefits({ ctx }: { ctx: Ctx }) {
  const { accent, copy, t } = ctx;
  const b = copy.benefits;
  if (!b) return null;
  return (
    <section id="benefits" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-8 md:gap-10">
        <SectionHeading align="left" eyebrow={t.modulePage.benefitsEyebrow} title={b.title} text={b.text} />
        <FadeIn variant="scale">
          <div className="rounded-[20px] border border-hairline bg-surface overflow-hidden flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-hairline">
            {b.items.map((item) => (
              <div key={item.label} className="flex-1 px-5 py-5 md:px-6 md:py-6 flex flex-col gap-2">
                <span className="font-semibold leading-none tracking-[-1.2px] text-[34px] md:text-[40px] tabular-nums" style={{ color: accent }}>
                  {item.value}
                </span>
                <h3 className="font-semibold text-ink text-[15.5px] leading-[1.3] tracking-[-0.2px]">{item.label}</h3>
                <p className="text-[13.5px] text-ink-2 leading-[1.5]">{item.text}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Kanban path (optional) ─────────────────────────────────────── */
const STAGE_TONE: Record<Tone, string> = {
  brand: "var(--brand)",
  green: "#12a150",
  amber: "#f59e0b",
  red: "#f43f5e",
  violet: "#8b5bf0",
  neutral: "#94a3b8",
};

const STAGE_COLS: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

function Pipeline({ ctx }: { ctx: Ctx }) {
  const { accent, copy, t } = ctx;
  const p = copy.pipeline;
  if (!p) return null;
  const cols = STAGE_COLS[p.stages.length] ?? "lg:grid-cols-4";
  return (
    <section id="flow" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-[128px]">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.modulePage.pipelineEyebrow} title={p.title} text={p.text} />
        <div className={["grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5", cols].join(" ")}>
          {p.stages.map((stage, i) => {
            const c = STAGE_TONE[stage.tone ?? "brand"];
            const last = i === p.stages.length - 1;
            return (
              <FadeIn key={stage.title} delay={i} variant="scale" className="relative h-full">
                <article className="h-full rounded-[20px] bg-surface-2 border border-hairline p-2.5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2 px-2 pt-1.5">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c }} />
                      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-2 truncate">{stage.title}</span>
                    </span>
                    <span className="text-[12px] text-ink-3 tabular-nums shrink-0">{i + 1}/{p.stages.length}</span>
                  </div>
                  <div className="rounded-[14px] bg-surface border border-hairline p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ boxShadow: `inset 3px 0 0 ${c}` }}>
                    <p className="text-[14.5px] text-ink leading-[1.5]">{stage.text}</p>
                  </div>
                  {stage.auto && (
                    <div
                      className="rounded-[14px] border border-dashed p-4 flex items-start gap-2.5 mt-auto"
                      style={{ borderColor: `color-mix(in oklab, ${accent} 45%, var(--hairline-strong))`, background: `color-mix(in oklab, ${accent} 6%, var(--surface))` }}
                    >
                      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-[1px]" style={{ background: `color-mix(in oklab, ${accent} 16%, var(--surface))`, color: accent }}>
                        <Zap className="w-3.5 h-3.5" strokeWidth={2.4} />
                      </span>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: accent }}>{t.modulePage.pipelineAuto}</span>
                        <p className="text-[13.5px] text-ink-2 leading-[1.45]">{stage.auto}</p>
                      </div>
                    </div>
                  )}
                </article>
                {!last && (
                  <span aria-hidden className="hidden lg:flex absolute top-[18px] -right-[22px] z-10 w-6 h-6 rounded-full bg-surface border border-hairline items-center justify-center text-ink-3">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Section rail ─────────────────────────────────────────────── */
/* Sticky under the navbar: tells you what is on the page and where you are. */
function Rail({ items, accent }: { items: { id: string; label: string }[]; accent: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const railRef = useRef<HTMLDivElement>(null);
  const key = items.map((i) => i.id).join(",");

  useEffect(() => {
    const ids = key.split(",").filter(Boolean);
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => e !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -62% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  /* On a phone the rail scrolls sideways — follow the reading position inside
     the rail only, never with scrollIntoView (that would move the page too). */
  useEffect(() => {
    const i = key.split(",").indexOf(active);
    if (i >= 0) centerInRail(railRef.current, i, !prefersReducedMotion());
  }, [active, key]);

  return (
    <div className="sticky top-16 md:top-20 z-40 w-full border-b border-hairline bg-page/85 backdrop-blur-xl">
      {/* The chips run to the screen edge on a phone: the gutter is padding on
          the scroller, so the first and last chip are never half-cut. */}
      <div className="mx-auto w-full max-w-[1120px]">
        <div ref={railRef} className="no-scrollbar flex gap-1 overflow-x-auto py-2.5 px-5 md:px-8">
          {items.map((item) => {
            const on = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={[
                  "shrink-0 rounded-full px-3.5 py-1.5 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200",
                  on ? "text-white" : "text-ink-2 hover:text-ink hover:bg-surface-3",
                ].join(" ")}
                style={on ? { background: accent } : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function ModulePage({ id }: { id: string }) {
  const { lang } = useLang();
  const t = useT();
  const detail = getModule(id);
  if (!detail) return null;

  const found = findItem(t, id);
  const groupId = found?.group.id ?? detail.group;
  const groupTitle = found?.group.title ?? "";
  const name = found?.item.name ?? id;
  const accent = moduleAccent(id, groupId);
  const copy = detail.copy[lang];
  const ctx: Ctx = { id, name, accent, copy, t };
  const videoId = getModuleVideo(id);
  /* Набір команди на подію показуємо там, де про нього й питають — у плануванні служіння. */
  const needs = id === "service-planning";
  /* Демо, які раніше стояли на головній: там вони ставали черговим макетом
     поспіль, а тут — на своєму місці. */
  const ministriesDemo = id === "ministries";
  const groupsDemo = id === "groups";

  /* Only the sections this module actually has. */
  const rail = [
    { id: "inside", label: t.modulePage.insideEyebrow },
    ...(videoId ? [{ id: "video", label: t.modulePage.videoEyebrow }] : []),
    { id: "how", label: t.modulePage.howEyebrow },
    ...(needs ? [{ id: "needs", label: t.servicePlanning.needs.eyebrow }] : []),
    ...(copy.pipeline ? [{ id: "flow", label: t.modulePage.pipelineEyebrow }] : []),
    ...(copy.benefits ? [{ id: "benefits", label: t.modulePage.benefitsEyebrow }] : []),
    { id: "who", label: t.modulePage.audienceEyebrow },
    { id: "faq", label: t.modulePage.faqEyebrow },
  ];

  return (
    <>
      <Hero ctx={ctx} groupId={groupId} groupTitle={groupTitle} soon={found?.item.soon} />
      <Rail items={rail} accent={accent} />
      <Features ctx={ctx} />
      {videoId && <Video ctx={ctx} fileId={videoId} />}
      <Steps ctx={ctx} />
      {needs && <ServicePlanning onModulePage />}
      {ministriesDemo && <Ministries onModulePage />}
      {groupsDemo && <HomeGroups onModulePage />}
      {needs && <ServiceNeeds accent={accent} />}
      <Pipeline ctx={ctx} />
      <Benefits ctx={ctx} />
      <Audience ctx={ctx} />
      <Faq ctx={ctx} />
      <Related ctx={ctx} related={detail.related} />
    </>
  );
}
