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
    // Check for Farcaster-specific headers
    const farcasterHeaders = [
      "x-farcaster-frame",
      "x-frame-context",
      "x-farcaster-miniapp",
      "x-farcaster-user",
      "x-farcaster-signature",
    ];

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
    signature?: string;
    timestamp?: number;
  } {
    // Extract Farcaster-specific data from headers when in frame context
    const fidHeader = headers.get("x-farcaster-fid");
    const usernameHeader = headers.get("x-farcaster-username");
    const walletHeader = headers.get("x-farcaster-wallet");
    const signatureHeader = headers.get("x-farcaster-signature");
    const timestampHeader = headers.get("x-farcaster-timestamp");

    return {
      fid: fidHeader ? parseInt(fidHeader, 10) : undefined,
      username: usernameHeader || undefined,
      walletAddress: walletHeader || undefined,
      signature: signatureHeader || undefined,
      timestamp: timestampHeader ? parseInt(timestampHeader, 10) : undefined,
    };
  }

  /**
   * Validate a frame signature packet
   * This would typically validate against Farcaster Hub
   */
  static async validateFrameSignature(
    messageBytes: string,
    signature: string
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      // TODO: Implement actual validation against Farcaster Hub
      // This is a placeholder for the actual validation logic

      // For now, return true if both messageBytes and signature exist
      const isValid = !!(messageBytes && signature);

      return {
        isValid,
        error: isValid ? undefined : "Invalid signature or missing data",
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Validation failed",
      };
    }
  }
}
