"use client";

import { useEffect } from "react";

export function FarcasterSDKInitializer() {
  useEffect(() => {
    let isInitialized = false;

    const initializeFarcasterSDK = async () => {
      // Prevent multiple initializations
      if (isInitialized) return;

      try {
        console.log("🚀 Attempting to initialize Farcaster SDK...");

        // Try to import and initialize the SDK
        const { sdk } = await import("@farcaster/miniapp-sdk");

        console.log("📱 Farcaster SDK imported successfully");

        // Call ready() to signal the app has loaded
        await sdk.actions.ready();

        console.log("✅ Farcaster SDK ready() called successfully");
        isInitialized = true;
      } catch (error) {
        console.log(
          "⚠️ Farcaster SDK initialization failed (expected if not in Farcaster context):",
          error
        );
      }
    };

    // Initialize immediately
    initializeFarcasterSDK();

    // Also try again after a short delay in case of timing issues
    const timeoutId = setTimeout(() => {
      if (!isInitialized) {
        console.log("🔄 Retrying Farcaster SDK initialization...");
        initializeFarcasterSDK();
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
