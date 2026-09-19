import type { Lang } from "@/lib/i18n";
import type { FeatureIconName } from "@/components/shared/module-icons";

/* ────────────────────────────────────────────────────────────────
   Per-module page content. One `ModuleDetail` per item in
   `i18n.modules.groups[*].items`; the id must match exactly.
   Copy is authored in both languages; UI chrome strings live in
   `i18n.modulePage`.
   ──────────────────────────────────────────────────────────────── */

/** Role ids from `i18n.audience.roles` — names are looked up there. */
export type RoleId = "pastor" | "leader" | "deacon" | "volunteer" | "visitor" | "member" | "hr" | "accountant" | "reception";

export type Tone = "brand" | "green" | "amber" | "red" | "violet" | "neutral";

export interface MockBadge {
  label: string;
  tone?: Tone;
}

/** A data-driven product mock rendered in the page hero. Pick the kind that
    best shows what the module *does*; the renderer handles layout/animation. */
export type MockSpec =
  | {
      kind: "list";
      title: string;
      subtitle?: string;
      /** 4–6 rows. `avatar` defaults to the initials of `title`. */
      items: { title: string; sub?: string; meta?: string; badge?: MockBadge }[];
      footer?: string;
    }
  | {
      kind: "table";
      title: string;
      subtitle?: string;
      /** 3–4 columns, 4–6 rows. `cells.length === columns.length`. */
      columns: string[];
      rows: { cells: string[]; badge?: MockBadge }[];
    }
  | {
      kind: "stats";
      title: string;
      subtitle?: string;
      /** 2–3 KPI tiles. */
      kpis: { label: string; value: string; trend?: string }[];
      /** 6–10 bars, values 0–100. */
      bars: { label: string; value: number }[];
      barsTitle?: string;
    }
  | {
      kind: "chat";
      title: string;
      subtitle?: string;
      /** 4–6 messages alternating between the church bot/system and a person. */
      messages: { from: "bot" | "user"; text: string; time?: string }[];
      input?: string;
    }
  | {
      kind: "board";
      title: string;
      subtitle?: string;
      /** 3 columns, 2–3 cards each. */
      columns: { title: string; cards: { title: string; sub?: string; tag?: MockBadge }[] }[];
    }
  | {
      kind: "calendar";
      title: string;
      subtitle?: string;
      /** 5–7 short day labels. Events use `day` index into `days`,
          `start` and `span` are row slots 0–7 (each slot ≈ one hour). */
      days: string[];
      events: { day: number; start: number; span: number; title: string; tone?: Tone }[];
    }
  | {
      kind: "form";
      title: string;
      subtitle?: string;
      /** 4–6 fields. */
      fields: { label: string; value?: string; type?: "text" | "select" | "date" | "check" | "textarea" }[];
      submit: string;
    }
  | {
      kind: "timeline";
      title: string;
      subtitle?: string;
      /** 4–6 ordered steps/entries. */
      items: { time: string; title: string; who?: string; done?: boolean }[];
    };

export interface ModuleCopy {
  /** <title> — e.g. "Люди — модуль MyChurch". */
  seoTitle: string;
  /** 120–160 characters. */
  seoDescription: string;
  /** H1: a benefit, not a feature name. 4–9 words. */
  title: string;
  /** 1–2 sentences under the H1. */
  lead: string;
  /** 3–4 short proof points shown as check-list under the lead. */
  highlights: string[];
  /** 4–6 feature cards. */
  features: { icon: FeatureIconName; title: string; text: string }[];
  /** 3–4 numbered steps: how a church adopts/uses the module. */
  steps: { title: string; text: string }[];
  /** 2–4 roles and what each gets from the module. */
  audience: { role: RoleId; text: string }[];
  /** 3–4 questions a pastor/admin would actually ask. */
  faq: { q: string; a: string }[];
  mock: MockSpec;
  /** Optional: the kanban-style path a record takes through the module.
      3–5 stages; `auto` is what the system does on its own at that stage. */
  pipeline?: {
    title: string;
    text?: string;
    stages: { title: string; text: string; auto?: string; tone?: Tone }[];
  };
  /** Optional: measurable outcomes, 3–4 KPI tiles. `value` is short ("6 год", "0"). */
  benefits?: {
    title: string;
    text?: string;
    items: { value: string; label: string; text: string }[];
  };
  /** Optional: "one day with the module" — what happens on its own, hour by hour. 5–8 entries. */
  day?: {
    title: string;
    text?: string;
    items: { time: string; title: string; text: string; count?: string }[];
    footer?: string;
  };
}

export interface ModuleDetail {
  /** Must equal an item id from `i18n.modules.groups[*].items`. */
  id: string;
  /** Must equal the containing group id. */
  group: string;
  /** 3–4 other module ids shown as "related". */
  related: string[];
  copy: Record<Lang, ModuleCopy>;
}
