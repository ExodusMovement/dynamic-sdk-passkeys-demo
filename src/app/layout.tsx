"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import "./globals.css";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi";
import { http } from "viem";
import { mainnet } from "viem/chains";
import { createWallet } from "@passkeys/core";

/*
  This registers an EIP-6963 wallet (no `window.ethereum` injection), but the Dynamic SDK doesn't detect it.
 */
// createWallet({ providers: { ethereum: true }})

/*
  This registers an EIP-6963 wallet and injects the provider into `window.ethereum`.
  The Dynamic SDK detects the Passkeys Wallet as "Injected".
 */
// createWallet({ providers: { ethereum: { dangerouslyInjectWindow: true } }})

const inter = Inter({ subsets: ["latin"] });

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

/**
 * Update your environmentId
 */
const environmentId = "-- update env id --";

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DynamicContextProvider
          settings={{
            environmentId,
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <DynamicWagmiConnector>{props.children}</DynamicWagmiConnector>
            </QueryClientProvider>
          </WagmiProvider>
        </DynamicContextProvider>
      </body>
    </html>
  );
}
