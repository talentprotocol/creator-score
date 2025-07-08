import { RewardsApiClient } from "@/lib/api/clients/RewardsApiClient";
import { ALLOWED_SPONSORS } from "@/lib/config/rewards";
import type { GrantsResult, SponsorsResult } from "@/lib/types";
import { env } from "@/lib/config";

export class RewardsService {
  private rewardsApiClient: RewardsApiClient;

  constructor() {
    this.rewardsApiClient = new RewardsApiClient(env.TALENT_API_KEY);
  }

  async getAllowedSponsors(): Promise<SponsorsResult> {
    try {
      const sponsorsResponse = await this.rewardsApiClient.getSponsors();
      const filteredSponsors = sponsorsResponse.sponsors.filter((sponsor) =>
        ALLOWED_SPONSORS.includes(sponsor.slug)
      );
      return {
        sponsors: filteredSponsors,
        error: null,
      };
    } catch (error) {
      console.error("Failed to get sponsors:", error);
      return {
        sponsors: [],
        error:
          error instanceof Error ? error.message : "Failed to get sponsors",
      };
    }
  }

  async getGrants(sponsorSlug: string): Promise<GrantsResult> {
    try {
      const grantsResponse = await this.rewardsApiClient.getGrants(sponsorSlug);
      return {
        grants: grantsResponse.grants,
        error: null,
      };
    } catch (error) {
      console.error("Failed to get grants:", error);
      return {
        grants: [],
        error: error instanceof Error ? error.message : "Failed to get grants",
      };
    }
  }
}
