import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import AiHero from "@/components/sections/ai-hero";
import AiScenarios from "@/components/sections/ai-scenarios";
import AiChatWatcher from "@/components/sections/ai-chat-watcher";
import AiTryIt from "@/components/sections/ai-try-it";
import AiPersona from "@/components/sections/ai-persona";
import AiTrust from "@/components/sections/ai-trust";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "ШІ-помічник для церкви — асистент у Telegram і застосунку",
  description:
    "Помічник знає базу вашої церкви: знаходить тих, хто зник, збирає зміну на неділю, бронює зали й нагадує тим, хто не відповів. Ви лише підтверджуєте.",
  path: "/ai",
  keywords: ["ШІ-помічник для церкви", "асистент у Telegram", "автоматизація церкви", "розумний помічник лідера"],
});

export default function AiPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(breadcrumbSchema([{ name: "ШІ-помічник", path: "/ai" }]))} />
        <AiHero />
        <AiScenarios />
        <AiChatWatcher />
        <AiTryIt />
        <AiPersona />
        <AiTrust />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
