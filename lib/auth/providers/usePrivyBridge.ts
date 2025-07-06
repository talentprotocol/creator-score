"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import type { AuthState, User } from "@/lib/types";

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

      setAuthState({
        isAuthenticated: true,
        user: transformedUser,
        provider: "privy" as const,
        context: "browser",
        loading: false,
        error: null,
      });
    } else {
      // Not authenticated
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

  const handleLogout = async () => {
    try {
      await privyLogout();

      // Check if user has external wallets connected
      const hasExternalWallet = privyUser?.linkedAccounts?.some(
        (account) =>
          account.type === "wallet" && account.walletClientType === "metamask"
      );

      if (hasExternalWallet) {
        // Inform user about manual disconnection requirement
        console.warn(
          "External wallet (MetaMask) remains connected. " +
            "To fully disconnect, manually disconnect from your wallet extension."
        );

        // You could also show a toast notification here
        // toast.info("Please manually disconnect from your wallet extension to complete logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setAuthState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Logout failed",
      }));
    }
  };

  return {
    ...authState,
    login,
    logout: handleLogout,
  };
}
