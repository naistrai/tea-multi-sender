"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";
import {
  useSendTransaction,
  usePublicClient,
} from "wagmi";

export default function SendTransaction() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const publicClient = usePublicClient();

  const { sendTransactionAsync } = useSendTransaction();

  const waitForReceiptWithPolling = async (txHash: `0x${string}`) => {
    return new Promise(async (resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 15; // Coba cek receipt maksimal 15x

      const interval = setInterval(async () => {
        try {
          console.log(`⏳ Checking transaction receipt (${attempts + 1}/${maxAttempts})...`);

          const receipt = await publicClient.getTransactionReceipt({ hash: txHash });

          if (receipt) {
            clearInterval(interval);
            resolve(receipt);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error("Timeout: Receipt tidak ditemukan."));
          }

          attempts++;
        } catch (err) {
          console.error("🚨 Error checking receipt:", err);
        }
      }, 4000); // Cek setiap 4 detik
    });
  };

  const handleSend = async () => {
    if (!address || !amount) {
      toast.error("Alamat tujuan dan jumlah harus diisi.");
      return;
    }

    let valueInEther: bigint;
    try {
      valueInEther = parseEther(amount);
    } catch (e) {
      toast.error("Format jumlah tidak valid.");
      return;
    }

    if (!publicClient) {
      toast.error("Kesalahan: publicClient tidak tersedia.");
      return;
    }

    try {
      setIsPending(true);
      const loadingToast = toast.loading("Menunggu konfirmasi di wallet...");

      const tx = await sendTransactionAsync({
        to: address as `0x${string}`,
        value: valueInEther,
      });

      toast.dismiss(loadingToast);
      toast.loading("🚀 Transaksi sedang diproses di jaringan...", { id: "pendingTx" });

      console.log("🔗 Tx Hash:", tx);

      const receipt = await waitForReceiptWithPolling(tx);

      console.log("🎉 Receipt ditemukan:", receipt);

      toast.dismiss("pendingTx");

      if (receipt.status === "success") {
        toast.success(`✅ Transaksi berhasil! Hash: ${receipt.transactionHash}`);
      } else {
        toast.error("❌ Transaksi gagal atau tidak dikonfirmasi.");
      }

    } catch (err) {
      console.error("🚨 Error:", err);
      toast.dismiss();
      toast.error("❌ Transaksi dibatalkan atau gagal.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Single Transaction</h1>
      <input
        type="text"
        placeholder="Alamat tujuan"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Jumlah ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleSend}
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Mengirim..." : "Kirim"}
      </button>
    </div>
  );
}
