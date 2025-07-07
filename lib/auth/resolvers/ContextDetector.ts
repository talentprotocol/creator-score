import type { AuthContext } from "@/lib/types";

export class ContextDetector {
  /**
   * Detect the authentication context (browser vs farcaster)
   */
  static async detect(): Promise<AuthContext> {
    try {
      // Try Farcaster SDK detection first
      const context = await this.detectFarcasterContext();
      const heuristicResult = this.detectHeuristicContext();

      if (process.env.NODE_ENV === "development") {
        console.log("Farcaster SDK context:", context);
        console.log("Heuristic detection result:", heuristicResult);
      }

      if (context === "farcaster_miniapp") {
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Farcaster SDK detected mini app context");
        }
        return "farcaster_miniapp";
      }

      // SDK failed or unavailable, use heuristic detection
      if (context === null) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "⚠️ Farcaster SDK failed to initialize - this is expected if running outside Farcaster"
          );
        }
      }

      if (heuristicResult === "farcaster_miniapp") {
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Using heuristic detection due to SDK failure");
        }
        return "farcaster_miniapp";
      }

      if (process.env.NODE_ENV === "development") {
        console.log("🌐 Defaulting to browser context");
      }
      return "browser";
    } catch (error) {
      console.error("Context detection failed:", error);
      return "browser"; // Fallback to browser on any error
    }
  }

  /**
   * Try to detect Farcaster context using the SDK
   */
  private static async detectFarcasterContext(): Promise<AuthContext | null> {
    try {
      // Check if we're in an iframe (potential Farcaster context)
      if (typeof window === "undefined" || window === window.parent) {
        return null;
      }

      // Wait a bit for the SDK to initialize
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check for Farcaster SDK
      if (
        (
          window as {
            farcasterSdk?: { context?: { client?: { clientFid?: string } } };
          }
        ).farcasterSdk?.context?.client?.clientFid
      ) {
        return "farcaster_miniapp";
      }

      return null;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("⚠️ Farcaster SDK failed to initialize:", error);
      }
      return null;
    }
  }

  /**
   * Heuristic detection based on environment clues
   */
  private static detectHeuristicContext(): AuthContext {
    try {
      const result = this.fallbackDetection();

      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Fallback Detection Debug:", {
          isInFrame: window !== window.parent,
          referrer: document.referrer,
          isFarcasterReferrer: document.referrer.includes("warpcast.com"),
          hasFarcasterParams: window.location.search.includes("fid="),
          parentHasFarcaster: this.checkParentForFarcaster(),
          userAgent: navigator.userAgent,
        });
      }

      return result;
    } catch (error) {
      console.error("Heuristic detection failed:", error);
      return "browser";
    }
  }

  /**
   * Fallback detection logic
   */
  private static fallbackDetection(): AuthContext {
    // Multiple heuristics to detect Farcaster context
    const isInFrame = window !== window.parent;
    const isFarcasterReferrer = document.referrer.includes("warpcast.com");
    const hasFarcasterParams = window.location.search.includes("fid=");
    const parentHasFarcaster = this.checkParentForFarcaster();

    const result =
      isInFrame &&
      (isFarcasterReferrer || hasFarcasterParams || parentHasFarcaster)
        ? "farcaster_miniapp"
        : "browser";

    if (process.env.NODE_ENV === "development") {
      console.log(`🎯 Fallback detection result: ${result}`);
    }

    return result;
  }

  /**
   * Check if parent window has Farcaster indicators
   */
  private static checkParentForFarcaster(): boolean {
    try {
      // Try to access parent window properties (may fail due to CORS)
      return !!(window.parent as { farcasterSdk?: unknown }).farcasterSdk;
    } catch {
      // CORS prevents access, but this itself might indicate we're in a frame
      return false;
    }
  }
}
