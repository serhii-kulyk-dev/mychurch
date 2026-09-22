"use client";

import Image from "next/image";
import FadeIn from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

/* ────────────────────────────────────────────────────────────────
   Шапка «Про нас»: слова і печатка походження.

   До 2026-09-22 тут крутився журнал явки — екран продукту. Але на цій
   сторінці доводити треба не функцію, а звідки система взялась, тож
   демо прибрано, а його місце зайняла печатка: напис їде по кільцю,
   усередині — наш словесний логотип, а рядок стоїть поруч. Абстрактний
   знак у середину не ставимо: там наше ім'я, написане словами.

   Той самий рядок раніше був тихою смугою в кінці «Як це починалось».
   Двічі на одній сторінці він не потрібен, тож звідти його прибрано.
   ──────────────────────────────────────────────────────────────── */

/* Кільце напису в системі viewBox 200×200: радіус і його довжина.
   `textLength` саме по ній розганяє літери — фраза замикається в коло
   незалежно від шрифта й мови. */
const RING_R = 82;
const RING_LEN = 2 * Math.PI * RING_R;
const RING_ID = "about-seal-ring";

function Seal({ caption }: { caption: string }) {
  return (
    <div className="relative w-[178px] h-[178px] md:w-[206px] md:h-[206px] shrink-0">
      {/* У кільці фраза стоїть двічі й читалка озвучила б її двічі, тож
          сама графіка схована, а рядок під неї — один. */}
      <span className="sr-only">{caption.split("·")[0].trim()}.</span>

      {/* Обертається тільки кільце — те, що всередині, стоїть.
          Глобальне правило prefers-reduced-motion зупиняє його само. */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full text-brand"
        style={{ animation: "gradientSpin 72s linear infinite" }}
        aria-hidden
      >
        <defs>
          <path
            id={RING_ID}
            fill="none"
            d={`M100 100 m-${RING_R} 0 a${RING_R} ${RING_R} 0 1 1 ${RING_R * 2} 0 a${RING_R} ${RING_R} 0 1 1 -${RING_R * 2} 0`}
          />
        </defs>
        <text className="uppercase" fill="currentColor" fontSize="10.5" fontWeight={600} opacity="0.62">
          <textPath href={`#${RING_ID}`} startOffset="0" textLength={RING_LEN} lengthAdjust="spacing">
            {caption}
          </textPath>
        </text>
      </svg>

      {/* Готовий ассет бренду: напис уже вписано в коло, тож квадрат
          ріжеться по колу без утрат. */}
      <span aria-hidden className="absolute inset-[24px] md:inset-[28px] rounded-full overflow-hidden">
        <Image src="/brand/telegram-avatar.png" alt="" fill sizes="160px" className="object-cover" />
      </span>
    </div>
  );
}

export default function AboutHero() {
  const t = useT().about.hero;

  return (
    <section className="relative w-full overflow-hidden bg-surface flex flex-col items-center pt-14 md:pt-24 pb-14 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="aurora-a absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--glow), transparent 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1120px] px-5 md:px-8 flex flex-col items-center gap-11 md:gap-14">
        <FadeIn className="flex flex-col items-center gap-4 text-center">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">{t.eyebrow}</span>
          <h1 className="font-semibold text-ink leading-[1.08] tracking-[-1.2px] md:tracking-[-2px] text-[36px] sm:text-[46px] md:text-[58px] max-w-[860px]">
            {t.title}
          </h1>
          <p className="text-[17px] md:text-[19px] text-ink-2 leading-[1.55] max-w-[620px]">{t.text}</p>
        </FadeIn>

        {/* Печатка і рядок поруч — підпис під шапкою, а не ще один блок. */}
        <FadeIn
          delay={2}
          variant="scale"
          className="flex flex-col sm:flex-row items-center gap-6 sm:gap-9 md:gap-11 max-w-[640px] text-center sm:text-left"
        >
          <Seal caption={t.seal} />
          <p className="text-[16.5px] md:text-[18px] text-ink leading-[1.5]">{t.insider}</p>
        </FadeIn>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-page to-transparent" />
    </section>
  );
}
