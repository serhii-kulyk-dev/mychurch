/* ────────────────────────────────────────────────────────────────
   Демо-записи по модулях. Ключ — id модуля, значення — id ролика на
   YouTube (те, що в посиланні після `v=` або `youtu.be/`).

   Раніше тут лежали id файлів Google Drive, і сторінка вбудовувала
   drive.google.com/file/d/<id>/preview. На телефоні той плеєр нікуди
   не годився: контроли під мишку, другий тап по чужій кнопці, а в
   кого інший Google-акаунт — «запросити доступ» замість відео. Плюс
   вихідні файли по 140 МБ на дві хвилини.

   Порожній рядок (або відсутній ключ) = модуль просто без відео:
   секція на сторінці модуля і картка на сторінці амбасадора зникають.
   ──────────────────────────────────────────────────────────────── */
export const MODULE_VIDEOS: Record<string, string> = {
  people: "", // Люди і сім'ї
  family: "", // Люди і сім'ї
  groups: "", // Малі групи
  learning: "", // Навчання
  onboarding: "", // Онбординг
  forms: "", // Форми
  links: "", // Посилання
  automations: "", // Автоматизація
  org: "", // Структура
};

export function getModuleVideo(id: string): string | undefined {
  return MODULE_VIDEOS[id] || undefined;
}

/* Кадр із того ж запису, збережений у себе: до тапу сторінка не
   робить жодного запиту до YouTube — ні плеєра, ні cookies. */
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
