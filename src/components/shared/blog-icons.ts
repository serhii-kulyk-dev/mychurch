import { BarChart3, Bot, Database, HeartHandshake, ListChecks, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BlogCategoryId } from "@/content/blog/types";

/* Іконка й колір рубрики блогу. Кольори взяті з тієї самої палітри,
   що й групи модулів, щоб блог не виглядав чужим на сайті. */
export const BLOG_CATEGORY_ICONS: Record<BlogCategoryId, LucideIcon> = {
  people: HeartHandshake,
  process: Workflow,
  growth: BarChart3,
  data: Database,
  ai: Bot,
  choice: ListChecks,
};

export const BLOG_CATEGORY_ACCENTS: Record<BlogCategoryId, string> = {
  people: "#0ea5e9",
  process: "#f97316",
  growth: "#0891b2",
  data: "#7c3aed",
  ai: "#a855f7",
  choice: "#12a150",
};
