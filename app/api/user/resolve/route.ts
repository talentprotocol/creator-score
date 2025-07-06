import { NextRequest, NextResponse } from "next/server";
import { UserResolver } from "@/lib/auth/resolvers/UserResolver";
import { createApiResponse, handleApiError } from "@/lib/api/utils";
import type { AuthProvider } from "@/lib/types";

// GET handler for testing via browser URL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");
    const fid = searchParams.get("fid");
    const uuid = searchParams.get("uuid");
    const fname = searchParams.get("fname");

    // Determine identifier and type
    let identifier: string;
    let authProvider: AuthProvider = "privy"; // Default for browser testing

    if (wallet) {
      identifier = wallet;
    } else if (fid) {
      identifier = fid;
      authProvider = "farcaster";
    } else if (uuid) {
      identifier = uuid;
    } else if (fname) {
      identifier = fname;
    } else {
      return NextResponse.json(
        createApiResponse(
          null,
          "Provide one of: wallet, fid, uuid, or fname as query parameter"
        ),
        { status: 400 }
      );
    }

    const result = await UserResolver.resolve({
      identifier,
      authProvider,
    });

    if (result.error) {
      return NextResponse.json(createApiResponse(null, result.error), {
        status: 400,
      });
    }

    return NextResponse.json(createApiResponse(result.user));
  } catch (error) {
    console.error("User resolution API error (GET):", error);
    return NextResponse.json(createApiResponse(null, handleApiError(error)), {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, authProvider, additionalData } = body;

    if (!identifier || !authProvider) {
      return NextResponse.json(
        createApiResponse(null, "Identifier and authProvider are required"),
        { status: 400 }
      );
    }

    const result = await UserResolver.resolve({
      identifier,
      authProvider: authProvider as AuthProvider,
      additionalData,
    });

    if (result.error) {
      return NextResponse.json(createApiResponse(null, result.error), {
        status: 400,
      });
    }

    return NextResponse.json(createApiResponse(result.user));
  } catch (error) {
    console.error("User resolution API error:", error);
    return NextResponse.json(createApiResponse(null, handleApiError(error)), {
      status: 500,
    });
  }
}
