"use client";

import { AuthProvider } from "@/lib/auth/providers/AuthProvider";
import { DevAuthProvider } from "@/lib/auth/providers/DevAuthProvider";
import { QueryProvider } from "@/lib/auth/providers/QueryProvider";
import { FarcasterSDKInitializer } from "@/components/FarcasterSDKInitializer";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@/lib/config";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PostHogProvider
      apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY!}
      options={{
        api_host: "/ingest",
        ui_host: "https://eu.posthog.com",
        capture_pageview: true,
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
      }}
    >
      <QueryProvider>
        <AuthProvider>
          <FarcasterSDKInitializer />
          {env.NEXT_PUBLIC_DEV_MODE ? (
            <DevAuthProvider>
              {children}
              <Toaster />
            </DevAuthProvider>
          ) : (
            <>
              {children}
              <Toaster />
            </>
          )}
        </AuthProvider>
      </QueryProvider>
    </PostHogProvider>
  );
}
