import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import ComparePage from "@/components/sections/compare-page";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { COMPARE_COPY } from "@/content/compare";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: COMPARE_COPY.ua.seoTitle,
  description: COMPARE_COPY.ua.seoDescription,
  path: "/compare",
  noIndex: true,
  keywords: [
    "порівняння систем для церкви",
    "аналог Planning Center українською",
    "Breeze альтернатива",
    "замість Google Таблиць у церкві",
  ],
});

export default function Compare() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: COMPARE_COPY.ua.navLabel, path: "/compare" }]))} />
        <ComparePage />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
