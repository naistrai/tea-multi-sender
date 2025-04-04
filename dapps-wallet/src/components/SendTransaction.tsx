"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

export default function SendTransaction() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [isPending, setIsPending] = useState(false);

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: hash ?? undefined,
    query: {
      enabled: !!hash,
    },
  });

  const { sendTransactionAsync } = useSendTransaction();

  const handleSend = async () => {
    // Validasi input
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

    try {
      setIsPending(true);
      toast.loading("Menunggu konfirmasi di wallet...");

      const tx = await sendTransactionAsync({
        to: address as `0x${string}`,
        value: valueInEther,
      });

      setHash(tx);
      toast.dismiss();
      toast.loading("Transaksi sedang diproses di jaringan...");
    } catch (err) {
      toast.dismiss();
      toast.error("Transaksi dibatalkan atau gagal.");
      setIsPending(false);
    }
  };

  // Update status jika receipt selesai
  if (receipt && isPending) {
    toast.dismiss();
    if (receipt.status === "success") {
      toast.success("Transaksi berhasil dikonfirmasi!");
    } else {
      toast.error("Transaksi gagal.");
    }
    setIsPending(false);
    setHash(null);
  }

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
