"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerManualBackup } from "@/actions/backups";

export function TriggerBackupButton() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrigger = async () => {
    setState("running");
    setErrorMsg("");

    const result = await triggerManualBackup();

    if (!result.success) {
      setState("error");
      setErrorMsg(result.error ?? "Unknown error");
      return;
    }

    setState("done");
    // Refresh the page after a delay so the new manifest entry has time to be written
    setTimeout(() => {
      router.refresh();
      setState("idle");
    }, 8000);
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        size="sm"
        onClick={handleTrigger}
        disabled={state === "running" || state === "done"}
        className="gap-2 h-9"
      >
        {state === "running" && <Loader2 className="h-4 w-4 animate-spin" />}
        {state === "done"    && <CheckCircle className="h-4 w-4 text-green-300" />}
        {state === "idle" || state === "error"
          ? <PlayCircle className="h-4 w-4" />
          : null}

        {state === "idle"    && "Run Backup Now"}
        {state === "running" && "Backup running…"}
        {state === "done"    && "Done — refreshing…"}
        {state === "error"   && "Retry"}
      </Button>

      {state === "running" && (
        <p className="text-[11px] text-muted-foreground">
          Running in background — page will refresh when complete.
        </p>
      )}
      {state === "error" && (
        <p className="text-[11px] text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
