"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ALL_GOALS, buildSet, type BuiltSet } from "@/content/builder";

/* The set a visitor assembles in the constructor. It is shared so the brief
   below the constructor can show what they built instead of a canned example. */

interface BuilderValue {
  /** Chosen wishes, in constructor order. */
  goals: string[];
  toggle: (id: string) => void;
  reset: () => void;
  set: BuiltSet;
}

const EMPTY: BuilderValue = {
  goals: [],
  toggle: () => {},
  reset: () => {},
  set: { all: [], start: [], later: [] },
};

const BuilderContext = createContext<BuilderValue>(EMPTY);

const order = (id: string) => ALL_GOALS.findIndex((g) => g.id === id);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setGoals((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id].sort((a, b) => order(a) - order(b))
    );
  }, []);

  const reset = useCallback(() => setGoals([]), []);

  const value = useMemo<BuilderValue>(
    () => ({ goals, toggle, reset, set: goals.length ? buildSet(goals) : EMPTY.set }),
    [goals, toggle, reset]
  );

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  return useContext(BuilderContext);
}
