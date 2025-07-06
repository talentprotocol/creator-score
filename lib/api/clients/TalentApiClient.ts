import { BaseApiClient } from "./BaseApiClient";
import type { TalentProfile } from "@/lib/types";

export class TalentApiClient extends BaseApiClient {
  constructor(apiKey?: string) {
    super("https://api.talentprotocol.com", {
      ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    });
  }

  async getProfile(identifier: string): Promise<TalentProfile> {
    try {
      // Support multiple identifier types
      const params = this.buildProfileParams(identifier);
      const endpoint = `/profile?${params}`;

      return await this.get<TalentProfile>(endpoint);
    } catch (error) {
      console.error("Failed to fetch Talent profile:", error);
      throw error;
    }
  }

  private buildProfileParams(identifier: string): string {
    // Detect identifier type and build appropriate query params
    if (identifier.startsWith("0x")) {
      return `wallet_address=${identifier}`;
    } else if (/^\d+$/.test(identifier)) {
      return `farcaster_id=${identifier}`;
    } else if (identifier.includes("-")) {
      return `id=${identifier}`; // UUID format
    } else {
      return `fname=${identifier}`; // Farcaster fname or GitHub username
    }
  }
}
