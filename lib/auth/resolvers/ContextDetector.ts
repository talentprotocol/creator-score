import type { AuthContext } from "@/lib/types";

interface WindowWithFarcaster extends Window {
  parent: Window;
  farcaster?: unknown;
}

export class ContextDetector {
  /**
   * Detect the current authentication context
   */
  static async detect(): Promise<AuthContext> {
    try {
      const sdkResult = await this.detectSDK();
      const heuristicResult = this.detectHeuristic();

      // If SDK detection works, prioritize it
      if (sdkResult) {
        return sdkResult;
      }

      // Fall back to heuristic detection
      return heuristicResult;
    } catch (error) {
      console.error("Context detection failed:", error);
      return "browser"; // Safe fallback
    }
  }

  /**
   * Try to detect Farcaster context using the SDK
   */
  private static async detectSDK(): Promise<AuthContext | null> {
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        return null;
      }

      // Try to access Farcaster SDK
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        const context = await sdk.context;

        if (context && context.user) {
          return "farcaster_miniapp";
        }
      } catch {
        // SDK not available or failed to load
        return null;
      }

      // Try alternative detection via window object
      const windowWithFarcaster = window as WindowWithFarcaster;
      if (
        typeof window !== "undefined" &&
        window !== windowWithFarcaster.parent
      ) {
        const farcasterSDK = windowWithFarcaster.farcaster;
        if (farcasterSDK) {
          return "farcaster_miniapp";
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Heuristic detection based on environment clues
   */
  private static detectHeuristic(): AuthContext {
    try {
      if (typeof window === "undefined") {
        return "browser";
      }

      const isInFrame = window !== window.parent;
      const referrer = typeof document !== "undefined" ? document.referrer : "";
      const currentUrl = window.location.href;

      // Detect Farcaster context
      const farcasterIndicators = {
        isFramed: isInFrame,
        hasFarcasterReferrer:
          referrer.includes("farcaster.xyz") ||
          referrer.includes("warpcast.com"),
        hasPreviewParam: currentUrl.includes("preview="),
        isLocalhost: currentUrl.includes("localhost"),
      };

      // If we have strong indicators of Farcaster context
      if (
        farcasterIndicators.isFramed &&
        (farcasterIndicators.hasFarcasterReferrer ||
          farcasterIndicators.hasPreviewParam)
      ) {
        return "farcaster_miniapp";
      }

      return "browser";
    } catch (error) {
      console.error("Heuristic detection failed:", error);
      return "browser";
    }
  }
}
