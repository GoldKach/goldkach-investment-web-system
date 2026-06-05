"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Share, Plus, CheckCircle } from "lucide-react";
import { usePWAInstall } from "./pwa-install-context";

export function InstallNavButton({ alwaysShow = false }: { alwaysShow?: boolean }) {
  const { canInstall, isIOS, isInstalled, install } = usePWAInstall();
  const [showPanel, setShowPanel] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (isInstalled) setInstalled(true); }, [isInstalled]);

  if (installed) return null;
  // Auth pages: always show. Dashboard: only show when browser confirms installable.
  if (alwaysShow) {
    // skip mounted guard — button content is same on server & client, no hydration mismatch
  } else {
    if (!mounted || !canInstall) return null;
  }

  async function handleClick() {
    if (canInstall && !isIOS) {
      const ok = await install();
      if (ok) { setInstalled(true); return; }
    }
    // Show panel: iOS instructions or browser hint
    setShowPanel((v) => !v);
  }

  return (
    <div className="relative flex-shrink-0">

      {/* ── Button ── */}
      <button
        onClick={handleClick}
        className="
          relative flex items-center gap-2
          rounded-full px-4 py-2
          bg-blue-600 hover:bg-blue-500
          text-white font-semibold text-sm
          shadow-lg shadow-blue-600/30
          transition-all duration-200
          hover:shadow-blue-500/50 hover:scale-[1.03]
          active:scale-95 cursor-pointer
        "
      >
        {/* Pulsing green dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>

        <Download className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline whitespace-nowrap">Install App</span>
      </button>

      {/* ── Panel (iOS steps OR browser hint) ── */}
      {showPanel && (
        <>
          {/* click-away */}
          <div className="fixed inset-0 z-40" onClick={() => setShowPanel(false)} />

          <div className="absolute right-0 top-12 z-50 w-76 rounded-2xl border border-border bg-card shadow-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/icons/icon-72x72.png" alt="GoldKach" width={40} height={40} className="rounded-xl border border-border" />
                <div>
                  <p className="text-sm font-bold leading-tight">Install GoldKach</p>
                  <p className="text-xs text-muted-foreground">Investment Platform</p>
                </div>
              </div>
              <button onClick={() => setShowPanel(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-px bg-border" />

            {isIOS ? (
              /* iOS Safari steps */
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Steps to install on iPhone / iPad</p>
                {[
                  { n: 1, icon: <Share className="h-3.5 w-3.5 text-blue-400" />, text: <>Tap the <strong>Share</strong> button at the bottom of Safari</> },
                  { n: 2, icon: <Plus className="h-3.5 w-3.5 text-blue-400" />,  text: <>Scroll down and tap <strong>Add to Home Screen</strong></> },
                  { n: 3, icon: <CheckCircle className="h-3.5 w-3.5 text-green-400" />, text: <>Tap <strong>Add</strong> — the app will appear on your home screen</> },
                ].map(({ n, icon, text }) => (
                  <div key={n} className="flex items-start gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-400 mt-0.5">{n}</span>
                    <div className="flex items-start gap-1.5"><span className="mt-0.5 shrink-0">{icon}</span><p className="text-muted-foreground leading-snug">{text}</p></div>
                  </div>
                ))}
              </div>
            ) : (
              /* Chrome / Edge / Android hint */
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">How to install</p>
                {[
                  { n: 1, text: <>Click the <strong>install icon</strong> <span className="font-mono bg-muted px-1 rounded text-xs">⊕</span> in your browser's address bar</> },
                  { n: 2, text: <>Or open the browser <strong>menu (⋮)</strong> and select <strong>"Install GoldKach"</strong></> },
                  { n: 3, text: <>Click <strong>Install</strong> — the app opens like a native app</> },
                ].map(({ n, text }) => (
                  <div key={n} className="flex items-start gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-400 mt-0.5">{n}</span>
                    <p className="text-muted-foreground leading-snug">{text}</p>
                  </div>
                ))}

                {canInstall && (
                  <button
                    onClick={async () => { const ok = await install(); if (ok) { setInstalled(true); setShowPanel(false); } }}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Install Now
                  </button>
                )}
              </div>
            )}

            <div className="rounded-xl bg-blue-500/8 border border-blue-500/20 px-3 py-2.5">
              <p className="text-xs text-blue-400 leading-relaxed">
                Works offline · Loads faster · Feels like a native app
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
