import type { ModuleDetail } from "./types";
import { peopleModules } from "./people";
import { activitiesModules } from "./activities";
import { planningModules } from "./planning";
import { analyticsModules } from "./analytics";
import { campusesModules } from "./campuses";
import { clubsModules } from "./clubs";
import { toolsModules } from "./tools";
import { resourcesModules } from "./resources";
import { hrModules } from "./hr";
import { integrationsModules } from "./integrations";
import { platformModules } from "./platform";
import { aiModules } from "./ai";

export type { ModuleDetail, ModuleCopy, MockSpec, RoleId, Tone } from "./types";

/** Every module page, in the same order as the grid on /modules. */
export const MODULE_DETAILS: ModuleDetail[] = [
  ...peopleModules,
  ...activitiesModules,
  ...planningModules,
  ...analyticsModules,
  ...campusesModules,
  ...clubsModules,
  ...toolsModules,
  ...resourcesModules,
  ...hrModules,
  ...integrationsModules,
  ...platformModules,
  ...aiModules,
];

const BY_ID = new Map(MODULE_DETAILS.map((m) => [m.id, m]));

export function getModule(id: string): ModuleDetail | undefined {
  return BY_ID.get(id);
}

/** Ids that have a dedicated page (used by generateStaticParams and links). */
export const MODULE_IDS = MODULE_DETAILS.map((m) => m.id);

export function hasModulePage(id: string) {
  return BY_ID.has(id);
}

/** Resolve a module *name* (as shown in role pages) to the best link:
    its own page, else its group on /modules. */
export function moduleHrefByName(groups: { id: string; items: { id: string; name: string }[] }[], name: string) {
  for (const g of groups) {
    const item = g.items.find((i) => i.name === name);
    if (item) return hasModulePage(item.id) ? `/modules/${item.id}` : `/modules#m-${g.id}`;
  }
  return "/modules";
}
