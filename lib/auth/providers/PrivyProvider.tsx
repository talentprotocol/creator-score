"use client";

import React from "react";
import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { createConfig } from "@privy-io/wagmi";
import { env } from "@/lib/config";
import { usePrivyBridge } from "./usePrivyBridge";
import type { ComponentProps, AuthState } from "@/lib/types";

// Configure Wagmi
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// Create context for auth state
interface PrivyAuthContextValue extends AuthState {
  login: () => void;
  logout: () => void;
}

const PrivyAuthContext = React.createContext<PrivyAuthContextValue | undefined>(
  undefined
);

interface PrivyProviderProps extends ComponentProps {
  children: React.ReactNode;
}

// Inner component that uses the bridge hook
function PrivyAuthBridge({ children }: { children: React.ReactNode }) {
  const authState = usePrivyBridge();

  return (
    <PrivyAuthContext.Provider value={authState}>
      {children}
    </PrivyAuthContext.Provider>
  );
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  if (!env.NEXT_PUBLIC_PRIVY_APP_ID) {
    console.warn(
      "NEXT_PUBLIC_PRIVY_APP_ID is not set. Authentication may not work properly."
    );
  }

  return (
    <BasePrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ["wallet"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          showWalletLoginFirst: true,
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <PrivyAuthBridge>{children}</PrivyAuthBridge>
      </WagmiProvider>
    </BasePrivyProvider>
  );
}

// Export the context hook for use in useAuth
export function usePrivyAuth() {
  const context = React.useContext(PrivyAuthContext);
  if (context === undefined) {
    throw new Error("usePrivyAuth must be used within a PrivyProvider");
  }
  return context;
}
