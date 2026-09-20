import Image from "next/image";
import { cn } from "@/lib/utils";

export type AvatarLook = {
  /* Фото 192×192 з public/avatars — кадр по обличчю, плечі в кадрі. */
  photo: string;
  /* Стать задана тут, а не вгадується: жіноче ім'я ніколи не отримає
     чоловічого обличчя, навіть якщо ім'я нове й незнайоме. */
  sex: "m" | "f";
  /* Приблизний вік у кадрі — щоб підбирати обличчя під роль: новенький
     двадцяти років і дияконеса на шістдесят це різні фото. */
  age: number;
  /* Підкладка: видно, поки фото вантажиться. */
  bg: string;
};

/* Вісім облич демо-церкви: усі усміхнені й зняті при світлі — темні
   «художні» портрети з кружечка виглядають похмуро. Різний вік,
   чотири чоловіки й чотири жінки.
   Порядок має значення — індекс 0 це Андрій, 1 Олена, 2 Марко
   (src/lib/i18n.ts), далі ролі з desk-stage/audience-stage.
   Джерело, автори й ліцензія — public/avatars/CREDITS.md. */
export const AVATAR_LOOKS: AvatarLook[] = [
  { photo: "/avatars/a1.webp", sex: "m", age: 25, bg: "#dbeafe" },
  { photo: "/avatars/a2.webp", sex: "f", age: 25, bg: "#fde2ea" },
  { photo: "/avatars/a3.webp", sex: "m", age: 22, bg: "#dcfce7" },
  { photo: "/avatars/a4.webp", sex: "m", age: 45, bg: "#ede9fe" },
  { photo: "/avatars/a5.webp", sex: "f", age: 28, bg: "#fef3c7" },
  { photo: "/avatars/a6.webp", sex: "f", age: 65, bg: "#e0f2fe" },
  { photo: "/avatars/a7.webp", sex: "m", age: 60, bg: "#fee2e2" },
  { photo: "/avatars/a8.webp", sex: "f", age: 50, bg: "#ccfbf1" },
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

/* Обличчя за іменем: та сама людина завжди з тим самим фото, а Оксана
   ніколи не отримає чоловічого. Індекси в AVATAR_LOOKS лишаються для
   безіменних рядів — там, де людина в кадрі лише як «ще шестеро». */
export function lookFor(name: string): AvatarLook {
  const pool = isFemaleName(name) ? FACES_F : FACES_M;
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return pool[h % pool.length];
}

/* Кругла аватарка людини. Раніше тут був мальований SVG — від нього
   екрани виглядали як дитяча гра, а не як база людей церкви. */
export default function PersonAvatar({ look, size = 48, className }: { look: AvatarLook; size?: number; className?: string }) {
  return (
    <Image
      src={look.photo}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      style={{ backgroundColor: look.bg }}
      className={cn("rounded-full object-cover shrink-0", className)}
    />
  );
}
