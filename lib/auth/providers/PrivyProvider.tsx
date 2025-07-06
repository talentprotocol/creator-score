"use client";

import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { createConfig } from "@privy-io/wagmi";
import { env } from "@/lib/config";
import type { ComponentProps } from "@/lib/types";

// Configure Wagmi
const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

interface PrivyProviderProps extends ComponentProps {
  children: React.ReactNode;
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
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </BasePrivyProvider>
  );
}
