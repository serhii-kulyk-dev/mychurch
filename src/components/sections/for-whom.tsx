"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/fade-in";
import AnimatedHeadline, { countWords, useHeadlineStage } from "@/components/shared/animated-headline";
import DeskStage from "@/components/shared/desk-stage";
import { ROLE_ICONS, ROLE_ACCENTS } from "@/components/shared/role-icons";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { useT } from "@/lib/lang";

/* Три панелі встигають догратися лише за такий такт — інакше склад сцени
   міняється посеред чужого кліку. */
const CYCLE_MS = 9000;

/* Головна, «Для кого»: один робочий простір церкви, у якому три ролі
   працюють одночасно. Сцена перебирає ролі сама, поки відвідувач не обере
   свою — нічого не запам'ятовується, решта сайту не змінюється.

   Блок навмисно голий: заголовок, вікно і вихід. Усе, що колись стояло під
   вікном — переваги ролі й чипи модулів — переказувало словами те саме, що
   видно на екрані, тож поїхало на сторінку ролі. */
export default function ForWhom() {
  const t = useT().audience;
  const hostRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const headStage = useHeadlineStage(countWords(t.titleLines, t.titleAccent), headRef);
  const [auto, setAuto] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  const active = picked ?? auto;
  const touched = picked !== null;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || touched || prefersReducedMotion()) return;
    const id = setInterval(() => setAuto((i) => (i + 1) % t.roles.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [inView, touched, t.roles.length]);

  const role = t.roles[active];
  const accent = ROLE_ACCENTS[role.id];
  const ActiveIcon = ROLE_ICONS[role.id];

  return (
    <section id="for-whom" className="w-full flex flex-col items-center py-16 md:py-24 scroll-mt-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        {/* Заголовок набирається по словах, коли розділ доходить до екрана. */}
        <div ref={headRef} className="flex justify-center text-center">
          <AnimatedHeadline
            as="h2"
            lines={t.titleLines}
            accent={t.titleAccent}
            stage={headStage}
            className="font-semibold text-ink text-[30px] md:text-[44px] leading-[1.12] tracking-[-1px] md:tracking-[-1.6px] max-w-[760px]"
          />
        </div>

        <FadeIn variant="scale">
          <div ref={hostRef}>
            <DeskStage active={active} onPick={setPicked} auto={!touched} cycle={CYCLE_MS} />
          </div>
        </FadeIn>

        {/* Під вікном — тільки вихід: у роль, яка зараз на екрані, і до решти.
            На телефоні вихід у роль уже стоїть кнопкою під її карткою — тут
            лишається сама «Уся церква». */}
        <div className="-mt-2 md:-mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Link
            key={role.id}
            href={`/for-whom/${role.id}`}
            className="reveal is-visible group hidden lg:inline-flex items-center gap-2.5 text-[14.5px] font-semibold"
            style={{ color: accent }}
          >
            <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ background: accent }}>
              <ActiveIcon className="w-[15px] h-[15px]" strokeWidth={2.2} />
            </span>
            {t.more}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link href="/for-whom" className="group inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ink-2 hover:text-ink transition-colors">
            {t.allRoles}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
