import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import Hero from "@/components/sections/hero";
import Capabilities from "@/components/sections/capabilities";
import Solved from "@/components/sections/solved";
import Features from "@/components/sections/features";
import ServicePlanning from "@/components/sections/service-planning";
import Automations from "@/components/sections/automations";
import Assistant from "@/components/sections/assistant";
import ForWhom from "@/components/sections/for-whom";
import Integrations from "@/components/sections/integrations";
import Proof from "@/components/sections/proof";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { graph, softwareSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Моя Церква — система управління церквою: облік людей і служінь",
  description:
    "Досягай людей. Українська система обліку та управління церквою: люди, сім'ї, малі групи, служіння, події, відвідуваність, заявки й аналітика в одному просторі.",
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
        <Capabilities />
        <Features />
        <ServicePlanning />
        <Automations />
        <Assistant />
        <ForWhom />
        <Integrations />
        <Solved />
        <Proof />
        <Cta rollout />
      </main>
      <Footer />
    </>
  );
}
