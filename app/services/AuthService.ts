import type { AuthContextDetectionResult } from "./types";

export class AuthService {
  static detectAuthContext(headers: Headers): AuthContextDetectionResult {
    const userAgent = headers.get("user-agent") || "";

    // Check if request is coming from Farcaster frame/miniapp
    const isFrameContext = this.isFrameRequest(headers, userAgent);

    return {
      context: isFrameContext ? "farcaster_miniapp" : "browser",
      userAgent,
      isFrameContext,
    };
  }

  private static isFrameRequest(headers: Headers, userAgent: string): boolean {
    // Check for Farcaster-specific headers or user agent patterns
    const farcasterHeaders = ["x-farcaster-frame", "x-frame-context"];

    // Check for frame-specific headers
    for (const header of farcasterHeaders) {
      if (headers.get(header)) {
        return true;
      }
    }

    // Check user agent for frame indicators
    const frameUserAgents = ["farcaster", "frame", "warpcast"];

    const lowerUserAgent = userAgent.toLowerCase();
    return frameUserAgents.some((indicator) =>
      lowerUserAgent.includes(indicator)
    );
  }

  static extractFarcasterData(headers: Headers): {
    fid?: number;
    username?: string;
    walletAddress?: string;
  } {
    // Extract Farcaster-specific data from headers when in frame context
    const fidHeader = headers.get("x-farcaster-fid");
    const usernameHeader = headers.get("x-farcaster-username");
    const walletHeader = headers.get("x-farcaster-wallet");

    return {
      fid: fidHeader ? parseInt(fidHeader, 10) : undefined,
      username: usernameHeader || undefined,
      walletAddress: walletHeader || undefined,
    };
  }
}
