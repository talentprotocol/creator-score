import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/app/services/AuthService";
import { createApiResponse, handleApiError } from "@/lib/api/utils";

export async function GET(request: NextRequest) {
  try {
    const headers = request.headers;
    const contextResult = AuthService.detectAuthContext(headers);
    const farcasterData = AuthService.extractFarcasterData(headers);

    const response = {
      context: contextResult.context,
      userAgent: contextResult.userAgent,
      isFrameContext: contextResult.isFrameContext,
      farcasterData,
    };

    return NextResponse.json(createApiResponse(response));
  } catch (error) {
    console.error("Auth context API error:", error);
    return NextResponse.json(createApiResponse(null, handleApiError(error)), {
      status: 500,
    });
  }
}
