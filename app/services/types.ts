import type { TalentProfile } from "@/lib/types";

export interface UserResolverResult {
  profile: TalentProfile | null;
  error: string | null;
}

export interface AuthContextDetectionResult {
  context: "browser" | "farcaster_miniapp";
  userAgent: string;
  isFrameContext: boolean;
}
