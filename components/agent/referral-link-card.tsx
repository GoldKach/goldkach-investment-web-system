"use client";

import * as React from "react";
import { Copy, Check, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  staffProfileId: string;
}

export function ReferralLinkCard({ staffProfileId }: Props) {
  const [copied, setCopied] = React.useState(false);
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    setUrl(`${window.location.origin}/register?agent=${staffProfileId}`);
  }, [staffProfileId]);

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!staffProfileId) return null;

  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Link className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">Your Referral Link</p>
          <p className="text-xs text-slate-400">Share this link with new clients to be auto-assigned to you</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
        <p className="flex-1 text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
          {url || "Loading…"}
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5 h-7 px-2.5"
          onClick={copy}
          disabled={!url}
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5" /> Copied</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> Copy</>
          )}
        </Button>
      </div>
    </div>
  );
}
