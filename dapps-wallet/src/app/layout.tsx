import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers"; // Wagmi & React Query provider
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/ClientLayout"; // Import layout yang berisi "use client"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi Sender DApp",
  description: "DApp untuk mengirim token ke banyak alamat sekaligus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
