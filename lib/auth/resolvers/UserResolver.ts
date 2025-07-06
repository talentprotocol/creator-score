import type { User, AuthProvider } from "@/lib/types";
import {
  isValidWalletAddress,
  isValidFarcasterID,
  isValidTalentUUID,
} from "@/lib/api/utils";

export interface ResolverInput {
  identifier: string;
  authProvider: AuthProvider;
  additionalData?: {
    fid?: number;
    fname?: string;
    walletAddress?: string;
  };
}

export interface ResolverResult {
  user: User | null;
  error: string | null;
}

export class UserResolver {
  static async resolve(input: ResolverInput): Promise<ResolverResult> {
    try {
      const { identifier, authProvider, additionalData } = input;

      // Detect identifier type
      const identifierType = this.detectIdentifierType(identifier);

      // Create user object based on available data
      const user: User = {
        id: this.generateUserId(identifier, identifierType),
        authProvider,
        ...this.extractUserData(identifier, identifierType, additionalData),
      };

      return { user, error: null };
    } catch (error) {
      return {
        user: null,
        error:
          error instanceof Error ? error.message : "Failed to resolve user",
      };
    }
  }

  private static detectIdentifierType(
    identifier: string
  ): "wallet" | "fid" | "uuid" | "fname" {
    if (isValidWalletAddress(identifier)) {
      return "wallet";
    }

    if (isValidFarcasterID(identifier)) {
      return "fid";
    }

    if (isValidTalentUUID(identifier)) {
      return "uuid";
    }

    return "fname";
  }

  private static generateUserId(identifier: string, type: string): string {
    // Use the identifier as-is for UUIDs, otherwise generate a consistent ID
    if (type === "uuid") {
      return identifier;
    }

    // For other types, create a predictable ID
    return `${type}_${identifier}`;
  }

  private static extractUserData(
    identifier: string,
    type: string,
    additionalData?: ResolverInput["additionalData"]
  ): Partial<User> {
    const userData: Partial<User> = {};

    // Set primary identifier based on type
    switch (type) {
      case "wallet":
        userData.walletAddress = identifier;
        break;
      case "fid":
        userData.fid = parseInt(identifier, 10);
        break;
      case "fname":
        userData.fname = identifier;
        break;
    }

    // Add additional data if available
    if (additionalData) {
      if (additionalData.fid && !userData.fid) {
        userData.fid = additionalData.fid;
      }
      if (additionalData.fname && !userData.fname) {
        userData.fname = additionalData.fname;
      }
      if (additionalData.walletAddress && !userData.walletAddress) {
        userData.walletAddress = additionalData.walletAddress;
      }
    }

    return userData;
  }

  static createDevModeResolver(): (
    input: ResolverInput
  ) => Promise<ResolverResult> {
    return async (input: ResolverInput) => {
      // Always return the same dev user regardless of input
      const devUser: User = {
        id: "dev-user-123",
        walletAddress: "0x1234567890123456789012345678901234567890",
        fid: 12345,
        fname: "dev-user",
        authProvider: input.authProvider,
      };

      return { user: devUser, error: null };
    };
  }
}
