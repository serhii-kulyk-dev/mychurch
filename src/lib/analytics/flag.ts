"use client";

import { useSyncExternalStore } from "react";

/* Прапорець у локальному сховищі, за яким можна підписатись.

   Такий самий підхід, як у теми й мови (src/lib/lang.tsx): джерело
   правди — сховище браузера, а React дізнається про зміну через
   підписку, а не через setState усередині ефекту.                */

/** «Не рахувати мене»: спільний ключ для трекера й перемикача на /privacy. */
export const OPTOUT_KEY = "mychurch-no-track";

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();

function emit(key: string) {
  for (const listener of listeners.get(key) ?? []) listener();
}

export function readFlag(key: string) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    /* Приватний режим — вважаємо, що прапорець не стоїть. */
    return false;
  }
}

export function writeFlag(key: string, on: boolean) {
  try {
    localStorage.setItem(key, on ? "1" : "0");
  } catch {
    /* Приватний режим — вибір не переживе перезавантаження. */
  }
  emit(key);
}

function subscribe(key: string, listener: Listener) {
  const set = listeners.get(key) ?? new Set<Listener>();
  set.add(listener);
  listeners.set(key, set);
  return () => {
    set.delete(listener);
  };
}

/** "on" | "off", і "unknown" до першого рендера в браузері. */
export type FlagState = "on" | "off" | "unknown";

export function useFlag(key: string): FlagState {
  return useSyncExternalStore(
    (listener) => subscribe(key, listener),
    () => (readFlag(key) ? "on" : "off"),
    () => "unknown"
  );
}
