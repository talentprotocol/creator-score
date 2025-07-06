import { TalentApiClient } from "@/lib/api";
import { env } from "@/lib/config";
import type { TalentProfile } from "@/lib/types";
import type { UserResolverResult } from "./types";

export class UserService {
  private talentClient: TalentApiClient;

  constructor() {
    this.talentClient = new TalentApiClient(env.TALENT_API_KEY);
  }

  async resolveUser(identifier: string): Promise<UserResolverResult> {
    try {
      // Development mode bypass
      if (env.NEXT_PUBLIC_DEV_MODE) {
        return this.createDevModeUser();
      }

      const profile = await this.talentClient.getProfile(identifier);
      return { profile, error: null };
    } catch (error) {
      console.error("Failed to resolve user:", error);
      return {
        profile: null,
        error:
          error instanceof Error ? error.message : "Failed to resolve user",
      };
    }
  }

  private createDevModeUser(): UserResolverResult {
    // Return a mock user for development
    const mockProfile: TalentProfile = {
      id: "dev-user-123",
      wallet_address: "0x1234567890123456789012345678901234567890",
      farcaster_id: 12345,
      handle: "dev-user",
      name: "Development User",
      bio: "This is a development mode user for testing",
      avatar_url: "https://via.placeholder.com/150",
      score: 850,
      credentials: [
        {
          id: "cred-1",
          type: "GitHub Commits",
          value: 150,
          readable_value: "150",
          uom: "commits",
          description: "Total GitHub commits",
        },
      ],
    };

    return { profile: mockProfile, error: null };
  }

  async getProfileByWallet(walletAddress: string): Promise<UserResolverResult> {
    return this.resolveUser(walletAddress);
  }

  async getProfileByFID(fid: number): Promise<UserResolverResult> {
    return this.resolveUser(fid.toString());
  }

  async getProfileByUsername(username: string): Promise<UserResolverResult> {
    return this.resolveUser(username);
  }
}
