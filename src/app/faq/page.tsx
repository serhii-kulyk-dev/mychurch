import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import Faq from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { i18n } from "@/lib/i18n";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Питання та відповіді про систему для церкви — Моя Церква",
  description:
    "Відповіді на поширені запитання: облік людей і відвідуваності, ролі та доступи, безпека даних, інтеграції, оновлення та підтримка «Моєї Церкви».",
  path: "/faq",
  keywords: ["питання про систему для церкви", "як працює Моя Церква", "безпека даних церкви", "підтримка"],
});

/* Розмітка FAQ будується з тих самих питань, які людина бачить на сторінці. */
const FAQ_ITEMS = i18n.ua.faq.categories.flatMap((category) =>
  category.items.map((item) => ({ question: item.question, answer: item.answer }))
);

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(faqSchema(FAQ_ITEMS), breadcrumbSchema([{ name: "Питання та відповіді", path: "/faq" }]))} />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
