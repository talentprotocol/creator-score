"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  ComponentProps,
  User,
  FarcasterMiniAppStatus,
  FarcasterMiniAppActions,
  FarcasterContextData,
} from "@/lib/types";
import React from "react";
import { FarcasterSDKInitializer } from "@/components/FarcasterSDKInitializer";

// Type for Farcaster SDK (simplified version to avoid import issues)
type FarcasterSDK = {
  actions: {
    ready: () => Promise<void>;
    openUrl: (url: string) => Promise<void>;
  };
  context: Promise<{
    user?: {
      fid: number;
      username?: string;
      displayName?: string;
      pfpUrl?: string;
    };
    location?: unknown;
  }>;
};

interface FarcasterContextValue {
  sdk: FarcasterSDK | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // Mini app specific properties
  miniAppStatus: FarcasterMiniAppStatus;
  miniAppActions: FarcasterMiniAppActions;
  contextData: FarcasterContextData | null;
}

// Create context with default values
const FarcasterContext = React.createContext<FarcasterContextValue>({
  sdk: null,
  user: null,
  isLoading: true,
  error: null,
  miniAppStatus: {
    isAdded: false,
    notificationsEnabled: false,
    isLoading: true,
    error: null,
  },
  miniAppActions: {
    addMiniApp: async () => false,
    requestNotificationPermission: async () => false,
    getStatus: async () => ({
      isAdded: false,
      notificationsEnabled: false,
      isLoading: false,
      error: null,
    }),
  },
  contextData: null,
});

interface FarcasterProviderProps extends ComponentProps {
  children: React.ReactNode;
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [sdkInstance, setSdkInstance] = useState<FarcasterSDK | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [miniAppStatus, setMiniAppStatus] = useState<FarcasterMiniAppStatus>({
    isAdded: false,
    notificationsEnabled: false,
    isLoading: true,
    error: null,
  });
  const [contextData, setContextData] = useState<FarcasterContextData | null>(
    null
  );

  // Mini app actions
  const addMiniApp = useCallback(async (): Promise<boolean> => {
    if (!sdkInstance) return false;

    try {
      // Use openUrl to navigate - the add functionality would be handled by the frame URL
      await sdkInstance.actions.openUrl(`${window.location.origin}?add=true`);
      setMiniAppStatus((prev) => ({ ...prev, isAdded: true }));
      return true;
    } catch (error) {
      console.error("Failed to add mini app:", error);
      setMiniAppStatus((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to add mini app",
      }));
      return false;
    }
  }, [sdkInstance]);

  const requestNotificationPermission =
    useCallback(async (): Promise<boolean> => {
      if (!sdkInstance) return false;

      try {
        // Notification permission API might not be available in current SDK version
        // This is a placeholder for future implementation
        console.log("Requesting notification permission...");
        setMiniAppStatus((prev) => ({ ...prev, notificationsEnabled: true }));
        return true;
      } catch (error) {
        console.error("Failed to request notification permission:", error);
        setMiniAppStatus((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Failed to request notification permission",
        }));
        return false;
      }
    }, [sdkInstance]);

  const getStatus = useCallback(async (): Promise<FarcasterMiniAppStatus> => {
    if (!sdkInstance) {
      return {
        isAdded: false,
        notificationsEnabled: false,
        isLoading: false,
        error: "SDK not initialized",
      };
    }

    try {
      // Check if the mini app context is available
      const context = await sdkInstance.context;
      const isAdded = !!context;

      return {
        isAdded,
        notificationsEnabled: miniAppStatus.notificationsEnabled,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      return {
        isAdded: false,
        notificationsEnabled: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to get status",
      };
    }
  }, [sdkInstance, miniAppStatus.notificationsEnabled]);

  const miniAppActions: FarcasterMiniAppActions = {
    addMiniApp,
    requestNotificationPermission,
    getStatus,
  };

  useEffect(() => {
    let mounted = true;

    async function initializeFarcasterSDK() {
      try {
        // Check if we're in a browser environment
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        // Dynamically import and initialize Farcaster SDK
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();

        if (mounted) {
          setSdkInstance(sdk);
        }

        // Get context data
        const context = await sdk.context;

        if (!context || !context.user) {
          console.log("No user context available");
          if (mounted) {
            setError("No user context available");
            setIsLoading(false);
          }
          return;
        }

        // Transform Farcaster user data to our User interface
        // Using only properties that exist in the SDK
        const farcasterUser: User = {
          id: `farcaster_${context.user.fid}`,
          fid: context.user.fid,
          fname: context.user.username,
          displayName: context.user.displayName,
          pfpUrl: context.user.pfpUrl,
          walletAddress: undefined, // Will be available if user has connected wallet
          authProvider: "farcaster",
        };

        // Set up context data using available properties
        const farcasterContextData: FarcasterContextData = {
          user: {
            fid: context.user.fid,
            username: context.user.username,
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
            bio: undefined,
            followerCount: undefined,
            followingCount: undefined,
            addresses: [],
          },
          location: context.location
            ? {
                type: "unknown",
                context: {},
              }
            : null,
          miniApp: {
            isAdded: true, // If we have context, the mini app is available
            notificationsEnabled: false, // Will be updated based on user actions
            isLoading: false,
            error: null,
          },
        };

        if (mounted) {
          setUser(farcasterUser);
          setContextData(farcasterContextData);
          setMiniAppStatus({
            isAdded: true,
            notificationsEnabled: false,
            isLoading: false,
            error: null,
          });
          setError(null);
        }
      } catch (initError) {
        console.error("Failed to initialize Farcaster SDK:", initError);
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
    sdk: sdkInstance,
    user,
    isLoading,
    error,
    miniAppStatus,
    miniAppActions,
    contextData,
  };

  return (
    <FarcasterContext.Provider value={contextValue}>
      <FarcasterSDKInitializer />
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
