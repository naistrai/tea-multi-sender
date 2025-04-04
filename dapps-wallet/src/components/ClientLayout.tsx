"use client";

import ChangeNetwork from "@/components/ChangeNetwork";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="p-4 flex justify-between items-center bg-gray-800 text-white">
        <h1 className="text-xl font-bold">Multi Sender DApp</h1>
        <ChangeNetwork />
      </header>

      <main className="p-4">{children}</main>

      <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Multi Sender DApp. All rights reserved.
      </footer>
    </div>
  );
}
