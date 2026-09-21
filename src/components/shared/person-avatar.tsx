"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type AvatarLook = {
  /* Малюнок, а не фото: тон шкіри, волосся й футболка. У демо-екранах
     стоять вигадані люди вигаданої церкви — чужих облич там бути не
     може, навіть стокових. Живе фото на сайті лишилось одне: Єва. */
  skin: string;
  hair: string;
  shirt: string;
  /* Підкладка кружечка. */
  bg: string;
  style: "short" | "long" | "curly";
  /* Стать задана тут, а не вгадується: жіноче ім'я ніколи не отримає
     чоловічої зачіски, навіть якщо ім'я нове й незнайоме. */
  sex: "m" | "f";
  /* Приблизний вік — щоб підбирати людину під роль: новенький двадцяти
     років і дияконеса на шістдесят це різні кружечки. Вік у малюнку
     видно по волоссю, тому міняючи сивину — міняй і це поле. */
  age: number;
};

/* Вісім людей демо-церкви. Різний вік, чотири чоловіки й чотири жінки.
   Порядок має значення — індекс 0 це Андрій, 1 Олена, 2 Марко
   (src/lib/i18n.ts), далі ролі з desk-stage/audience-stage. */
export const AVATAR_LOOKS: AvatarLook[] = [
  { skin: "#f1c9a5", hair: "#3b2a1a", shirt: "#007aff", bg: "#dbeafe", style: "short", sex: "m", age: 25 },
  { skin: "#e8b48f", hair: "#5a2d0c", shirt: "#f05b8b", bg: "#fde2ea", style: "long", sex: "f", age: 25 },
  { skin: "#d9a066", hair: "#1f1f1f", shirt: "#12a150", bg: "#dcfce7", style: "curly", sex: "m", age: 22 },
  { skin: "#f3d3b7", hair: "#8a5a2b", shirt: "#8b5bf0", bg: "#ede9fe", style: "short", sex: "m", age: 45 },
  { skin: "#c68642", hair: "#2a1a0e", shirt: "#f59e0b", bg: "#fef3c7", style: "curly", sex: "f", age: 28 },
  { skin: "#f6dcc4", hair: "#d9a441", shirt: "#0ea5e9", bg: "#e0f2fe", style: "long", sex: "f", age: 65 },
  { skin: "#a3683f", hair: "#8c8c8c", shirt: "#ef4444", bg: "#fee2e2", style: "short", sex: "m", age: 60 },
  { skin: "#ecc19c", hair: "#4a3320", shirt: "#14b8a6", bg: "#ccfbf1", style: "long", sex: "f", age: 50 },
];

/* Чоловічі імена, що закінчуються на голосну, — єдиний виняток, який
   не вивести з правила «-а/-я = жінка». Список короткий і закритий:
   усе інше в демо-даних розбирається правилом. */
const MALE_ON_VOWEL = new Set([
  "микола", "павло", "данило", "марко", "ілля", "сава", "кузьма", "хома", "лука", "гаврило", "михайло", "мойсей",
  "mykola", "pavlo", "danylo", "marko", "illia", "ilya", "sava", "luka",
]);
const TITLES = ["пастор", "лідер", "сестра", "брат", "родина", "команда", "pastor", "leader", "family"];

export function isFemaleName(raw: string): boolean {
  const first = raw.trim().toLowerCase().split(/[\s,·]+/).filter((w) => !TITLES.includes(w))[0] ?? "";
  const name = first.replace(/[^a-zа-яіїєґ']/g, "");
  if (!name || MALE_ON_VOWEL.has(name)) return false;
  return /[аяa]$/.test(name);
}

const FACES_F = AVATAR_LOOKS.filter((l) => l.sex === "f");
const FACES_M = AVATAR_LOOKS.filter((l) => l.sex === "m");

/* Кружечок за іменем: та сама людина завжди той самий, а Оксана ніколи
   не отримає чоловічого. Індекси в AVATAR_LOOKS лишаються для
   безіменних рядів — там, де людина в кадрі лише як «ще шестеро». */
export function lookFor(name: string): AvatarLook {
  const pool = isFemaleName(name) ? FACES_F : FACES_M;
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return pool[h % pool.length];
}

/* Кругла аватарка людини: голова, волосся, плечі — без жодного фото. */
export default function PersonAvatar({ look, size = 48, className }: { look: AvatarLook; size?: number; className?: string }) {
  const id = useId();
  const clip = `av-${id.replace(/[:]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className={cn("rounded-full shrink-0", className)}>
      <defs>
        <clipPath id={clip}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="50" fill={look.bg} />
      <g clipPath={`url(#${clip})`}>
        {look.style === "long" && (
          <path d="M30 44 C30 22 40 17 50 17 C60 17 70 22 70 44 L73 78 L62 72 L60 42 C56 34 44 34 40 42 L38 72 L27 78 Z" fill={look.hair} />
        )}
        <path d="M14 104 C14 76 30 66 50 66 C70 66 86 76 86 104 Z" fill={look.shirt} />
        <rect x="42" y="50" width="16" height="18" rx="6" fill={look.skin} />
        <circle cx="50" cy="40" r="18" fill={look.skin} />
        {look.style === "short" && (
          <path d="M32 40 C32 25 40 20 50 20 C60 20 68 25 68 40 C64 31 58 28 50 28 C42 28 36 31 32 40 Z" fill={look.hair} />
        )}
        {look.style === "long" && (
          <path d="M31 42 C31 24 40 19 50 19 C60 19 69 24 69 42 C65 32 58 29 50 29 C42 29 35 32 31 42 Z" fill={look.hair} />
        )}
        {look.style === "curly" && (
          <>
            <path d="M30 41 C28 22 40 16 50 17 C60 16 72 22 70 41 C68 32 61 27 50 27 C39 27 32 32 30 41 Z" fill={look.hair} />
            <circle cx="32" cy="34" r="5" fill={look.hair} />
            <circle cx="68" cy="34" r="5" fill={look.hair} />
            <circle cx="40" cy="24" r="5" fill={look.hair} />
            <circle cx="60" cy="24" r="5" fill={look.hair} />
          </>
        )}
        <circle cx="44" cy="40" r="1.8" fill="#2b2118" />
        <circle cx="56" cy="40" r="1.8" fill="#2b2118" />
        <path d="M45 47 Q50 51 55 47" stroke="#2b2118" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
