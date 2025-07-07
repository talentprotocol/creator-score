import { NextResponse } from "next/server";
import { createApiResponse, handleApiError } from "@/lib/api/utils";
import { RewardsService } from "@/app/services/RewardsService";
import type { SponsorsResult } from "@/lib/types";

export async function GET() {
  try {
    const rewardsService = new RewardsService();
    const result: SponsorsResult = await rewardsService.getAllowedSponsors();

    if (result.error) {
      return NextResponse.json(createApiResponse(null, result.error), {
        status: 404,
      });
    }

    return NextResponse.json(createApiResponse(result));
  } catch (error) {
    console.error("Rewards (Sponsors) API error:", error);
    return NextResponse.json(createApiResponse(null, handleApiError(error)), {
      status: 500,
    });
  }
}
