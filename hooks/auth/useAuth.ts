"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuthState, User, AuthProvider, AuthContext } from "@/lib/types";
import { env } from "@/lib/config";
import { ContextDetector } from "@/lib/auth";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    provider: null,
    context: "browser",
    loading: true,
    error: null,
  });

  const detectContext = useCallback((): AuthContext => {
    return ContextDetector.detectFromClient();
  }, []);

  const authenticate = useCallback(
    async (provider: AuthProvider, userData?: Partial<User>) => {
      try {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }));

        // Development mode bypass
        if (env.NEXT_PUBLIC_DEV_MODE) {
          const devUser: User = {
            id: "dev-user-123",
            walletAddress: "0x1234567890123456789012345678901234567890",
            fid: 12345,
            fname: "dev-user",
            authProvider: provider,
          };

          setAuthState({
            isAuthenticated: true,
            user: devUser,
            provider,
            context: detectContext(),
            loading: false,
            error: null,
          });
          return;
        }

        // Real authentication logic would go here
        const user: User = {
          id: userData?.id || "user-123",
          walletAddress: userData?.walletAddress,
          fid: userData?.fid,
          fname: userData?.fname,
          authProvider: provider,
        };

        setAuthState({
          isAuthenticated: true,
          user,
          provider,
          context: detectContext(),
          loading: false,
          error: null,
        });
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : "Authentication failed",
        }));
      }
    },
    [detectContext]
  );

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      provider: null,
      context: detectContext(),
      loading: false,
      error: null,
    });
  }, [detectContext]);

  useEffect(() => {
    // Initialize auth state
    const context = detectContext();

    // Auto-authenticate in dev mode
    if (env.NEXT_PUBLIC_DEV_MODE) {
      const devUser: User = {
        id: "dev-user-123",
        walletAddress: "0x1234567890123456789012345678901234567890",
        fid: 12345,
        fname: "dev-user",
        authProvider: "privy",
      };

      setAuthState({
        isAuthenticated: true,
        user: devUser,
        provider: "privy",
        context,
        loading: false,
        error: null,
      });
    } else {
      setAuthState((prev) => ({ ...prev, context, loading: false }));
    }
  }, [detectContext]);

  return {
    ...authState,
    authenticate,
    logout,
  };
}
