"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import {
  EMPTY_IDS,
  getSavedIdsSnapshot,
  subscribeSavedIds,
  toggleSaved,
} from "@/lib/storage";

interface SavedJobsContextValue {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
}

const SavedJobsContext = createContext<SavedJobsContextValue | null>(null);

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const savedIds = useSyncExternalStore(
    subscribeSavedIds,
    getSavedIdsSnapshot,
    () => EMPTY_IDS
  );

  const toggle = useCallback((id: string) => {
    toggleSaved(id);
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return (
    <SavedJobsContext.Provider value={{ savedIds, isSaved, toggle }}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const ctx = useContext(SavedJobsContext);
  if (!ctx) {
    throw new Error("useSavedJobs must be used within a SavedJobsProvider");
  }
  return ctx;
}
