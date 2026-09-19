"use client";

import { useT } from "@/lib/lang";

/* Перше, на що потрапляє Tab. На головній до кнопки в героєві інакше
   двадцять натискань — через усе меню й перемикачі. */
export default function SkipLink() {
  const t = useT();
  return (
    <a href="#main" className="skip-link">
      {t.common.skipToContent}
    </a>
  );
}
