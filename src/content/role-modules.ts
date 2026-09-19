import type { RoleId } from "@/content/modules";

/* ────────────────────────────────────────────────────────────────
   What each role actually opens in "My space".

   Every id here is a module that already authors a line for this
   role in its own `audience` block — this list only decides which
   of them make up that role's day, so the space narrows the way
   access does: the pastor sees the whole church, the visitor sees
   the two screens they ever touch.
   ──────────────────────────────────────────────────────────────── */
export const ROLE_MODULES: Record<RoleId, string[]> = {
  pastor: ["analytics", "people", "goals", "assistant", "ministries", "groups", "seasons", "campuses", "org"],
  leader: ["groups", "ministries", "service-planning", "calendar", "campaigns", "learning", "people", "requests"],
  deacon: ["applications", "people", "family", "accounting", "projects", "calendar", "knowledge"],
  volunteer: ["ministries", "service-planning", "calendar", "learning", "requests", "knowledge", "telegram-bot"],
  visitor: ["onboarding", "forms", "applications", "telegram-bot", "instagram"],
  member: ["events", "groups", "family", "kids-town", "camps", "campaigns", "telegram-bot"],
  hr: ["org", "requests", "learning", "goals", "projects", "knowledge"],
  accountant: ["accounting", "analytics", "tables", "inventory", "camps"],
  reception: ["people", "family", "calendar", "kids-town", "rooms", "forms", "applications", "links"],
};
