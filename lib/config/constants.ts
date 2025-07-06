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

// Farcaster Mini App Configuration
export const FARCASTER_MINIAPP = {
  version: "vNext",
  image: {
    url: "https://new.creatorscore.app/images/miniapp/hero.png",
    alt: "Creator Score - Fast, minimal, scalable Next.js app with dual authentication",
  },
  buttons: [
    {
      text: "Open Creator Score",
      action: "link",
      target: "https://new.creatorscore.app",
    },
    {
      text: "View Profile",
      action: "link",
      target: "https://new.creatorscore.app/profile",
    },
  ],
  xmtp: {
    version: "2024-02-01",
  },
} as const;

export const OPEN_GRAPH = {
  title: "Creator Score",
  description:
    "Fast, minimal, scalable Next.js app with dual authentication and Talent Protocol integration",
  image: FARCASTER_MINIAPP.image,
  type: "website",
} as const;
