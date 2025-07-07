import { BaseApiClient } from "./BaseApiClient";
import type { SponsorsResult, GrantsResult } from "@/lib/types";

export class RewardsApiClient extends BaseApiClient {
  constructor(apiKey?: string) {
    super("https://api.talentprotocol.com/builder_grants", {
      ...(apiKey && { "X-API-KEY": `${apiKey}` }),
    });
  }

  async getSponsors(): Promise<SponsorsResult> {
    return await this.get<SponsorsResult>("/sponsors");
  }

  async getGrants(sponsorSlug: string): Promise<GrantsResult> {
    return await this.get<GrantsResult>(`/grants?sponsor_slug=${sponsorSlug}`);
  }
}
