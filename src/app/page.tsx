import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/hero";
import Capabilities from "@/components/sections/capabilities";
import Features from "@/components/sections/features";
import Automations from "@/components/sections/automations";
import ForWhom from "@/components/sections/for-whom";
import Pocket from "@/components/sections/pocket";
import Integrations from "@/components/sections/integrations";
import Proof from "@/components/sections/proof";
import ChurchBrief from "@/components/sections/church-brief";
import { BuilderProvider } from "@/context/builder-context";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { graph, softwareSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Єдиний простір для обліку людей, груп і служінь у церкві",
  description:
    "Люди, сім'ї, малі групи, служіння, події, відвідуваність та заявки — в одному місці. Українською, з ботом у Telegram і впровадженням разом з вашою командою.",
  path: "/",
  keywords: [
    "система управління церквою",
    "програма для церкви",
    "облік членів церкви",
    "облік відвідуваності в церкві",
    "малі групи облік",
  ],
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd data={graph(softwareSchema())} />
        <Hero />
        <Features />
        {/* Телеграм і телефон одразу після огляду: більшість церков живе в
            чаті, тож показуємо це раніше за все інше. */}
        <Integrations />
        <Pocket />
        <Automations />
        {/* Переписка з асистентом поки не на головній: сам помічник ще не
            в руках у церков, тож не обіцяємо його першим екраном. Блок цілий
            у components/sections/assistant.tsx — повернути = вписати рядок
            назад. Повна сторінка лишається за /ai. */}
        <ForWhom />
        <Proof />
        {/* «Було — стало» знято з головної 2026-09-21: той самий вибір
            болів тепер стоїть чипами всередині форми знайомства нижче.
            Компонент живий у components/sections/solved.tsx. */}
        {/* «Розкажіть про церкву» — та сама форма, що й на /modules. */}
        <BuilderProvider>
          <ChurchBrief />
        </BuilderProvider>
        <Cta rollout />
        {/* Каталог модулів — у самому низу, після закривашки: це вже не
            аргумент, а довідка про широту системи для тих, хто догортав. */}
        <Capabilities />
      </main>
      <Footer />
    </>
  );
}
