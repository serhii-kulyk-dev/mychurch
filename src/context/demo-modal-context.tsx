"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

/** Що людина встигла розказати до модалки — їде в лід разом з іменем. */
export interface DemoContext {
  about?: string;
  size?: string;
}

interface DemoModalContextType {
  isOpen: boolean;
  /** Цілі, позначені у формі знайомства, — їдуть у лід разом із формою. */
  goals: string[];
  /** Текст про церкву й розмір, якщо модалку відкрили з форми знайомства. */
  context: DemoContext;
  open: () => void;
  /** Те саме, але з уже позначеними цілями й контекстом форми. */
  openWith: (goals: string[], context?: DemoContext) => void;
  close: () => void;
}

const DemoModalContext = createContext<DemoModalContextType>({
  isOpen: false,
  goals: [],
  context: {},
  open: () => {},
  openWith: () => {},
  close: () => {},
});

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [context, setContext] = useState<DemoContext>({});

  const openWith = useCallback((next: string[], ctx: DemoContext = {}) => {
    setGoals(Array.isArray(next) ? next : []);
    setContext(ctx);
    setIsOpen(true);
  }, []);
  const open = useCallback(() => openWith([]), [openWith]);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, goals, context, open, openWith, close }),
    [isOpen, goals, context, open, openWith, close]
  );

  return <DemoModalContext.Provider value={value}>{children}</DemoModalContext.Provider>;
}

export function useDemoModal() {
  return useContext(DemoModalContext);
}
