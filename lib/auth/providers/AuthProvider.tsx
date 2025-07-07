"use client";

import React, { useEffect, useState } from "react";
import { PrivyProvider } from "./PrivyProvider";
import { FarcasterProvider } from "./FarcasterProvider";
import { ContextDetector } from "../resolvers/ContextDetector";
import { env } from "@/lib/config";
import type { ComponentProps, AuthContext } from "@/lib/types";

interface AuthProviderProps extends ComponentProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authContext, setAuthContext] = useState<AuthContext>("browser");
  const [, setIsDetecting] = useState(true);

  useEffect(() => {
    async function detectAuthContext() {
      try {
        // Detect authentication context on the client side
        const detected = await ContextDetector.detect();
        setAuthContext(detected);
      } catch (error) {
        console.error("Failed to detect auth context:", error);
        // Fallback to browser context
        setAuthContext("browser");
      } finally {
        setIsDetecting(false);
      }
    }

    detectAuthContext();
  }, []);

  // In dev mode, skip external auth providers
  if (env.NEXT_PUBLIC_DEV_MODE) {
    return <>{children}</>;
  }

  // Only render Privy if we have a valid app ID
  const hasValidPrivyAppId =
    env.NEXT_PUBLIC_PRIVY_APP_ID && env.NEXT_PUBLIC_PRIVY_APP_ID.trim() !== "";

  // Render appropriate provider based on context
  if (authContext === "farcaster_miniapp") {
    // In Farcaster context, only use Farcaster authentication
    // Privy cannot work inside iframes due to security restrictions
    return <FarcasterProvider>{children}</FarcasterProvider>;
  }

  // In browser context, only use Privy (if available)
  if (hasValidPrivyAppId) {
    return <PrivyProvider>{children}</PrivyProvider>;
  }

  // Fallback without Privy in browser context
  return <>{children}</>;
}
