"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import type { AuthState, User } from "@/lib/types";
import { PostHogService } from "@/app/services/PostHogService";

/**
 * Bridge hook that connects Privy's auth state with our AuthState interface
 * This maintains compatibility with existing components while using real Privy authentication
 */
export function usePrivyBridge(): AuthState & {
  login: () => void;
  logout: () => void;
} {
  const {
    ready,
    authenticated,
    user: privyUser,
    login,
    logout: privyLogout,
  } = usePrivy();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    provider: null,
    context: "browser",
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!ready) {
      // Privy is still initializing
      setAuthState((prev) => ({ ...prev, loading: true }));
      return;
    }

    if (authenticated && privyUser) {
      // Transform Privy user to our User interface
      const transformedUser: User = {
        id: privyUser.id,
        walletAddress: privyUser.wallet?.address || undefined,
        fid: privyUser.farcaster?.fid || undefined,
        fname: privyUser.farcaster?.username || undefined,
        authProvider: "privy" as const,
      };

      // Identify user with PostHog
      PostHogService.identifyUser(transformedUser, "browser");

      setAuthState({
        isAuthenticated: true,
        user: transformedUser,
        provider: "privy" as const,
        context: "browser",
        loading: false,
        error: null,
      });
    } else {
      // Not authenticated - reset PostHog identity
      PostHogService.resetIdentity("browser");

      setAuthState({
        isAuthenticated: false,
        user: null,
        provider: null,
        context: "browser",
        loading: false,
        error: null,
      });
    }
  }, [ready, authenticated, privyUser]);

  const wrappedLogout = () => {
    // Track logout intent before calling Privy logout
    PostHogService.trackLogoutInitiated("browser", "privy");
    privyLogout();
  };

  return {
    ...authState,
    login,
    logout: wrappedLogout,
  };
}
