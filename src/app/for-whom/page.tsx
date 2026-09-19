import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import { AudienceHero } from "@/components/sections/audience-page";
import AudienceStage from "@/components/sections/audience-stage";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Для кого «Моя Церква» — пастор, лідер, служитель, адміністратор",
  description:
    "Що бачить і що може кожна роль у церкві: пастор, лідер малої групи, служитель, відвідувач, член церкви, HR, бухгалтер і рецепція.",
  path: "/for-whom",
  keywords: ["система для пастора", "кабінет лідера групи", "ролі в церковній системі", "доступи в церкві"],
});

export default function ForWhomPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Для кого", path: "/for-whom" }]))} />
        <AudienceHero />
        <AudienceStage />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
