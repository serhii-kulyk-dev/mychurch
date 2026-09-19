import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar";
import BlogIndex from "@/components/sections/blog-index";
import Cta from "@/components/sections/cta";
import Footer from "@/components/sections/footer";
import JsonLd from "@/components/shared/json-ld";
import { BLOG_COPY, BLOG_POSTS } from "@/content/blog";
import { blogSchema, breadcrumbSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

/* Метадані та розмітка — українською: це мова сайту за замовчуванням,
   як і на решті сторінок. */
export const metadata: Metadata = pageMeta({
  title: BLOG_COPY.ua.seoTitle,
  description: BLOG_COPY.ua.seoDescription,
  path: "/blog",
  keywords: BLOG_COPY.ua.seoKeywords,
});

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex flex-col items-center bg-page">
        <JsonLd
          data={graph(
            blogSchema(BLOG_POSTS.map((p) => ({ title: p.copy.ua.title, path: `/blog/${p.slug}` }))),
            breadcrumbSchema([{ name: BLOG_COPY.ua.post.breadcrumbBlog, path: "/blog" }])
          )}
        />
        <BlogIndex />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
