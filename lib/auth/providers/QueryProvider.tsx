"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { env } from "@/lib/config";
import type { ComponentProps } from "@/lib/types";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

interface QueryProviderProps extends ComponentProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.NEXT_PUBLIC_DEV_MODE && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
