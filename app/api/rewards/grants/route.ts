import { NextRequest, NextResponse } from "next/server";
import { createApiResponse, handleApiError } from "@/lib/api/utils";
import { RewardsService } from "@/app/services/RewardsService";
import type { GrantsResult } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sponsorSlug = searchParams.get("sponsorSlug");

    if (!sponsorSlug) {
      return NextResponse.json(
        createApiResponse(null, "Sponsor slug is required"),
        {
          status: 400,
        }
      );
    }

    const rewardsService = new RewardsService();
    const result: GrantsResult = await rewardsService.getGrants(sponsorSlug);

    if (result.error) {
      return NextResponse.json(createApiResponse(null, result.error), {
        status: 404,
      });
    }

    return NextResponse.json(createApiResponse(result));
  } catch (error) {
    console.error("Rewards (Grants) API error:", error);
    return NextResponse.json(createApiResponse(null, handleApiError(error)), {
      status: 500,
    });
  }
}
