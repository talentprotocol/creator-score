"use client";

import { useQuery } from "@tanstack/react-query";
import type { User, AuthProvider, ApiResponse } from "@/lib/types";
import { CACHE_DURATIONS } from "@/lib/config";

interface UseUserResolverOptions {
  identifier: string | null;
  authProvider: AuthProvider;
  additionalData?: {
    fid?: number;
    fname?: string;
    walletAddress?: string;
  };
}

export function useUserResolver({
  identifier,
  authProvider,
  additionalData,
}: UseUserResolverOptions) {
  return useQuery({
    queryKey: ["user-resolver", identifier, authProvider, additionalData],
    queryFn: async (): Promise<User> => {
      if (!identifier) {
        throw new Error("No identifier provided");
      }

      const response = await fetch("/api/user/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          authProvider,
          additionalData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to resolve user: ${response.statusText}`);
      }

      const data: ApiResponse<User> = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.data) {
        throw new Error("No user data received");
      }

      return data.data;
    },
    enabled: !!identifier && !!authProvider,
    staleTime: CACHE_DURATIONS.PROFILE_DATA,
    retry: 2,
  });
}

// Convenience hooks for specific identifier types
export function useUserByWallet(
  walletAddress: string | null,
  authProvider: AuthProvider = "privy"
) {
  return useUserResolver({
    identifier: walletAddress,
    authProvider,
    additionalData: { walletAddress: walletAddress || undefined },
  });
}

export function useUserByFID(
  fid: number | null,
  authProvider: AuthProvider = "farcaster"
) {
  return useUserResolver({
    identifier: fid?.toString() || null,
    authProvider,
    additionalData: { fid: fid || undefined },
  });
}

export function useUserByFname(
  fname: string | null,
  authProvider: AuthProvider = "farcaster"
) {
  return useUserResolver({
    identifier: fname,
    authProvider,
    additionalData: { fname: fname || undefined },
  });
}
