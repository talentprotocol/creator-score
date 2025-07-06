export const features = {
  ENABLE_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE === "true",
  ENABLE_FARCASTER_AUTH:
    process.env.NEXT_PUBLIC_ENABLE_FARCASTER_AUTH !== "false",
  ENABLE_PRIVY_AUTH: process.env.NEXT_PUBLIC_ENABLE_PRIVY_AUTH !== "false",
} as const;
