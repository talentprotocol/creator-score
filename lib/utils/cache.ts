import { unstable_cache as next_unstable_cache } from "next/cache";
import { cache } from "react";

export const CACHE_DURATIONS = {
  PROFILE_DATA: 5 * 60 * 1000, // 5 minutes
  SCORE_DATA: 30 * 60 * 1000, // 30 minutes
  LEADERBOARD: 5 * 60 * 1000, // 5 minutes
  REWARDS: {
    SPONSORS_DATA: 60 * 60 * 1000, // 1 hour
    GRANTS_DATA: 60 * 60 * 1000, // 1 hour
  },
} as const;

export const CACHE_KEYS = {
  REWARDS: {
    SPONSORS_DATA: "sponsors",
    GRANTS_DATA: "grants",
  },
} as const;

export const unstable_cache = <Inputs extends unknown[], Output>(
  callback: (...args: Inputs) => Promise<Output>,
  key: string[],
  options: { revalidate: number }
) => cache(next_unstable_cache(callback, key, options));
