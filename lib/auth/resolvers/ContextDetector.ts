import type { AuthContext } from "@/lib/types";

export class ContextDetector {
  static detectFromHeaders(headers: Headers): AuthContext {
    const userAgent = headers.get("user-agent") || "";

    // Check for Farcaster-specific headers
    if (this.isFarcasterFrame(headers)) {
      return "farcaster_miniapp";
    }

    // Check user agent patterns
    if (this.isFarcasterUserAgent(userAgent)) {
      return "farcaster_miniapp";
    }

    return "browser";
  }

  static async detectFromClient(): Promise<AuthContext> {
    if (typeof window === "undefined") {
      return "browser";
    }

    // First, try heuristic detection for immediate feedback
    const heuristicResult = this.fallbackDetection();

    try {
      // Dynamically import SDK to avoid server-side import issues
      const { sdk } = await import("@farcaster/miniapp-sdk");

      // Use the official Farcaster SDK to detect mini app context
      await sdk.actions.ready();
      const context = await sdk.context;

      console.log("Farcaster SDK context:", context);
      console.log("Heuristic detection result:", heuristicResult);

      // If we have a valid context, we're definitely in a mini app
      if (context && (context.user || context.location)) {
        console.log("✅ Farcaster SDK detected mini app context");
        return "farcaster_miniapp";
      }

      // If SDK says no context but heuristics say yes, trust heuristics
      // (This handles preview environments where SDK might not have full context)
      if (heuristicResult === "farcaster_miniapp") {
        console.log(
          "✅ Heuristic detection overriding SDK (preview environment)"
        );
        return "farcaster_miniapp";
      }
    } catch (error) {
      // SDK failed to initialize
      console.log("⚠️ Farcaster SDK failed to initialize:", error);

      // If SDK fails but heuristics detect Farcaster, trust heuristics
      if (heuristicResult === "farcaster_miniapp") {
        console.log("✅ Using heuristic detection due to SDK failure");
        return "farcaster_miniapp";
      }
    }

    console.log("🌐 Defaulting to browser context");
    return "browser";
  }

  private static fallbackDetection(): AuthContext {
    // Check if running in iframe/frame context
    const isInFrame =
      window.parent !== window || window.location !== window.parent.location;

    // Enhanced referrer checking for Farcaster environments
    const referrer = document.referrer.toLowerCase();
    const isFarcasterReferrer =
      referrer.includes("farcaster") ||
      referrer.includes("warpcast") ||
      referrer.includes("farcaster.xyz");

    // Check URL parameters that indicate Farcaster context
    const urlParams = new URLSearchParams(window.location.search);
    const hasFarcasterParams =
      urlParams.has("farcaster") || urlParams.has("fc");

    // Check if parent window has Farcaster in URL (for preview tool)
    let parentHasFarcaster = false;
    try {
      parentHasFarcaster =
        window.parent?.location?.href?.includes("farcaster") || false;
    } catch {
      // Cross-origin restriction, but that might indicate we're in a frame
    }

    // Check for Farcaster-specific window properties
    const hasFarcasterContext = this.checkFarcasterWindowProperties();

    // Check frame indicators
    const hasFrameIndicators = this.checkFrameIndicators();

    // Debug logging
    console.log("🔍 Fallback Detection Debug:", {
      isInFrame,
      referrer,
      isFarcasterReferrer,
      hasFarcasterParams,
      parentHasFarcaster,
      hasFarcasterContext,
      hasFrameIndicators,
      currentUrl: window.location.href,
    });

    // Enhanced detection logic
    const isFarcasterEnvironment =
      (isInFrame && isFarcasterReferrer) ||
      hasFarcasterContext ||
      hasFarcasterParams ||
      parentHasFarcaster ||
      hasFrameIndicators;

    const result = isFarcasterEnvironment ? "farcaster_miniapp" : "browser";
    console.log(`🎯 Fallback detection result: ${result}`);

    return result;
  }

  private static isFarcasterFrame(headers: Headers): boolean {
    const farcasterHeaders = [
      "x-farcaster-frame",
      "x-frame-context",
      "x-farcaster-miniapp",
    ];

    return farcasterHeaders.some((header) => headers.get(header));
  }

  private static isFarcasterUserAgent(userAgent: string): boolean {
    const farcasterIndicators = ["farcaster", "warpcast", "frame"];

    const lowerUserAgent = userAgent.toLowerCase();
    return farcasterIndicators.some((indicator) =>
      lowerUserAgent.includes(indicator)
    );
  }

  private static checkFarcasterWindowProperties(): boolean {
    try {
      // Check for Farcaster-specific global objects or properties
      const win = window as Window & {
        farcaster?: unknown;
        parent?: Window & { farcaster?: unknown };
        frameContext?: unknown;
        webkit?: { messageHandlers?: { farcaster?: unknown } };
      };

      return !!(
        win.farcaster ||
        win.parent?.farcaster ||
        win.frameContext ||
        win.webkit?.messageHandlers?.farcaster
      );
    } catch {
      return false;
    }
  }

  private static checkFrameIndicators(): boolean {
    try {
      // Check for common frame/mini-app indicators
      const isInFrame = window.top !== window.self;
      const hasParentOrigin = document.referrer !== "";

      // Check for frame-specific features
      const hasFrameFeatures = !!(
        window.frameElement ||
        (isInFrame && hasParentOrigin)
      );

      return hasFrameFeatures;
    } catch {
      return false;
    }
  }
}
