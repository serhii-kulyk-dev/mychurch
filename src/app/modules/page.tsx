import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import ModulesHero from "@/components/sections/modules-hero";
import ModulesMap from "@/components/sections/modules-map";
import ModulesGrid from "@/components/sections/modules-grid";
import ModuleBuilder from "@/components/sections/module-builder";
import ChurchBrief from "@/components/sections/church-brief";
import { BuilderProvider } from "@/context/builder-context";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Модулі для церкви — люди, групи, служіння, події, аналітика",
  description:
    "Усі модулі «Моєї Церкви»: облік людей і сімей, малі групи, служіння та графіки, події, заявки, HR, інтеграції, Telegram-бот і ШІ-помічник. Вмикайте лише потрібне.",
  path: "/modules",
  keywords: ["модулі для церкви", "облік людей у церкві", "малі групи", "планування служінь", "церковна аналітика"],
});

export default function ModulesPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "Модулі", path: "/modules" }]))} />
        <ModulesHero>
          <ModulesMap bare />
        </ModulesHero>
        <ModulesGrid />
        <BuilderProvider>
          <ModuleBuilder />
          <ChurchBrief />
        </BuilderProvider>
        <Cta />
      </main>
      <Footer />
    </>
  );
}
