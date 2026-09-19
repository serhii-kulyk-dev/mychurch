"use client";

import { useSyncExternalStore } from "react";
import { i18n, type Lang } from "@/lib/i18n";
import { LANG_KEY } from "@/lib/prefs";

/* Same approach as the theme: <html data-lang> is the source of truth, set by a
   blocking script before first paint. */

let listeners: (() => void)[] = [];

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function getSnapshot(): Lang {
  return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "ua";
}

function getServerSnapshot(): Lang {
  return "ua";
}

export function applyLang(lang: Lang) {
  const el = document.documentElement;
  el.setAttribute("data-lang", lang);
  el.setAttribute("lang", lang === "en" ? "en" : "uk");
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* private mode — the choice just won't persist */
  }
  emit();
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { lang, setLang: applyLang };
}

/** Strings for the active language. */
export function useT() {
  const { lang } = useLang();
  return i18n[lang];
}
