import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import ConsultingHero from "@/components/sections/consulting-hero";
import ConsultingProcess from "@/components/sections/consulting-process";
import ConsultingScope from "@/components/sections/consulting-scope";
import ConsultingOffer from "@/components/sections/consulting-offer";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Консалтинг для церкви — аудит процесів і впровадження",
  description:
    "Консалтинг «Моєї Церкви»: аудит процесів, план впровадження, перенесення даних і навчання команди. Безкоштовно до 1 листопада.",
  path: "/consulting",
  keywords: ["консалтинг для церкви", "впровадження системи в церкві", "аудит церковних процесів"],
});

export default function ConsultingPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Консалтинг", path: "/consulting" }]))} />
        <ConsultingHero />
        <ConsultingProcess />
        <ConsultingScope />
        <ConsultingOffer />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
