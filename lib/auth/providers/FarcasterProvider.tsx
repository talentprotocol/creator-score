"use client";

import { useEffect, useState } from "react";
import type { ComponentProps, User } from "@/lib/types";
import React from "react";

interface FarcasterContextValue {
  sdk: { initialized: boolean } | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const FarcasterContext = React.createContext<FarcasterContextValue>({
  sdk: null,
  user: null,
  isLoading: true,
  error: null,
});

interface FarcasterProviderProps extends ComponentProps {
  children: React.ReactNode;
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [sdk, setSdk] = useState<{ initialized: boolean } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeFarcasterSDK() {
      try {
        // Check if we're in a Farcaster frame context
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        // For now, we'll implement a basic check and placeholder
        // TODO: Implement proper Farcaster SDK integration once we have the correct API patterns

        // Basic frame detection
        const isInFrame = window.parent !== window;
        const referrer = document.referrer.toLowerCase();
        const isFarcasterReferrer =
          referrer.includes("farcaster") || referrer.includes("warpcast");

        if (isInFrame && isFarcasterReferrer) {
          // Placeholder user - in real implementation this would come from the SDK
          const mockFarcasterUser: User = {
            id: "farcaster_user_123",
            fid: 12345,
            fname: "farcaster-user",
            walletAddress: "0x1234567890123456789012345678901234567890",
            authProvider: "farcaster",
          };

          if (mounted) {
            setUser(mockFarcasterUser);
            setSdk({ initialized: true }); // Placeholder SDK object
          }
        }
      } catch (initError) {
        console.error("Failed to initialize Farcaster context:", initError);
        if (mounted) {
          setError("Failed to initialize Farcaster authentication");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeFarcasterSDK();

    return () => {
      mounted = false;
    };
  }, []);

  const contextValue: FarcasterContextValue = {
    sdk,
    user,
    isLoading,
    error,
  };

  return (
    <FarcasterContext.Provider value={contextValue}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  const context = React.useContext(FarcasterContext);
  if (context === undefined) {
    throw new Error("useFarcaster must be used within a FarcasterProvider");
  }
  return context;
}
