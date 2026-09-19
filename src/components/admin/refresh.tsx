"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFlag, writeFlag } from "@/lib/analytics/flag";

/* Автооновлення звіту раз на 30 секунд. Зручно тримати вкладку
   відкритою під час розсилки й бачити, як заходять люди.      */

const KEY = "mychurch-admin-live";
const PERIOD = 30_000;

export default function Refresh() {
  const router = useRouter();
  const state = useFlag(KEY);
  const live = state === "on";
  const [pending, start] = useTransition();
  const [updated, setUpdated] = useState("");
  const updatedRef = useRef("");

  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => {
      /* Оновлюємо лише видиму вкладку — фонова не має смикати сервер. */
      if (document.visibilityState !== "visible") return;
      updatedRef.current = new Date().toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      start(() => {
        router.refresh();
        setUpdated(updatedRef.current);
      });
    }, PERIOD);
    return () => clearInterval(timer);
  }, [live, router]);

  return (
    <button
      type="button"
      onClick={() => writeFlag(KEY, !live)}
      aria-pressed={live}
      title={live ? "Оновлюється кожні 30 секунд" : "Увімкнути автооновлення"}
      className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors ${
        live ? "border-brand/40 bg-brand-soft text-brand-deep" : "border-hairline text-ink-2 hover:bg-surface-3"
      }`}
    >
      <span className={`size-1.5 rounded-full ${live ? "bg-brand animate-pulse" : "bg-ink-3"}`} aria-hidden />
      {live ? (pending ? "Оновлюю…" : updated ? `Наживо · ${updated}` : "Наживо") : "Наживо"}
    </button>
  );
}
