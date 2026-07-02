import { SEED_JOBS } from "./data";
import type { Job } from "./types";

const KEYS = {
  postedJobs: "signalboard:posted-jobs",
  savedIds: "signalboard:saved-ids",
  appliedIds: "signalboard:applied-ids",
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * A minimal external store per localStorage key. Components read it with
 * `useSyncExternalStore`, which is the React-blessed way to subscribe to
 * browser-only state without a manual useEffect+setState dance (that
 * pattern causes an extra render and trips the set-state-in-effect lint
 * rule for no real benefit here).
 */
function createStore<T>(key: string, fallback: T) {
  let cache: T = typeof window === "undefined" ? fallback : readJson(key, fallback);
  const listeners = new Set<() => void>();

  return {
    get: () => cache,
    set(value: T): T {
      cache = value;
      writeJson(key, value);
      listeners.forEach((listener) => listener());
      return value;
    },
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const postedJobsStore = createStore<Job[]>(KEYS.postedJobs, []);
const savedIdsStore = createStore<string[]>(KEYS.savedIds, []);
const appliedIdsStore = createStore<string[]>(KEYS.appliedIds, []);

// Stable empty-array references for useSyncExternalStore's server snapshot.
export const EMPTY_JOBS: Job[] = [];
export const EMPTY_IDS: string[] = [];

export const getPostedJobsSnapshot = postedJobsStore.get;
export const subscribePostedJobs = postedJobsStore.subscribe;

export function addPostedJob(job: Job): void {
  postedJobsStore.set([job, ...postedJobsStore.get()]);
}

export const getSavedIdsSnapshot = savedIdsStore.get;
export const subscribeSavedIds = savedIdsStore.subscribe;

/** Flips the saved state for a job and returns the updated id list. */
export function toggleSaved(id: string): string[] {
  const current = savedIdsStore.get();
  const next = current.includes(id)
    ? current.filter((savedId) => savedId !== id)
    : [...current, id];
  return savedIdsStore.set(next);
}

export const getAppliedIdsSnapshot = appliedIdsStore.get;
export const subscribeAppliedIds = appliedIdsStore.subscribe;

/** Records a local application. Idempotent — re-applying is a no-op. */
export function recordApplication(id: string): string[] {
  const current = appliedIdsStore.get();
  if (current.includes(id)) return current;
  return appliedIdsStore.set([...current, id]);
}

/** Seed listings plus anything posted locally, newest first. */
export function mergeWithSeedJobs(postedJobs: Job[]): Job[] {
  if (postedJobs.length === 0) return SEED_JOBS;
  return [...postedJobs, ...SEED_JOBS].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
}
