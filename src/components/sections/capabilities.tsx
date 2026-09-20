"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import { MODULE_ICONS, moduleAccent } from "@/components/shared/module-icons";
import { hasModulePage } from "@/content/modules/ids";
import { useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   The whole module catalogue as two counter-scrolling rows of chips,
   coloured by group. Reads as breadth ("35+ modules") instead of six
   identical cards; pauses on hover, static under reduced motion.
   ──────────────────────────────────────────────────────────────── */

interface Chip {
  id: string;
  name: string;
  group: string;
}

function Row({ chips, reverse }: { chips: Chip[]; reverse?: boolean }) {
  const track = [...chips, ...chips];
  return (
    <div className="marquee">
      <div className={reverse ? "marquee-track marquee-track--reverse" : "marquee-track"}>
        {track.map((c, i) => {
          const Icon = MODULE_ICONS[c.id];
          const accent = moduleAccent(c.id, c.group);
          const inner = (
            <>
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in oklab, ${accent} 14%, var(--surface))`, color: accent }}
              >
                {Icon && <Icon className="w-[15px] h-[15px]" strokeWidth={2} />}
              </span>
              <span className="text-[14px] font-medium text-ink leading-none tracking-[-0.15px] whitespace-nowrap">
                {c.name}
              </span>
            </>
          );
          const cls =
            "chip-module inline-flex items-center gap-2.5 rounded-full bg-surface border border-hairline pl-1.5 pr-4 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]";
          return hasModulePage(c.id) ? (
            /* Дубль стрічки лише для безшовної прокрутки: він прихований від
               скрінрідера, тож має випасти і з порядку табуляції. */
            <Link
              key={`${c.id}-${i}`}
              href={`/modules/${c.id}`}
              className={cls}
              aria-hidden={i >= chips.length}
              tabIndex={i >= chips.length ? -1 : undefined}
            >
              {inner}
            </Link>
          ) : (
            <span key={`${c.id}-${i}`} className={cls} aria-hidden={i >= chips.length}>
              {inner}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Capabilities() {
  const t = useT();
  const chips: Chip[] = t.modules.groups.flatMap((g) =>
    g.items.filter((m) => !("soon" in m && m.soon)).map((m) => ({ id: m.id, name: m.name, group: g.id }))
  );
  /* Deal chips alternately so each row mixes groups and colours. */
  const rowA = chips.filter((_, i) => i % 2 === 0);
  const rowB = chips.filter((_, i) => i % 2 === 1);

  return (
    <section className="w-full flex flex-col items-center pt-4 pb-16 md:pb-24 bg-page overflow-hidden">
      <FadeIn className="text-center mb-8 md:mb-10 px-5">
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-3">
          {t.capabilities.caption}
        </p>
      </FadeIn>

      <FadeIn delay={1} className="w-full flex flex-col gap-3">
        <Row chips={rowA} />
        <Row chips={rowB} reverse />
      </FadeIn>

      <FadeIn delay={2} className="mt-8 md:mt-10 px-5">
        <Link
          href="/modules"
          className="group inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14px] font-medium text-ink-2 hover:text-ink transition-colors"
        >
          <span className="font-semibold text-ink">{t.capabilities.count}</span>
          <span aria-hidden className="w-1 h-1 rounded-full bg-ink-3" />
          <span>{t.capabilities.all}</span>
          <ArrowRight className="w-4 h-4 text-brand transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </FadeIn>
    </section>
  );
}
