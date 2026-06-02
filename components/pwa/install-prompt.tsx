"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "./pwa-install-context";

const SESSION_KEY = "pwa-modal-shown";

export function InstallPrompt() {
  const { canInstall, isIOS, isInstalled, install } = usePWAInstall();
  const [open, setOpen] = useState(false);

  // Show modal once per session when the app is installable
  useEffect(() => {
    if (isInstalled) return;
    if (!canInstall) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 1500);

    return () => clearTimeout(timer);
  }, [canInstall, isInstalled]);

  if (!open) return null;

  function close() {
    setOpen(false);
  }

  async function handleInstall() {
    if (isIOS) {
      close();
      return;
    }
    const accepted = await install();
    if (accepted) close();
  }

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* App identity */}
        <div className="flex flex-col items-center gap-3 pt-8 pb-4 px-6">
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
            <Image
              src="/icons/icon-128x128.png"
              alt="GoldKach"
              width={80}
              height={80}
              className="rounded-2xl"
            />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold">Install GoldKach</h2>
            <p className="text-xs text-muted-foreground mt-1">Investment Platform</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-6" />

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {isIOS ? (
            /* iOS instructions */
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                Add GoldKach to your home screen for a full-screen app experience.
              </p>
              <div className="rounded-xl bg-muted/60 border border-border p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">1</span>
                  <p className="text-muted-foreground">Tap the <Share className="inline h-3.5 w-3.5 text-blue-400 mb-0.5" /> <strong>Share</strong> button in Safari</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">2</span>
                  <p className="text-muted-foreground">Select <Plus className="inline h-3.5 w-3.5 mb-0.5" /> <strong>Add to Home Screen</strong></p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">3</span>
                  <p className="text-muted-foreground">Tap <strong>Add</strong> to confirm</p>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Desktop */
            <div className="space-y-3">
              <p className="text-sm text-center text-muted-foreground">
                Install GoldKach as an app for instant access, faster performance, and offline support.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                {[
                  { icon: "⚡", label: "Faster" },
                  { icon: "📴", label: "Offline" },
                  { icon: "🔔", label: "Notifications" },
                ].map((f) => (
                  <div key={f.label} className="rounded-lg bg-muted/50 border border-border p-2">
                    <p className="text-lg mb-0.5">{f.icon}</p>
                    <p>{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={close}
            >
              {isIOS ? "Got it" : "Not now"}
            </Button>
            {!isIOS && (
              <Button
                className="flex-1 h-10 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleInstall}
              >
                <Download className="h-4 w-4" />
                Install App
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
