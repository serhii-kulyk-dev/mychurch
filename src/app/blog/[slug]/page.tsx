import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/navbar";
import BlogPostPage from "@/components/sections/blog-post";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { BLOG_CATEGORIES, BLOG_COPY, BLOG_SLUGS, getPost, postWordCount } from "@/content/blog";
import { articleSchema, breadcrumbSchema, faqSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

/* Одна статична сторінка на статтю; невідомі адреси — 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

/* Обкладинка статті — src/app/blog/[slug]/opengraph-image.tsx.
   Ту саму адресу віддаємо і в Open Graph, і в розмітку BlogPosting. */
function postImage(slug: string, title: string) {
  return {
    url: `/blog/${slug}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: `${title} — блог MyChurch`,
  };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const copy = post.copy.ua;
  return pageMeta({
    title: copy.seoTitle,
    description: copy.seoDescription,
    path: `/blog/${post.slug}`,
    keywords: copy.keywords,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    image: postImage(post.slug, copy.title),
  });
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const copy = post.copy.ua;
  const category = BLOG_CATEGORIES.ua.find((c) => c.id === post.category);

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd
          data={graph(
            articleSchema({
              title: copy.seoTitle,
              description: copy.seoDescription,
              path: `/blog/${post.slug}`,
              published: post.date,
              modified: post.updated,
              keywords: copy.keywords,
              section: category?.title ?? "",
              wordCount: postWordCount(post, "ua"),
              image: postImage(post.slug, copy.title),
            }),
            faqSchema(copy.faq.map((item) => ({ question: item.q, answer: item.a }))),
            breadcrumbSchema([
              { name: BLOG_COPY.ua.post.breadcrumbBlog, path: "/blog" },
              { name: copy.title, path: `/blog/${post.slug}` },
            ])
          )}
        />
        <BlogPostPage slug={post.slug} />
      </main>
      <Footer />
    </>
  );
}
