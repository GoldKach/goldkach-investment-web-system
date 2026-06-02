"use client";

import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#080c1f] text-white px-6 text-center">
      <Image
        src="/icons/icon-128x128.png"
        alt="GoldKach"
        width={80}
        height={80}
        className="rounded-2xl opacity-80"
      />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="text-sm text-slate-400 max-w-xs">
          No internet connection. Please check your network and try again.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
