"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuthState, User, AuthProvider, AuthContext } from "@/lib/types";
import { env } from "@/lib/config";
import { ContextDetector } from "@/lib/auth";
import { usePrivyAuth } from "@/lib/auth/providers/PrivyProvider";

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

  const [devAuthState, setDevAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    provider: null,
    context: "browser",
    loading: true,
    error: null,
  });

  const detectContext = useCallback(async (): Promise<AuthContext> => {
    return await ContextDetector.detectFromClient();
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
    // In dev mode, update local state
    if (env.NEXT_PUBLIC_DEV_MODE) {
      const context = await detectContext();
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
    const context = await detectContext();
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
    async function initializeAuth() {
      const context = await detectContext();

      // Auto-authenticate in dev mode
      if (env.NEXT_PUBLIC_DEV_MODE) {
        const devUser: User = {
          id: "dev-user-123",
          walletAddress: "0x1234567890123456789012345678901234567890",
          fid: 12345,
          fname: "dev-user",
          authProvider: "privy",
        };

        setDevAuthState({
          isAuthenticated: true,
          user: devUser,
          provider: "privy",
          context,
          loading: false,
          error: null,
        });
      } else {
        setDevAuthState((prev) => ({ ...prev, context, loading: false }));
      }
    }

    initializeAuth();
  }, [detectContext]);

  // Return appropriate auth state based on mode
  if (env.NEXT_PUBLIC_DEV_MODE) {
    return {
      ...devAuthState,
      authenticate,
      logout,
    };
  }

  // In production, use Privy state if available
  if (privyAuth) {
    return {
      ...privyAuth,
      authenticate,
      logout,
    };
  }

  // Fallback state
  return {
    ...devAuthState,
    authenticate,
    logout,
  };
}
