"use client"; // Pastikan ini berjalan di Client

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useEffect, useState } from "react";

export default function MetamaskLogin() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect(); // ✅ Ambil list connectors
  const { disconnect } = useDisconnect();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Hindari error hydration

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg">
      {isConnected ? (
        <div>
          <p className="mb-4 text-gray-700">Connected as: {address}</p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[0] })} // ✅ Gunakan connectors[0]
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
