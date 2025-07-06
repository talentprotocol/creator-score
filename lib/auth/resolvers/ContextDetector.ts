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

    try {
      // Dynamically import SDK to avoid server-side import issues
      const { sdk } = await import("@farcaster/miniapp-sdk");

      // Use the official Farcaster SDK to detect mini app context
      await sdk.actions.ready();
      const context = await sdk.context;

      // If we have a valid context with user data, we're in a mini app
      if (context && context.user) {
        return "farcaster_miniapp";
      }
    } catch (error) {
      // SDK failed to initialize or no context available
      console.log("Not in Farcaster miniapp context:", error);
    }

    // Fallback to heuristic detection for compatibility
    return this.fallbackDetection();
  }

  private static fallbackDetection(): AuthContext {
    // Check if running in iframe/frame context
    const isInFrame =
      window.parent !== window || window.location !== window.parent.location;

    // Check referrer for Farcaster domains
    const referrer = document.referrer.toLowerCase();
    const isFarcasterReferrer =
      referrer.includes("farcaster") || referrer.includes("warpcast");

    // Check for Farcaster-specific window properties
    const hasFarcasterContext = this.checkFarcasterWindowProperties();

    return (isInFrame && isFarcasterReferrer) || hasFarcasterContext
      ? "farcaster_miniapp"
      : "browser";
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
      };

      return !!(win.farcaster || win.parent?.farcaster || win.frameContext);
    } catch {
      return false;
    }
  }
}
