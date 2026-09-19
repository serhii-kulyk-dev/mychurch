"use client";

import { useSyncExternalStore } from "react";

import { THEME_KEY } from "@/lib/prefs";

export type Theme = "light" | "dark";

/* The theme lives on <html> (set by a blocking script in the layout, so there is
   no flash). React only mirrors it — no provider, no state to keep in sync. */

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

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function applyTheme(theme: Theme) {
  const el = document.documentElement;
  el.classList.toggle("dark", theme === "dark");
  el.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — the choice just won't persist */
  }
  emit();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    theme,
    setTheme: applyTheme,
    toggle: () => applyTheme(theme === "dark" ? "light" : "dark"),
  };
}
