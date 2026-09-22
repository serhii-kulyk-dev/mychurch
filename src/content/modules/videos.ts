/* ────────────────────────────────────────────────────────────────
   Демо-записи по модулях. Ключ — id модуля, значення — файл у нас на
   хостингу. Грає рідний плеєр браузера: на телефоні це велика кнопка,
   фулскрін, перемотка пальцем і AirPlay.

   Дорогою сюди були Google Drive (чужий плеєр у рамці, «запросити
   доступ» у кого інший акаунт) і YouTube (чужа рамка й другий тап,
   бо iOS не дає автоплей у чужому iframe). Тепер файл свій —
   1080p, ~8–12 МБ на дві хвилини замість 140 МБ оригіналу.

   Самі файли — в public/clips/, і вони НЕ в репозиторії (.gitignore):
   вісімдесят мегабайтів відео в git нікому не треба. Збірка кладе їх
   у .static/clips/, звідти вони їдуть на хостинг разом із сайтом.
   Немає файлу — плеєр просто лишається кадром з кнопкою.

   Порожній рядок (або відсутній ключ) = модуль просто без відео:
   секція на сторінці модуля і картка на сторінці амбасадора зникають.
   ──────────────────────────────────────────────────────────────── */
export const MODULE_CLIPS: Record<string, string> = {
  people: "/clips/people.mp4", // Люди і сім'ї
  family: "/clips/people.mp4", // той самий запис
  groups: "/clips/groups.mp4", // Малі групи
  learning: "/clips/learning.mp4", // Навчання
  onboarding: "/clips/onboarding.mp4", // Онбординг
  forms: "/clips/forms.mp4", // Форми
  links: "/clips/links.mp4", // Посилання
  automations: "/clips/automations.mp4", // Автоматизація
  org: "/clips/org.mp4", // Структура
};

export function getModuleClip(id: string): string | undefined {
  return MODULE_CLIPS[id] || undefined;
}

/* Кадр із того ж запису: до тапу сторінка не вантажить жодного байта
   відео — на екрані тільки ця картинка. */
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
