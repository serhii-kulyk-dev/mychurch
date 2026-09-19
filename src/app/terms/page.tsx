import type { Metadata } from "next";
import LegalPage from "@/components/sections/legal-page";
import { TERMS_COPY } from "@/content/legal";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: TERMS_COPY.ua.seoTitle,
  description: TERMS_COPY.ua.seoDescription,
  path: "/terms",
  keywords: ["умови використання", "договір оферти", "правила користування системою для церкви"],
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema([{ name: "Умови використання", path: "/terms" }]))} />
      <LegalPage copy={TERMS_COPY} />
    </>
  );
}
