import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import Footer from "@/components/sections/footer";
import OfflineState from "@/components/sections/offline-state";
import { pageMeta } from "@/lib/seo";

/* Службова сторінка: пошуку вона не потрібна, тому noIndex. У карті сайту
   її теж немає — на неї потрапляють лише тоді, коли обірвався зв'язок. */
export const metadata: Metadata = pageMeta({
  title: "Зв'язок втрачено — Моя Церква",
  description:
    "Немає з'єднання з інтернетом: сторінка не завантажилась. Перевірте мережу — щойно зв'язок повернеться, «Моя Церква» відкриється знову.",
  path: "/offline",
  noIndex: true,
});

export default function OfflinePage() {
  return (
    <>
      <Navbar />
      <OfflineState />
      <Footer />
    </>
  );
}
