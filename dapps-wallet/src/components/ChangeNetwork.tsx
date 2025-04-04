"use client";

import { useSwitchChain, useChainId } from "wagmi";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const teaSepolia = {
  id: 10218,
  name: "Tea Sepolia",
  rpcUrls: ["https://tea-sepolia.g.alchemy.com/public"],
  blockExplorerUrls: ["https://sepolia.tea.xyz"],
  nativeCurrency: {
    name: "Tea",
    symbol: "TEA",
    decimals: 18,
  },
};

export default function ChangeNetwork() {
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isSwitching, setIsSwitching] = useState(false);

  const addAndSwitchNetwork = async () => {
    if (!window.ethereum) {
      toast.error("❌ MetaMask tidak terdeteksi.");
      return;
    }
  
    try {
      setIsSwitching(true);
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
  
      if (currentChainId === `0x${teaSepolia.id.toString(16)}`) {
        toast.success("✅ Anda sudah berada di jaringan Tea Sepolia");
        return;
      }
  
      // Coba langsung switch ke Tea Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${teaSepolia.id.toString(16)}` }],
      });
  
      toast.success("🔄 Berhasil beralih ke Tea Sepolia!");
  
    } catch (error: any) {
      console.error("❌ Gagal mengganti jaringan:", error);
  
      if (error.code === 4902) {
        // Jika jaringan tidak ditemukan, tambahkan dulu ke MetaMask
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${teaSepolia.id.toString(16)}`,
                chainName: teaSepolia.name,
                rpcUrls: teaSepolia.rpcUrls,
                blockExplorerUrls: teaSepolia.blockExplorerUrls,
                nativeCurrency: teaSepolia.nativeCurrency,
              },
            ],
          });
          toast.success("✅ Jaringan Tea Sepolia berhasil ditambahkan!");
        } catch (addError) {
          console.error("❌ Gagal menambahkan jaringan:", addError);
          toast.error("❌ Tidak bisa menambahkan jaringan.");
        }
      } else {
        toast.error("❌ Gagal mengganti jaringan.");
      }
    } finally {
      setIsSwitching(false);
    }
  };
  

  return (
    <button
      onClick={addAndSwitchNetwork}
      disabled={isSwitching}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
    >
      {isSwitching ? "🔄 Mengubah Jaringan..." : "🔄 Ganti ke Tea Sepolia"}
    </button>
  );
}
