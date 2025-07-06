export const CACHE_DURATIONS = {
  PROFILE_DATA: 5 * 60 * 1000, // 5 minutes
  SCORE_DATA: 30 * 60 * 1000, // 30 minutes
  LEADERBOARD: 5 * 60 * 1000, // 5 minutes
} as const;

export const API_ENDPOINTS = {
  TALENT_API: "/api/talent",
  TALENT_PROFILE: "https://api.talentprotocol.com/profile",
} as const;

export const AUTH_PROVIDERS = {
  PRIVY: "privy",
  FARCASTER: "farcaster",
} as const;
