"use client";

import MetamaskLogin from "@/components/MetamaskLogin";
import SendTransaction from "@/components/SendTransaction";
import { useAccount } from "wagmi";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Notifikasi */}
      
      <h1 className="text-2xl font-bold mb-4">Crypto Transaction dApp</h1>

      <MetamaskLogin />

      {isConnected ? (
        <SendTransaction />
      ) : (
        <p className="text-gray-500 mt-4">🔗 Connect wallet to send transactions</p>
      )}
    </main>
  );
}
