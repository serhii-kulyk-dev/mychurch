import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/navbar";
import ModulePage from "@/components/sections/module-page";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import { MODULE_IDS, getModule } from "@/content/modules";
import JsonLd from "@/components/shared/json-ld";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

/* One static page per module; unknown slugs 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return MODULE_IDS.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const detail = getModule(slug);
  if (!detail) return {};
  /* Metadata is server-rendered; Ukrainian is the site default, matching the other pages. */
  return pageMeta({
    title: detail.copy.ua.seoTitle,
    description: detail.copy.ua.seoDescription,
    path: `/modules/${slug}`,
  });
}

export default async function ModuleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const detail = getModule(slug);
  if (!detail) notFound();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd
          data={graph(
            breadcrumbSchema([
              { name: "Модулі", path: "/modules" },
              { name: detail.copy.ua.title, path: `/modules/${slug}` },
            ])
          )}
        />
        <ModulePage id={slug} />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
