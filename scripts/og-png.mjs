/* Картинки для соцмереж: копія з розширенням .png
   ─────────────────────────────────────────────────────────────────
   Next кладе згенеровані `opengraph-image.tsx` файлами без розширення:

     .static/opengraph-image
     .static/blog/<стаття>/opengraph-image

   Для браузера цього досить — тип віддає хостинг. Але краулери
   месенджерів (Telegram, Viber, WhatsApp) вимагають, щоб адреса
   картинки була схожа на картинку: без «.png» превʼю приходить без
   обкладинки, лише заголовок і опис. Тому поруч із кожним таким
   файлом кладемо копію `opengraph-image.png`, і саме на неї вказує
   `og:image` (src/lib/seo.ts).

   Оригінал лишаємо: на нього вже посилаються кеші соцмереж. */

import { readdir, copyFile } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = ".static";
const NAME = "opengraph-image";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const copied = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      copied.push(...(await walk(path)));
    } else if (entry.name === NAME) {
      await copyFile(path, `${path}.png`);
      copied.push(`${path}.png`);
    }
  }
  return copied;
}

const copied = await walk(OUT_DIR);
if (copied.length === 0) {
  console.error(`og-png: у ${OUT_DIR} немає жодного ${NAME} — превʼю в месенджерах буде без картинки`);
  process.exit(1);
}
console.log(`og-png: ${copied.length} картинок для соцмереж отримали .png`);
