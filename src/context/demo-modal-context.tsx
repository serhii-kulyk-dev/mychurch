"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

interface DemoModalContextType {
  isOpen: boolean;
  /** Цілі, позначені у фінальному блоці, — їдуть у лід разом із формою. */
  goals: string[];
  open: () => void;
  /** Те саме, але з уже позначеними цілями. */
  openWith: (goals: string[]) => void;
  close: () => void;
}

const DemoModalContext = createContext<DemoModalContextType>({
  isOpen: false,
  goals: [],
  open: () => {},
  openWith: () => {},
  close: () => {},
});

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);

  const openWith = useCallback((next: string[]) => {
    setGoals(Array.isArray(next) ? next : []);
    setIsOpen(true);
  }, []);
  const open = useCallback(() => openWith([]), [openWith]);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, goals, open, openWith, close }),
    [isOpen, goals, open, openWith, close]
  );

  return <DemoModalContext.Provider value={value}>{children}</DemoModalContext.Provider>;
}

export function useDemoModal() {
  return useContext(DemoModalContext);
}
