"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, GrantsResult, SponsorsResult } from "@/lib/types";
import { CACHE_DURATIONS, CACHE_KEYS } from "@/lib/utils/cache";

export function useSponsorsData() {
  return useQuery({
    queryKey: [CACHE_KEYS.REWARDS.SPONSORS_DATA],
    queryFn: async (): Promise<SponsorsResult> => {
      const response = await fetch("/api/rewards/sponsors");

      if (!response.ok) {
        throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
      }

      const data: ApiResponse<SponsorsResult> = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.data) {
        throw new Error("No sponsors data received");
      }

      return data.data;
    },
    staleTime: CACHE_DURATIONS.REWARDS.SPONSORS_DATA,
    retry: 2,
  });
}

export function useGrantsData(sponsorSlug: string) {
  return useQuery({
    queryKey: [CACHE_KEYS.REWARDS.GRANTS_DATA, sponsorSlug],
    queryFn: async (): Promise<GrantsResult> => {
      if (!sponsorSlug) {
        throw new Error("No sponsor slug provided");
      }

      const response = await fetch(
        `/api/rewards/grants?sponsorSlug=${encodeURIComponent(sponsorSlug)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch grants: ${response.statusText}`);
      }

      const data: ApiResponse<GrantsResult> = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.data) {
        throw new Error("No profile data received");
      }

      return data.data;
    },
    enabled: !!sponsorSlug,
    staleTime: CACHE_DURATIONS.REWARDS.GRANTS_DATA,
    retry: 2,
  });
}
