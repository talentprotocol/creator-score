import type { ApiResponse } from "@/lib/types";

export function createApiResponse<T>(
  data: T | null = null,
  error: string | null = null,
  loading: boolean = false
): ApiResponse<T> {
  return { data, error, loading };
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}

export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidFarcasterID(id: string): boolean {
  return /^\d+$/.test(id);
}

export function isValidTalentUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    uuid
  );
}
