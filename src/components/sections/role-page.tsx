"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import RoleScreen from "@/components/shared/role-screen";
import CursorDemo from "@/components/shared/cursor-demo";
import { ROLE_ICONS, ROLE_ACCENTS, ROLE_CAP_ICONS } from "@/components/shared/role-icons";
import { useDemoModal } from "@/context/demo-modal-context";
import { useT } from "@/lib/lang";
import { moduleHrefByName } from "@/content/modules/ids";

export default function RolePage({ roleId }: { roleId: string }) {
  const all = useT();
  const t = all.audience;
  const role = t.roles.find((r) => r.id === roleId) ?? t.roles[0];
  const Icon = ROLE_ICONS[role.id];
  const accent = ROLE_ACCENTS[role.id];
  const capIcons = ROLE_CAP_ICONS[role.id] ?? [];
  const { open } = useDemoModal();
  /* The hero screen demonstrates itself on a loop: every replay re-mounts the
     screen (fresh entrance, buttons back to their starting state). */
  const [run, setRun] = useState(0);

  return (
    <>
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-12 md:pt-20 pb-14 md:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="aurora-a absolute -top-[280px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-70" style={{ background: `radial-gradient(closest-side, color-mix(in oklab, ${accent} 24%, transparent), transparent 100%)` }} />
        </div>
        <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-10 lg:gap-14 items-center">
          <FadeIn className="flex flex-col gap-5">
            <Link href="/for-whom" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink-3 hover:text-ink transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t.allRoles}
            </Link>
            <span className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: accent, color: "#fff" }}>
              <Icon className="w-7 h-7" strokeWidth={2} />
            </span>
            <h1 className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-1.8px] text-[36px] sm:text-[44px] md:text-[54px]">{role.name}</h1>
            <p className="text-[19px] md:text-[21px] font-medium text-ink leading-[1.4]">{role.tagline}</p>
            <p className="text-[16.5px] md:text-[17.5px] text-ink-2 leading-[1.55] max-w-[560px]">{role.description}</p>
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
              <button onClick={open} className="btn-primary btn-brand group relative inline-flex items-center justify-center gap-2 h-[50px] px-7 rounded-full overflow-hidden">
                <span className="relative text-white font-semibold text-[15.5px] tracking-[-0.3px] whitespace-nowrap">{all.common.bookDemo}</span>
                <ArrowRight className="relative w-[16px] h-[16px] text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </FadeIn>
          <FadeIn delay={2} variant="scale" className="flex justify-center lg:justify-end">
            <CursorDemo
              playKey={`${role.id}-${run}`}
              startDelay={1500}
              onDone={() => setRun((r) => r + 1)}
              className="w-full flex justify-center lg:justify-end"
            >
              <RoleScreen key={`run-${run}`} role={role} large />
            </CursorDemo>
          </FadeIn>
        </div>
        <div aria-hidden className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-page to-transparent" />
      </section>

      {/* Capabilities */}
      <section className="w-full flex flex-col items-center py-16 md:py-24">
        <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-12">
          <FadeIn className="flex flex-col items-center gap-3 text-center">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>{t.eyebrow}</span>
            <h2 className="font-semibold text-ink text-[30px] md:text-[42px] leading-[1.12] tracking-[-1px] md:tracking-[-1.5px]">{t.capsTitle.replace("{role}", role.name)}</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {role.capabilities.map((c, i) => {
              const CIcon = capIcons[i] ?? Icon;
              return (
                <FadeIn key={c.title} delay={i % 3} variant="scale" className="h-full">
                  <article className="hover-lift h-full rounded-[20px] bg-surface border border-hairline p-6 flex flex-col gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}>
                      <CIcon className="w-[22px] h-[22px]" strokeWidth={2} />
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-semibold text-ink text-[18px] leading-[1.3] tracking-[-0.3px]">{c.title}</h3>
                      <p className="text-[15px] text-ink-2 leading-[1.5]">{c.text}</p>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn className="flex flex-col gap-3 items-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.modulesTitle}</span>
            <div className="flex flex-wrap justify-center gap-2">
              {role.modules.map((m) => (
                <Link key={m} href={moduleHrefByName(all.modules.groups, m)} className="rounded-full bg-surface border border-hairline px-4 py-2 text-[13.5px] font-medium text-ink-2 hover:text-ink hover:border-hairline-strong transition-colors">{m}</Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Other roles */}
      <section className="w-full flex flex-col items-center pb-8 md:pb-12">
        <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-5">
          <FadeIn><span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t.otherRoles}</span></FadeIn>
          <div className="flex flex-wrap gap-2">
            {t.roles.filter((r) => r.id !== role.id).map((r, i) => {
              const RIcon = ROLE_ICONS[r.id];
              const a = ROLE_ACCENTS[r.id];
              return (
                <FadeIn key={r.id} delay={i % 4}>
                  <Link href={`/for-whom/${r.id}`} className="hover-lift inline-flex items-center gap-2.5 rounded-full bg-surface border border-hairline pl-1.5 pr-4 py-1.5 text-[14px] font-medium text-ink">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `color-mix(in oklab, ${a} 14%, var(--surface))`, color: a }}>
                      <RIcon className="w-4 h-4" strokeWidth={2.2} />
                    </span>
                    {r.name}
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
