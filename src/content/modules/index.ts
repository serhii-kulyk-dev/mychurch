import type { ModuleDetail } from "./types";
import { MODULE_IDS } from "./ids";
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
export { MODULE_IDS, hasModulePage, moduleHrefByName } from "./ids";

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

/* Список у ids.ts мусить збігатися з реальними модулями — інакше
   посилання вели б на неіснуючі сторінки, а нові модулі мовчки
   випадали б із сітки. Перевіряємо при збірці, не в браузері:
   цей файл тягнуть тільки серверні сторінки. */
{
  const real = MODULE_DETAILS.map((m) => m.id).join(",");
  const listed = (MODULE_IDS as readonly string[]).join(",");
  if (real !== listed) {
    throw new Error(
      `src/content/modules/ids.ts розійшовся з модулями.\nОчікувалось: ${real}\nУ файлі:    ${listed}`,
    );
  }
}
