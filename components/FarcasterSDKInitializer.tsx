"use client";

import { useEffect, useState } from "react";

export function FarcasterSDKInitializer() {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    async function initSDK() {
      try {
        // Dynamic import to handle cases where SDK might not be available
        const { sdk } = await import("@farcaster/miniapp-sdk");

        // Call ready to initialize the SDK
        await sdk.actions.ready();
      } catch {
        // If this is not the final retry, attempt again
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          // Small delay before retry
          setTimeout(() => initSDK(), 500 + retryCount * 200);
        }
      }
    }

    initSDK();
  }, [retryCount]);

  return null; // This component doesn't render anything
}
