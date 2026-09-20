import type { LucideIcon } from "lucide-react";
import {
  UserPlus, Activity, Inbox, Flame, Zap,
  QrCode, Send, Bell, ScanLine, AlertTriangle, ListChecks,
  Mail, UserCheck, Clock, CalendarCheck, Repeat, Workflow, Smartphone, History,
  Home, Baby, Ticket, FolderInput, BarChart3,
  Users, ClipboardCheck, ClipboardList, ShieldCheck, BookOpen, KeyRound, FileText, Target,
  Calculator, Wallet, Tags,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   «Було — стало». На головній людина не збирає набір модулів
   (сам набір їй нічого не каже) — вона обирає свій біль і бачить
   екран, на якому цей біль уже закритий: хто на ньому, що система
   зробила сама і які модулі за це відповідають.

   Повний конструктор із усіма бажаннями лишається на /modules —
   там набір має куди поїхати (бриф під ним).

   `id` збігається з ціллю конструктора (`content/builder.ts`), щоб
   форма демо показала ту саму назву, що й тут.
   ──────────────────────────────────────────────────────────────── */

export interface SolvedCase {
  id: string;
  Icon: LucideIcon;
  /** По іконці на кожен крок «як вирішуємо» — рядки живуть у словнику. */
  steps: [LucideIcon, LucideIcon, LucideIcon];
  /** Модулі, які закривають ситуацію, — найголовніший перший (він же дає колір). */
  modules: string[];
}

export const SOLVED_CASES: SolvedCase[] = [
  { id: "newcomers", Icon: UserPlus, steps: [QrCode, Send, Bell], modules: ["onboarding", "forms", "automations"] },
  { id: "attendance", Icon: Activity, steps: [ScanLine, AlertTriangle, ListChecks], modules: ["analytics", "assistant", "automations"] },
  { id: "requests", Icon: Inbox, steps: [Mail, UserCheck, Clock], modules: ["applications", "automations"] },
  { id: "groups", Icon: Home, steps: [Users, ClipboardCheck, AlertTriangle], modules: ["groups", "calendar", "analytics"] },
  { id: "ministries", Icon: Flame, steps: [CalendarCheck, Bell, Repeat], modules: ["ministries", "service-planning", "calendar"] },
  { id: "kids", Icon: Baby, steps: [Baby, ScanLine, ShieldCheck], modules: ["kids-town", "family", "forms"] },
  { id: "events", Icon: Ticket, steps: [Ticket, ClipboardList, Bell], modules: ["events", "camps", "forms"] },
  { id: "routine", Icon: Zap, steps: [Workflow, Smartphone, History], modules: ["automations", "templates", "assistant"] },
  { id: "money", Icon: Calculator, steps: [Wallet, Tags, FileText], modules: ["accounting", "analytics"] },
  { id: "gather", Icon: FolderInput, steps: [FolderInput, BookOpen, KeyRound], modules: ["tables", "knowledge", "people"] },
  { id: "numbers", Icon: BarChart3, steps: [BarChart3, FileText, Target], modules: ["analytics", "goals", "seasons"] },
];

export const SOLVED_IDS = SOLVED_CASES.map((c) => c.id);
