"use client"; // Pastikan ini ada di baris pertama

import { WagmiProvider, createConfig, createStorage } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet } from "wagmi/chains";
import { ReactNode, useEffect, useState } from "react";

export default function WagmiClient({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<any>(null);
  const [queryClient] = useState(() => new QueryClient()); // Tambahkan QueryClient

  useEffect(() => {
    const storage = createStorage({ storage: window.localStorage });

    const newConfig = createConfig({
      chains: [mainnet],
      transports: {
        [mainnet.id]: http(),
      },
      storage,
    });

    setConfig(newConfig);
  }, []);

  if (!config) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}
