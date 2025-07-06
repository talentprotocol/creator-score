import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Headers for Farcaster mini app integration
  async headers() {
    return [
      {
        // Apply to all API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Farcaster-Frame, X-Frame-Context",
          },
        ],
      },
      {
        // Apply to main app for frame embedding
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },

  // External packages for server components
  serverExternalPackages: ["@farcaster/miniapp-sdk"],
};

export default nextConfig;
