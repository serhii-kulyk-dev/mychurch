import type { Metadata } from "next";
import LegalPage from "@/components/sections/legal-page";
import { PRIVACY_COPY } from "@/content/legal";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: PRIVACY_COPY.ua.seoTitle,
  description: PRIVACY_COPY.ua.seoDescription,
  path: "/privacy",
  keywords: ["політика конфіденційності", "захист персональних даних церкви", "обробка персональних даних церкви"],
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema([{ name: "Політика конфіденційності", path: "/privacy" }]))} />
      <LegalPage copy={PRIVACY_COPY} />
    </>
  );
}
