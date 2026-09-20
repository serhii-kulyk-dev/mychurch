import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/navbar";
import AmbassadorPage from "@/components/sections/ambassador-page";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { AMBASSADOR_IDS, getAmbassador } from "@/content/ambassadors";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { i18n } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

/* One static page per ambassador church; unknown slugs 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return AMBASSADOR_IDS.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const church = getAmbassador(slug);
  if (!church) return {};
  /* Metadata is server-rendered; Ukrainian is the site default, matching the other pages. */
  return pageMeta({
    title: church.copy.ua.seoTitle,
    description: church.copy.ua.seoDescription,
    path: `/ambassadors/${slug}`,
  });
}

export default async function AmbassadorDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const church = getAmbassador(slug);
  if (!church) notFound();

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd
          data={graph(
            breadcrumbSchema([{ name: i18n.ua.nav.ambassadors, path: `/ambassadors/${slug}` }])
          )}
        />
        <AmbassadorPage id={slug} />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
