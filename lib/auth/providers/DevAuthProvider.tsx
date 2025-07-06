"use client";

import React, { useEffect, useState } from "react";
import type { ComponentProps, AuthState, AuthProvider } from "@/lib/types";
import { env } from "@/lib/config";

interface DevAuthContextValue extends AuthState {
  switchProvider: (provider: AuthProvider) => void;
  switchUser: (userType: "default" | "builder" | "new") => void;
}

const DevAuthContext = React.createContext<DevAuthContextValue | undefined>(
  undefined
);

interface DevAuthProviderProps extends ComponentProps {
  children: React.ReactNode;
}

// Mock users for different scenarios
const mockUsers = {
  default: {
    id: "dev-user-123",
    walletAddress: "0x1234567890123456789012345678901234567890",
    fid: 12345,
    fname: "dev-user",
    authProvider: "privy" as AuthProvider,
  },
  builder: {
    id: "dev-builder-456",
    walletAddress: "0x9876543210987654321098765432109876543210",
    fid: 67890,
    fname: "dev-builder",
    authProvider: "farcaster" as AuthProvider,
  },
  new: {
    id: "dev-new-789",
    walletAddress: "0x5555555555555555555555555555555555555555",
    fid: 99999,
    fname: "new-user",
    authProvider: "privy" as AuthProvider,
  },
} as const;

export function DevAuthProvider({ children }: DevAuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    provider: null,
    context: "browser",
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (env.NEXT_PUBLIC_DEV_MODE) {
      // Auto-authenticate with default user in dev mode
      setAuthState({
        isAuthenticated: true,
        user: mockUsers.default,
        provider: "privy",
        context: "browser",
        loading: false,
        error: null,
      });
    } else {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const switchProvider = (provider: AuthProvider) => {
    if (!env.NEXT_PUBLIC_DEV_MODE) return;

    setAuthState((prev) => ({
      ...prev,
      provider,
      user: prev.user ? { ...prev.user, authProvider: provider } : null,
      context: provider === "farcaster" ? "farcaster_miniapp" : "browser",
    }));
  };

  const switchUser = (userType: keyof typeof mockUsers) => {
    if (!env.NEXT_PUBLIC_DEV_MODE) return;

    setAuthState((prev) => ({
      ...prev,
      user: mockUsers[userType],
      provider: mockUsers[userType].authProvider,
      isAuthenticated: true,
    }));
  };

  const contextValue: DevAuthContextValue = {
    ...authState,
    switchProvider,
    switchUser,
  };

  // Show dev controls if in dev mode
  if (env.NEXT_PUBLIC_DEV_MODE) {
    return (
      <DevAuthContext.Provider value={contextValue}>
        {children}
        <DevControls />
      </DevAuthContext.Provider>
    );
  }

  // In production, don't provide dev context
  return <>{children}</>;
}

function DevControls() {
  const auth = useDevAuth();

  if (!env.NEXT_PUBLIC_DEV_MODE || !auth) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg max-w-xs">
      <div className="text-xs font-medium text-yellow-800 mb-2">DEV MODE</div>
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium">User:</span>
          <select
            value={auth.user?.fname || "none"}
            onChange={(e) => {
              const userType = Object.entries(mockUsers).find(
                ([, user]) => user.fname === e.target.value
              )?.[0] as keyof typeof mockUsers;
              if (userType) auth.switchUser(userType);
            }}
            className="ml-1 text-xs bg-white border rounded px-1"
          >
            <option value="dev-user">dev-user</option>
            <option value="dev-builder">dev-builder</option>
            <option value="new-user">new-user</option>
          </select>
        </div>
        <div>
          <span className="font-medium">Provider:</span>
          <select
            value={auth.provider || "none"}
            onChange={(e) =>
              auth.switchProvider(e.target.value as AuthProvider)
            }
            className="ml-1 text-xs bg-white border rounded px-1"
          >
            <option value="privy">privy</option>
            <option value="farcaster">farcaster</option>
          </select>
        </div>
        <div className="text-yellow-700">Context: {auth.context}</div>
      </div>
    </div>
  );
}

export function useDevAuth() {
  const context = React.useContext(DevAuthContext);
  if (context === undefined && env.NEXT_PUBLIC_DEV_MODE) {
    throw new Error("useDevAuth must be used within a DevAuthProvider");
  }
  return context;
}
