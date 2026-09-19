/* ────────────────────────────────────────────────────────────────
   Demo videos per module, hosted on Google Drive (folder
   «Готове відео»). Key = module id, value = Drive file id; the
   page embeds https://drive.google.com/file/d/<id>/preview.
   ──────────────────────────────────────────────────────────────── */
export const MODULE_VIDEOS: Record<string, string> = {
  people: "1Lch0m1YFJVIltcaR2DaGk5Z2VGhuy9HB", // Люди і сім'ї.mp4
  family: "1Lch0m1YFJVIltcaR2DaGk5Z2VGhuy9HB", // Люди і сім'ї.mp4
  groups: "1ll6SfQsRuf6w6ak9PK5HxJLuSK6KQ5Hw", // Малі групи.mp4
  learning: "1YbKrvL13DYKZNF_EnKFO5a_6HQOBwJtk", // Навчання.mp4
  onboarding: "1sBPP3wrxl82io_LLoByljIVZFngR-PED", // Онбординг.mp4
  forms: "1dsBIaqxg3vIpa82kqGq1A5vNDLVSrv4c", // Форми.mp4
  links: "1L1QKJQM3JTg2yXLihrRJIPnxk72eC0W5", // Посилання.mp4
  automations: "1Zwo6C32WXWdpOQtT2cei_SO0JRMb7K4M", // Автоматизація.mp4
  org: "1-Mn5iHqle-wNmxs1bCUBtVBxts4xzCeT", // Структура.mp4
};

export function getModuleVideo(id: string): string | undefined {
  return MODULE_VIDEOS[id];
}

/* Poster frames grabbed from the same recordings and stored locally, so a
   clip costs one small image until the visitor actually presses play. */
const MODULE_VIDEO_POSTERS: Record<string, string> = {
  people: "/ambassadors/video/people.webp",
  family: "/ambassadors/video/people.webp",
  groups: "/ambassadors/video/groups.webp",
  learning: "/ambassadors/video/learning.webp",
  onboarding: "/ambassadors/video/onboarding.webp",
  forms: "/ambassadors/video/forms.webp",
  links: "/ambassadors/video/links.webp",
  automations: "/ambassadors/video/automations.webp",
  org: "/ambassadors/video/org.webp",
};

export function getModuleVideoPoster(id: string): string | undefined {
  return MODULE_VIDEO_POSTERS[id];
}
