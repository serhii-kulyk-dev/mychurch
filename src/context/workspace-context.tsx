"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

interface WorkspaceContextType {
  isOpen: boolean;
  /** Module id shown in the workspace; null before the first open. */
  moduleId: string | null;
  /** Open the workspace, optionally straight on a given module. */
  open: (moduleId?: string) => void;
  select: (moduleId: string) => void;
  close: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  isOpen: false,
  moduleId: null,
  open: () => {},
  select: () => {},
  close: () => {},
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [moduleId, setModuleId] = useState<string | null>(null);

  const open = useCallback((id?: string) => {
    if (id) setModuleId(id);
    setIsOpen(true);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{ isOpen, moduleId, open, select: setModuleId, close: () => setIsOpen(false) }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
