"use client";

import { useState, useTransition } from "react";
import { FileDown, Loader2, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getAuditReportData } from "@/actions/audit-logs";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  generatedBy?: string;
}

export function AuditPdfDialog({ open, onOpenChange, generatedBy }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [sections, setSections]   = useState({
    sessions:    true,
    deposits:    true,
    withdrawals: true,
  });

  const [status, setStatus]   = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg]   = useState("");
  const [counts, setCounts]   = useState<{ sessions: number; deposits: number; withdrawals: number } | null>(null);
  const [isPending, start]    = useTransition();

  const anySection = sections.sessions || sections.deposits || sections.withdrawals;

  function reset() {
    setStatus("idle");
    setErrMsg("");
    setCounts(null);
  }

  function handleClose(v: boolean) {
    if (!isPending) {
      if (!v) reset();
      onOpenChange(v);
    }
  }

  function toggle(key: keyof typeof sections) {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleGenerate() {
    if (!anySection) return;

    start(async () => {
      setStatus("loading");
      setErrMsg("");
      setCounts(null);

      const include = (
        [
          sections.sessions    ? "sessions"    : null,
          sections.deposits    ? "deposits"    : null,
          sections.withdrawals ? "withdrawals" : null,
        ] as (string | null)[]
      )
        .filter(Boolean)
        .join(",");

      const res = await getAuditReportData({
        startDate: startDate || undefined,
        endDate:   endDate   || undefined,
        include,
      });

      if (res.error || !res.data) {
        setStatus("error");
        setErrMsg(res.error ?? "Unknown error");
        return;
      }

      const { loginSessions, deposits, withdrawals } = res.data;

      setCounts({
        sessions:    loginSessions.length,
        deposits:    deposits.length,
        withdrawals: withdrawals.length,
      });

      try {
        const { generateAuditPdf } = await import("@/lib/audit-pdf");
        await generateAuditPdf({
          data: res.data,
          startDate: startDate || undefined,
          endDate:   endDate   || undefined,
          generatedBy,
          includeSections: sections,
        });
        setStatus("done");
      } catch (e) {
        setStatus("error");
        setErrMsg(e instanceof Error ? e.message : "PDF generation failed");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="size-5 text-amber-500" />
            Generate Audit PDF Report
          </DialogTitle>
          <DialogDescription>
            Produces a formatted, multi-section PDF with a cover page. All times in Africa/Nairobi (EAT).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pdf-start" className="text-xs">From date</Label>
              <Input
                id="pdf-start"
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); reset(); }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pdf-end" className="text-xs">To date</Label>
              <Input
                id="pdf-end"
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); reset(); }}
              />
            </div>
          </div>
          {!startDate && !endDate && (
            <p className="text-xs text-amber-600 -mt-2">
              No date range selected — all records will be included.
            </p>
          )}

          {/* Sections */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase tracking-wider">Include sections</Label>
            <div className="rounded-lg border divide-y">
              {(
                [
                  { key: "sessions",    label: "Login Sessions",          desc: "All user login/session records" },
                  { key: "deposits",    label: "Deposits & Allocations",  desc: "Master deposits and portfolio allocations" },
                  { key: "withdrawals", label: "Withdrawals & Redemptions", desc: "Cash-outs and portfolio redemptions" },
                ] as const
              ).map(({ key, label, desc }) => (
                <label
                  key={key}
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <Checkbox
                    checked={sections[key]}
                    onCheckedChange={() => { toggle(key); reset(); }}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium leading-none">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {!anySection && (
              <p className="text-xs text-red-500">Select at least one section.</p>
            )}
          </div>

          {/* Status feedback */}
          {status === "loading" && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-400/30 p-3 text-sm text-blue-600">
              <Loader2 className="size-4 animate-spin shrink-0" />
              Fetching data and generating PDF…
            </div>
          )}

          {status === "done" && counts && (
            <div className="rounded-lg bg-green-500/10 border border-green-400/30 p-3 text-sm text-green-600 space-y-1">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="size-4 shrink-0" />
                PDF downloaded successfully
              </div>
              <div className="text-xs text-green-500 pl-6 space-y-0.5">
                {sections.sessions    && <p>{counts.sessions} login sessions</p>}
                {sections.deposits    && <p>{counts.deposits} deposits</p>}
                {sections.withdrawals && <p>{counts.withdrawals} withdrawals / redemptions</p>}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-400/30 p-3 text-sm text-red-500">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{errMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              disabled={isPending}
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
            <Button
              className="flex-1 gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isPending || !anySection}
              onClick={handleGenerate}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FileDown className="size-4" />
              )}
              {status === "done" ? "Download Again" : "Generate & Download"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
