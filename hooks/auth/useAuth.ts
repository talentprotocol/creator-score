"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import type { AuthState, User, AuthProvider, AuthContext } from "@/lib/types";
import { env } from "@/lib/config";
import { ContextDetector } from "@/lib/auth/resolvers/ContextDetector";
import { usePrivyAuth } from "@/lib/auth/providers/PrivyProvider";
import { PostHogService } from "@/app/services/PostHogService";

// Farcaster provider hook (only available when wrapped in FarcasterProvider)
function useFarcasterAuth() {
  try {
    // Dynamic import to avoid errors when not in Farcaster context
    const { useFarcaster } = require("@/lib/auth/providers/FarcasterProvider");
    return useFarcaster();
  } catch {
    return null;
  }
}

export function useAuth() {
  // Get Privy auth state (only available when wrapped in PrivyProvider)
  let privyAuth: ReturnType<typeof usePrivyAuth> | null = null;
  try {
    // This will only work when component is wrapped in PrivyProvider
    privyAuth = usePrivyAuth();
  } catch {
    // Not in Privy context, will use dev mode or fallback
    privyAuth = null;
  }

  // Get Farcaster auth state (only available when wrapped in FarcasterProvider)
  const farcasterAuth = useFarcasterAuth();

  const [devAuthState, setDevAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    provider: null,
    context: "browser",
    loading: true,
    error: null,
  });

  /**
   * Initialize auth and detect context
   */
  const initialize = useCallback(async () => {
    try {
      const context = await detectContext();
      console.log("🚀 initialize: Detected context:", context);

      setDevAuthState((prev) => ({
        ...prev,
        context,
        loading: false,
      }));

      console.log("✅ initialize: Authentication initialized successfully");
    } catch (error) {
      console.error(
        "❌ initialize: Authentication initialization failed:",
        error
      );
      setDevAuthState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Auth initialization failed",
        loading: false,
      }));
    }
  }, []);

  const detectContext = useCallback(async (): Promise<AuthContext> => {
    return await ContextDetector.detect();
  }, []);

  const authenticate = useCallback(
    async (provider: AuthProvider, userData?: Partial<User>) => {
      try {
        // In dev mode, use mock authentication
        if (env.NEXT_PUBLIC_DEV_MODE) {
          setDevAuthState((prev) => ({ ...prev, loading: true, error: null }));

          const devUser: User = {
            id: "dev-user-123",
            walletAddress: "0x1234567890123456789012345678901234567890",
            fid: 12345,
            fname: "dev-user",
            authProvider: provider,
          };

          const context = await detectContext();

          // Identify user with PostHog
          PostHogService.identifyUser(devUser, context);

          setDevAuthState({
            isAuthenticated: true,
            user: devUser,
            provider,
            context,
            loading: false,
            error: null,
          });
          return;
        }

        // In production with Privy provider, use Privy's login
        if (privyAuth && provider === "privy") {
          privyAuth.login();
          return;
        }

        // Fallback for other cases
        const user: User = {
          id: userData?.id || "user-123",
          walletAddress: userData?.walletAddress,
          fid: userData?.fid,
          fname: userData?.fname,
          authProvider: provider,
        };

        const context = await detectContext();

        // Identify user with PostHog
        PostHogService.identifyUser(user, context);

        setDevAuthState({
          isAuthenticated: true,
          user,
          provider,
          context,
          loading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Authentication failed";

        if (env.NEXT_PUBLIC_DEV_MODE) {
          setDevAuthState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        }
      }
    },
    [detectContext, privyAuth]
  );

  const logout = useCallback(async () => {
    const context = await detectContext();

    // Reset PostHog identity on logout
    PostHogService.resetIdentity(context);

    // In dev mode, update local state
    if (env.NEXT_PUBLIC_DEV_MODE) {
      setDevAuthState({
        isAuthenticated: false,
        user: null,
        provider: null,
        context,
        loading: false,
        error: null,
      });
      return;
    }

    // In production with Privy, use Privy's logout
    if (privyAuth) {
      privyAuth.logout();
      return;
    }

    // Fallback
    setDevAuthState({
      isAuthenticated: false,
      user: null,
      provider: null,
      context,
      loading: false,
      error: null,
    });
  }, [detectContext, privyAuth]);

  useEffect(() => {
    // Initialize auth state
    initialize();
  }, [initialize]);

  // Auto-authenticate with Farcaster when user data becomes available
  useEffect(() => {
    if (farcasterAuth && farcasterAuth.user && !farcasterAuth.isLoading) {
      console.log(
        "🎯 Auto-authenticating with Farcaster user:",
        farcasterAuth.user
      );

      // Identify user with PostHog
      PostHogService.identifyUser(farcasterAuth.user, "farcaster_miniapp");

      // Update our state to reflect authentication
      setDevAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: farcasterAuth.user,
        provider: "farcaster",
        context: "farcaster_miniapp",
        loading: false,
        error: null,
      }));
    }
  }, [farcasterAuth?.user, farcasterAuth?.isLoading]);

  // Return appropriate auth state based on mode and available providers
  if (env.NEXT_PUBLIC_DEV_MODE) {
    console.log("🔍 useAuth: Using DEV MODE");
    return {
      ...devAuthState,
      authenticate,
      logout,
      initialize,
    };
  }

  // Check detected context first, then provider availability
  if (devAuthState.context === "farcaster_miniapp" && farcasterAuth) {
    console.log("🔍 useAuth: Using FARCASTER AUTH", { farcasterAuth });
    return {
      isAuthenticated: !!farcasterAuth.user && !farcasterAuth.isLoading,
      user: farcasterAuth.user,
      provider: "farcaster" as AuthProvider,
      context: "farcaster_miniapp" as AuthContext,
      loading: farcasterAuth.isLoading,
      error: farcasterAuth.error,
      authenticate,
      logout,
      initialize,
    };
  }

  // In browser context with Privy available, use Privy state
  if (devAuthState.context === "browser" && privyAuth) {
    console.log("🔍 useAuth: Using PRIVY AUTH", { privyAuth });
    return {
      ...privyAuth,
      context: devAuthState.context, // Always use our detected context
      authenticate,
      logout,
      initialize,
    };
  }

  // Fallback state (browser without Privy, or any other case)
  console.log(
    "🔍 useAuth: Using fallback state with context:",
    devAuthState.context,
    { devAuthState }
  );
  return {
    ...devAuthState,
    authenticate,
    logout,
    initialize,
  };
}
