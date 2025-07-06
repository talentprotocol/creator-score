import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/app/services/UserService";
import { createApiResponse, handleApiError } from "@/lib/api/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier");

    if (!identifier) {
      return NextResponse.json(
        createApiResponse(null, "Identifier parameter is required"),
        { status: 400 }
      );
    }

    const userService = new UserService();
    const result = await userService.resolveUser(identifier);

    if (result.error) {
      return NextResponse.json(createApiResponse(null, result.error), {
        status: 404,
      });
    }

    return NextResponse.json(createApiResponse(result.profile));
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(createApiResponse(null, handleApiError(error)), {
      status: 500,
    });
  }
}
