import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import SupportHero from "@/components/sections/support-hero";
import SupportChannels from "@/components/sections/support-channels";
import SupportFlow from "@/components/sections/support-flow";
import SupportCare from "@/components/sections/support-care";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import { SUPPORT_COPY } from "@/content/support";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, contactPageSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: SUPPORT_COPY.ua.seoTitle,
  description: SUPPORT_COPY.ua.seoDescription,
  path: "/support",
  keywords: ["підтримка «Моєї Церкви»", "допомога з системою для церкви", "час відповіді підтримки"],
});

/* Канали в розмітці — ті самі, що в блоці «Куди писати»: беремо їх
   з того самого джерела, щоб пошук ніколи не бачив того, чого немає
   на екрані. Спільний чат команди адреси не має, тому в схему не йде. */
const channels = SUPPORT_COPY.ua.channels.items;
const telegram = channels.find((i) => i.id === "telegram");
const mail = channels.find((i) => i.id === "mail");
const phone = channels.find((i) => i.id === "phone");

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd
          data={graph(
            breadcrumbSchema([{ name: "Підтримка", path: "/support" }]),
            contactPageSchema({
              name: SUPPORT_COPY.ua.seoTitle,
              description: SUPPORT_COPY.ua.seoDescription,
              path: "/support",
              points: [
                { contactType: "technical support", url: telegram?.href },
                { contactType: "customer support", email: mail?.handle },
                {
                  contactType: "customer support",
                  telephone: phone?.handle,
                  hours: {
                    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    opens: "09:00",
                    closes: "18:00",
                  },
                },
              ],
            })
          )}
        />
        <SupportHero />
        <SupportChannels />
        <SupportFlow />
        <SupportCare />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
