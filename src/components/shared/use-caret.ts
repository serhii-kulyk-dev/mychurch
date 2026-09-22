"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/* На сервері layout-ефекту немає, і React про це попереджає. Каретка
   потрібна тільки в браузері — там же й беремо синхронний ефект. */
const useIsoEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Тримає каретку там, де вона стояла, коли поле переписує набране —
    маскою телефону чи великою літерою. Без цього браузер після кожної
    такої правки кидав би її в кінець рядка, і виправити щось посеред
    номера чи речення стало б неможливо.

    `at` ставимо в обробнику onChange; ефект поверне каретку після
    перемальовки і сам себе обнулить. */
export function useCaret<T extends HTMLInputElement | HTMLTextAreaElement>() {
  const ref = useRef<T>(null);
  const at = useRef<number | null>(null);

  useIsoEffect(() => {
    const el = ref.current;
    if (el && at.current !== null && document.activeElement === el) {
      el.setSelectionRange(at.current, at.current);
    }
    at.current = null;
  });

  return { ref, at };
}
