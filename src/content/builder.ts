import type { LucideIcon } from "lucide-react";
import {
  UserPlus, Activity, Inbox, Send, Flame, Home, Blocks, Ticket,
  Network, GraduationCap, Calculator, DoorOpen, ClipboardList, Zap, BarChart3, Building2,
  FolderInput, Users, Cake, IdCard, ListChecks, Tent, CalendarDays, ListTodo, BookOpen,
  Package, Sparkles, SlidersHorizontal, Target,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   The constructor's data. A visitor never picks a module — they pick
   what they want to simplify, and every wish carries the modules that
   actually close it. Labels live in the dictionary under `builder`,
   keyed by the ids below; the wiring stays here.
   ──────────────────────────────────────────────────────────────── */

export interface BuilderGoal {
  id: string;
  Icon: LucideIcon;
  /** Modules this wish switches on, the most important one first. */
  modules: string[];
}

export interface BuilderGroup {
  id: string;
  goals: BuilderGoal[];
}

/** Always on: everything else writes into this one record. */
export const CORE_MODULES = ["people", "family"];

export const BUILDER_GROUPS: BuilderGroup[] = [
  {
    id: "people",
    goals: [
      { id: "newcomers", Icon: UserPlus, modules: ["onboarding", "forms", "automations"] },
      { id: "attendance", Icon: Activity, modules: ["analytics", "assistant", "automations"] },
      { id: "requests", Icon: Inbox, modules: ["applications", "automations"] },
      { id: "comms", Icon: Send, modules: ["telegram", "telegram-bot", "campaigns"] },
      { id: "families", Icon: Users, modules: ["family", "people"] },
      { id: "birthdays", Icon: Cake, modules: ["calendar", "automations"] },
      { id: "membership", Icon: IdCard, modules: ["people", "forms"] },
    ],
  },
  {
    id: "ministry",
    goals: [
      { id: "ministries", Icon: Flame, modules: ["ministries", "service-planning", "calendar"] },
      { id: "groups", Icon: Home, modules: ["groups", "calendar"] },
      { id: "kids", Icon: Blocks, modules: ["kids-town", "family"] },
      { id: "events", Icon: Ticket, modules: ["events", "camps", "links", "rooms"] },
      { id: "planning", Icon: ListChecks, modules: ["service-planning", "templates"] },
      { id: "camps", Icon: Tent, modules: ["camps", "forms", "links"] },
      { id: "calendar", Icon: CalendarDays, modules: ["calendar", "events"] },
    ],
  },
  {
    id: "team",
    goals: [
      { id: "org", Icon: Network, modules: ["org", "requests"] },
      { id: "learning", Icon: GraduationCap, modules: ["learning", "knowledge"] },
      { id: "money", Icon: Calculator, modules: ["accounting"] },
      { id: "rooms", Icon: DoorOpen, modules: ["rooms", "inventory", "infrastructure"] },
      { id: "projects", Icon: ListTodo, modules: ["projects", "automations"] },
      { id: "knowledge", Icon: BookOpen, modules: ["knowledge", "tables"] },
      { id: "inventory", Icon: Package, modules: ["inventory", "infrastructure"] },
    ],
  },
  {
    id: "order",
    goals: [
      { id: "gather", Icon: FolderInput, modules: ["tables", "knowledge"] },
      { id: "forms", Icon: ClipboardList, modules: ["forms", "links", "tables"] },
      { id: "routine", Icon: Zap, modules: ["automations", "templates", "assistant"] },
      { id: "numbers", Icon: BarChart3, modules: ["analytics", "goals", "seasons"] },
      { id: "campuses", Icon: Building2, modules: ["campuses", "customization"] },
      { id: "assistant", Icon: Sparkles, modules: ["assistant", "analytics"] },
      { id: "custom", Icon: SlidersHorizontal, modules: ["customization", "templates"] },
      { id: "goals", Icon: Target, modules: ["goals", "seasons", "analytics"] },
    ],
  },
];

export const ALL_GOALS = BUILDER_GROUPS.flatMap((g) => g.goals);

export function findGoal(id: string) {
  return ALL_GOALS.find((g) => g.id === id);
}

/* Modules that are worth waiting for: they need data, a season or a team
   decision behind them, so the honest answer is "later", not "day one". */
const LATER_MODULES = new Set([
  "service-planning", "analytics", "assistant", "campaigns", "kids-town", "events", "camps",
  "rooms", "inventory", "infrastructure", "org", "requests", "accounting", "learning",
  "knowledge", "tables", "templates", "goals", "seasons", "campuses", "customization",
]);

/** Canonical order: core first, then the order wishes appear in the constructor. */
const ORDER: string[] = [
  ...CORE_MODULES,
  ...ALL_GOALS.flatMap((g) => g.modules),
];

function rank(id: string) {
  const i = ORDER.indexOf(id);
  return i === -1 ? ORDER.length : i;
}

export interface BuiltSet {
  /** Every module of the set, core included, in canonical order. */
  all: string[];
  /** Switched on right away. */
  start: string[];
  /** Added once the church settles in. */
  later: string[];
}

export function buildSet(goalIds: string[]): BuiltSet {
  const picked = new Set(CORE_MODULES);
  for (const id of goalIds) {
    const goal = findGoal(id);
    if (!goal) continue;
    for (const m of goal.modules) picked.add(m);
  }
  const all = [...picked].sort((a, b) => rank(a) - rank(b));
  return {
    all,
    start: all.filter((m) => !LATER_MODULES.has(m)),
    later: all.filter((m) => LATER_MODULES.has(m)),
  };
}
