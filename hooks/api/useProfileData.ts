"use client";

import { useQuery } from "@tanstack/react-query";
import type { TalentProfile, ApiResponse } from "@/lib/types";
import { CACHE_DURATIONS } from "@/lib/config";

export function useProfileData(identifier: string | null) {
  return useQuery({
    queryKey: ["profile", identifier],
    queryFn: async (): Promise<TalentProfile> => {
      if (!identifier) {
        throw new Error("No identifier provided");
      }

      const response = await fetch(
        `/api/talent/profile?identifier=${encodeURIComponent(identifier)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data: ApiResponse<TalentProfile> = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.data) {
        throw new Error("No profile data received");
      }

      return data.data;
    },
    enabled: !!identifier,
    staleTime: CACHE_DURATIONS.PROFILE_DATA,
    retry: 2,
  });
}
