"use client";

import FadeIn from "@/components/shared/fade-in";
import SectionHeading from "@/components/shared/section-heading";
import AmbassadorCard from "@/components/shared/ambassador-card";
import { hasAmbassadorPage } from "@/content/ambassadors";
import { useT } from "@/lib/lang";

/* Амбасадор на /about — та сама картка, що й у кінці сторінки самої
   церкви (`shared/ambassador-card.tsx`): кадр із життя громади, короткий
   рядок про неї і скільки ми разом. Тут головна дія — сторінка церкви,
   а її сайт лишається тихим лінком. Своя верстка з логотипом і табличкою
   фактів була третім виглядом тієї самої церкви, тож її прибрано. */

export default function AboutAmbassadors() {
  const t = useT().about.ambassadors;
  const first = t.items[0];
  if (!first) return null;

  return (
    <section className="w-full flex flex-col items-center bg-page py-16 md:py-24">
      <div className="w-full max-w-[1120px] px-5 md:px-8 flex flex-col gap-10 md:gap-14">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} text={t.text} />

        <FadeIn variant="scale">
          <AmbassadorCard
            id={first.id}
            pageHref={hasAmbassadorPage(first.id) ? `/ambassadors/${first.id}` : undefined}
            pageCta={t.profileCta}
          />
        </FadeIn>
      </div>
    </section>
  );
}
