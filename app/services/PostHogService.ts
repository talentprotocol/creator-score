import posthog from "posthog-js";
import type { User, AuthContext } from "@/lib/types";

// Type for PostHog user properties
type PostHogUserProperties = {
  authProvider: string;
  context: AuthContext;
  walletAddress?: string;
  fid?: number;
  fname?: string;
};

// Type for PostHog event properties
type PostHogEventProperties = Record<
  string,
  string | number | boolean | undefined
>;

export class PostHogService {
  /**
   * Identify a user with PostHog and track authentication event
   */
  static identifyUser(user: User, context: AuthContext): void {
    try {
      // Create PostHog user properties from our User interface
      const userProperties: PostHogUserProperties = {
        authProvider: user.authProvider,
        context: context,
      };

      // Add wallet address if available
      if (user.walletAddress) {
        userProperties.walletAddress = user.walletAddress;
      }

      // Add Farcaster data if available
      if (user.fid) {
        userProperties.fid = user.fid;
      }
      if (user.fname) {
        userProperties.fname = user.fname;
      }

      // Identify user with PostHog
      posthog.identify(user.id, userProperties);

      // Track authentication event
      posthog.capture("user_authenticated", {
        authProvider: user.authProvider,
        context: context,
        hasWallet: !!user.walletAddress,
        hasFarcaster: !!user.fid,
      });
    } catch (error) {
      console.error("Failed to identify user with PostHog:", error);
    }
  }

  /**
   * Reset PostHog identity and track logout event
   */
  static resetIdentity(context: AuthContext): void {
    try {
      // Track logout event before resetting
      posthog.capture("user_logged_out", {
        context: context,
      });

      // Reset PostHog identity
      posthog.reset();
    } catch (error) {
      console.error("Failed to reset PostHog identity:", error);
    }
  }

  /**
   * Track logout initiation before the actual logout happens
   */
  static trackLogoutInitiated(
    context: AuthContext,
    authProvider: string
  ): void {
    try {
      posthog.capture("user_logout_initiated", {
        context: context,
        authProvider: authProvider,
      });
    } catch (error) {
      console.error("Failed to track logout initiation:", error);
    }
  }

  /**
   * Track custom authentication events
   */
  static trackAuthEvent(
    eventName: string,
    properties: PostHogEventProperties = {}
  ): void {
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.error(`Failed to track auth event "${eventName}":`, error);
    }
  }
}
