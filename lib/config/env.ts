export const env = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  NEXT_PUBLIC_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE === "true",
  NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID || "",
  TALENT_API_KEY: process.env.TALENT_API_KEY || "",
  NEXT_PUBLIC_FARCASTER_DEVELOPER_MNEMONIC:
    process.env.NEXT_PUBLIC_FARCASTER_DEVELOPER_MNEMONIC || "",
} as const;
