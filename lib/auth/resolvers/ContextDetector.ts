import type { AuthContext } from "@/lib/types";

// Type definitions for Farcaster SDK on window object
interface FarcasterWindow extends Window {
  farcasterSdk?: {
    context?: {
      client?: {
        clientFid?: string;
      };
    };
  };
  farcaster?: {
    context?: unknown;
  };
  sdk?: {
    context?: unknown;
  };
}

export class ContextDetector {
  /**
   * Detect the authentication context (browser vs farcaster)
   */
  static async detect(): Promise<AuthContext> {
    try {
      // Try Farcaster SDK detection first
      const context = await this.detectFarcasterContext();
      const heuristicResult = this.detectHeuristicContext();

      console.log("🔍 Context Detection Debug:", {
        sdkResult: context,
        heuristicResult: heuristicResult,
        isInFrame:
          typeof window !== "undefined" ? window !== window.parent : false,
        referrer:
          typeof document !== "undefined" ? document.referrer : "unknown",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        currentUrl:
          typeof window !== "undefined" ? window.location.href : "unknown",
      });

      if (context === "farcaster_miniapp") {
        console.log("✅ Farcaster SDK detected mini app context");
        return "farcaster_miniapp";
      }

      if (heuristicResult === "farcaster_miniapp") {
        console.log("✅ Using heuristic detection for Farcaster context");
        return "farcaster_miniapp";
      }

      console.log("🌐 Defaulting to browser context");
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
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        return null;
      }

      // Wait a bit for the SDK to initialize
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Try to dynamically import and check the SDK
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");

        // Check if SDK context is available
        const context = await sdk.context;
        if (context && context.user) {
          console.log("🎯 Farcaster SDK context found:", context);
          return "farcaster_miniapp";
        }
      } catch (sdkError) {
        console.log("⚠️ Farcaster SDK not available or failed:", sdkError);
      }

      // Check for Farcaster SDK on window object (multiple possible paths)
      const windowObj = window as FarcasterWindow;

      if (
        windowObj.farcasterSdk?.context?.client?.clientFid ||
        windowObj.farcaster?.context ||
        windowObj.sdk?.context
      ) {
        console.log("🎯 Farcaster SDK found on window object");
        return "farcaster_miniapp";
      }

      return null;
    } catch (error) {
      console.log("⚠️ Farcaster SDK detection failed:", error);
      return null;
    }
  }

  /**
   * Heuristic detection based on environment clues
   */
  private static detectHeuristicContext(): AuthContext {
    try {
      if (typeof window === "undefined") {
        return "browser";
      }

      const isInFrame = window !== window.parent;
      const referrer = document.referrer.toLowerCase();
      const userAgent = navigator.userAgent.toLowerCase();
      const currentUrl = window.location.href.toLowerCase();

      // Check for Farcaster indicators
      const farcasterIndicators = [
        // Referrer-based detection
        referrer.includes("warpcast"),
        referrer.includes("farcaster"),

        // User agent detection
        userAgent.includes("farcaster"),
        userAgent.includes("warpcast"),

        // URL-based detection
        currentUrl.includes("fid="),
        currentUrl.includes("farcaster"),

        // Frame detection with additional checks
        isInFrame &&
          (referrer.includes("app") ||
            referrer.includes("client") ||
            referrer.length > 0), // Any referrer when in frame could be Farcaster

        // Check for parent window indicators
        this.checkParentForFarcaster(),

        // Check for preview context (often used in dev tools)
        currentUrl.includes("preview"),
      ];

      const hasAnyIndicator = farcasterIndicators.some(
        (indicator) => indicator
      );

      console.log("🔍 Heuristic Detection:", {
        isInFrame,
        referrer,
        userAgent: userAgent.substring(0, 100) + "...",
        currentUrl: currentUrl.substring(0, 100) + "...",
        indicators: {
          warpcastReferrer: referrer.includes("warpcast"),
          farcasterReferrer: referrer.includes("farcaster"),
          farcasterUserAgent: userAgent.includes("farcaster"),
          hasFidParam: currentUrl.includes("fid="),
          isInFrameWithReferrer: isInFrame && referrer.length > 0,
          parentHasFarcaster: this.checkParentForFarcaster(),
          isPreview: currentUrl.includes("preview"),
        },
        result: hasAnyIndicator ? "farcaster_miniapp" : "browser",
      });

      return hasAnyIndicator ? "farcaster_miniapp" : "browser";
    } catch (error) {
      console.error("Heuristic detection failed:", error);
      return "browser";
    }
  }

  /**
   * Check if parent window has Farcaster indicators
   */
  private static checkParentForFarcaster(): boolean {
    try {
      if (typeof window === "undefined" || window === window.parent) {
        return false;
      }

      // Try to access parent window properties (may fail due to CORS)
      const parentObj = window.parent as FarcasterWindow;
      return !!(parentObj.farcasterSdk || parentObj.farcaster || parentObj.sdk);
    } catch {
      // CORS prevents access, but being in a frame with blocked access
      // is actually a good indicator we might be in Farcaster
      return window !== window.parent;
    }
  }
}
