import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import SupportHero from "@/components/sections/support-hero";
import SupportChannels from "@/components/sections/support-channels";
import SupportFlow from "@/components/sections/support-flow";
import SupportCare from "@/components/sections/support-care";
import SupportSelf from "@/components/sections/support-self";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import { SUPPORT_COPY } from "@/content/support";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: SUPPORT_COPY.ua.seoTitle,
  description: SUPPORT_COPY.ua.seoDescription,
  path: "/support",
  keywords: ["підтримка MyChurch", "допомога з системою для церкви", "час відповіді підтримки"],
});

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Підтримка", path: "/support" }]))} />
        <SupportHero />
        <SupportChannels />
        <SupportFlow />
        <SupportCare />
        <SupportSelf />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
