import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import ImportHero from "@/components/sections/import-hero";
import ImportSources from "@/components/sections/import-sources";
import ImportMapping from "@/components/sections/import-mapping";
import ImportLinks from "@/components/sections/import-links";
import ImportReview from "@/components/sections/import-review";
import ImportAfter from "@/components/sections/import-after";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import { IMPORT_COPY } from "@/content/import";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: IMPORT_COPY.ua.seoTitle,
  description: IMPORT_COPY.ua.seoDescription,
  path: "/import",
  keywords: ["імпорт даних церкви", "перенести базу з Excel", "імпорт з Google Таблиць"],
});

export default function ImportPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Імпорт", path: "/import" }]))} />
        <ImportHero />
        <ImportSources />
        <ImportMapping />
        <ImportLinks />
        <ImportReview />
        <ImportAfter />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
