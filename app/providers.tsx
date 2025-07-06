"use client";

import { AuthProvider } from "@/lib/auth/providers/AuthProvider";
import { DevAuthProvider } from "@/lib/auth/providers/DevAuthProvider";
import { QueryProvider } from "@/lib/auth/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/config";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
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
  );
}
