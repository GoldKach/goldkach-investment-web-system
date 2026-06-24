"use client";

import { useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import {
  Calendar, Save, RefreshCw, Loader2, CheckCircle, AlertCircle,
  BarChart2, TrendingUp, Info, Play,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  getAssetPriceHistoryForDate,
  batchUpsertAssetPriceHistory,
  type AssetPriceHistoryEntry,
} from "@/actions/assets";
import { generateAllReportsForDate } from "@/actions/portfolioPerformanceReports";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const today = new Date().toISOString().split("T")[0];

export function PriceHistoryManager() {
  const [selectedDate, setSelectedDate] = useState(today);
  const [rows, setRows] = useState<AssetPriceHistoryEntry[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({}); // assetId → edited price string
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isSaving, startSaveTransition] = useTransition();
  const [isGenerating, startGenerateTransition] = useTransition();

  const handleLoad = useCallback(async () => {
    if (!selectedDate) { toast.error("Select a date first."); return; }
    setIsLoading(true);
    setHasLoaded(false);
    const res = await getAssetPriceHistoryForDate(selectedDate);
    setIsLoading(false);
    if (res.success && res.data) {
      setRows(res.data);
      // Seed the edit map with the stored historical price for each asset
      const initial: Record<string, string> = {};
      res.data.forEach((r) => { initial[r.id] = String(r.historicalPrice); });
      setEdits(initial);
      setHasLoaded(true);
    } else {
      toast.error(res.error ?? "Failed to load prices.");
    }
  }, [selectedDate]);

  const handleSave = () => {
    if (!hasLoaded) { toast.error("Load prices for a date first."); return; }
    startSaveTransition(async () => {
      const prices = rows.map((r) => ({
        assetId:    r.id,
        closePrice: parseFloat(edits[r.id] ?? "0") || 0,
      }));
      const res = await batchUpsertAssetPriceHistory(selectedDate, prices);
      if (res.success) {
        toast.success(res.message ?? `Prices saved for ${selectedDate}.`);
        // Reload to reflect stored values and update hasHistory badges
        await handleLoad();
      } else {
        toast.error(res.error ?? "Failed to save prices.");
      }
    });
  };

  const handleGenerateReports = () => {
    startGenerateTransition(async () => {
      const res = await generateAllReportsForDate(selectedDate);
      if (res.success && res.data) {
        toast.success(
          `Reports generated for ${selectedDate}: ${res.data.success} succeeded, ${res.data.failed} failed out of ${res.data.total}`
        );
      } else {
        toast.error(res.error ?? "Failed to generate reports.");
      }
    });
  };

  const dirtyCount = rows.filter(
    (r) => (parseFloat(edits[r.id] ?? "0") || 0) !== r.historicalPrice
  ).length;

  return (
    <div className="space-y-6">
      {/* Header / instructions */}
      <Card className="border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20">
        <CardContent className="pt-5 pb-4">
          <div className="flex gap-3">
            <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <p className="font-semibold">How to fix historical reports:</p>
              <ol className="list-decimal ml-4 space-y-0.5 text-xs">
                <li>Pick a past date and click <strong>Load Prices</strong></li>
                <li>Edit the close price for each asset as it was on that date</li>
                <li>Click <strong>Save Prices for Date</strong> — values are stored in the price history table</li>
                <li>Click <strong>Generate Reports for Date</strong> — all client reports for that date are regenerated using these prices</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date picker + actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-slate-400" /> Asset Close Price History
          </CardTitle>
          <CardDescription className="text-xs">
            Set correct close prices for any back-date so historical reports pick them up automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="priceDate" className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5" /> Date
              </Label>
              <Input
                id="priceDate"
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => { setSelectedDate(e.target.value); setHasLoaded(false); setRows([]); setEdits({}); }}
                className="w-44"
              />
            </div>

            <Button onClick={handleLoad} disabled={isLoading || !selectedDate} variant="outline" className="gap-2">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading…</> : <><RefreshCw className="h-4 w-4" /> Load Prices</>}
            </Button>

            <Button
              onClick={handleSave}
              disabled={!hasLoaded || isSaving || isLoading}
              className="gap-2"
            >
              {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Prices for {selectedDate || "Date"}</>}
            </Button>

            <Button
              onClick={handleGenerateReports}
              disabled={!selectedDate || isGenerating || isSaving}
              variant="secondary"
              className="gap-2"
            >
              {isGenerating
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                : <><Play className="h-4 w-4" /> Generate Reports for {selectedDate || "Date"}</>}
            </Button>
          </div>

          {dirtyCount > 0 && (
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {dirtyCount} unsaved change{dirtyCount !== 1 ? "s" : ""} — click Save before generating reports.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Price table */}
      {hasLoaded && rows.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-sm">
                Prices for <span className="text-blue-500">{selectedDate}</span>
                <span className="ml-2 text-muted-foreground font-normal text-xs">({rows.length} assets)</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> = stored in history table</span>
                <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3 text-amber-400" /> = using live price (no history)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wide border-b border-border">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Symbol</th>
                    <th className="px-4 py-2.5 text-left">Description</th>
                    <th className="px-4 py-2.5 text-left">Class</th>
                    <th className="px-4 py-2.5 text-right">Live Price</th>
                    <th className="px-4 py-2.5 text-right w-40">
                      Close Price for {selectedDate}
                    </th>
                    <th className="px-4 py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {rows.map((r) => {
                    const editVal = edits[r.id] ?? String(r.historicalPrice);
                    const parsed = parseFloat(editVal) || 0;
                    const isDirty = parsed !== r.historicalPrice;
                    const diffPct = r.liveClosePrice > 0
                      ? ((parsed - r.liveClosePrice) / r.liveClosePrice) * 100
                      : 0;

                    return (
                      <tr key={r.id} className={`hover:bg-muted/10 ${isDirty ? "bg-amber-50/30 dark:bg-amber-950/10" : ""}`}>
                        <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-white font-mono">
                          {r.symbol}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs max-w-[200px] truncate">
                          {r.description}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge variant="outline" className="text-[10px] font-normal">
                            {r.assetClass ?? "—"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground font-mono text-xs">
                          {fmt(r.liveClosePrice)}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-muted-foreground text-xs">$</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editVal}
                              onChange={(e) => setEdits((prev) => ({ ...prev, [r.id]: e.target.value }))}
                              className={`w-28 h-7 text-right text-sm font-mono ${isDirty ? "border-amber-400 focus-visible:ring-amber-400" : ""}`}
                            />
                          </div>
                          {isDirty && (
                            <p className={`text-[10px] text-right mt-0.5 ${diffPct >= 0 ? "text-green-600" : "text-red-500"}`}>
                              {diffPct >= 0 ? "+" : ""}{diffPct.toFixed(2)}% vs live
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {r.hasHistory
                            ? <span className="flex items-center justify-center gap-1 text-green-600 text-xs"><CheckCircle className="h-3.5 w-3.5" />Stored</span>
                            : <span className="flex items-center justify-center gap-1 text-amber-500 text-xs"><AlertCircle className="h-3.5 w-3.5" />Using live</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer save bar */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/10">
              <p className="text-xs text-muted-foreground">
                {dirtyCount > 0
                  ? <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" />{dirtyCount} unsaved change{dirtyCount !== 1 ? "s" : ""}</span>
                  : <span className="flex items-center gap-1.5 text-green-600"><CheckCircle className="h-3.5 w-3.5" />All saved</span>}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving || !hasLoaded} className="gap-1.5 text-xs">
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Prices
                </Button>
                <Button size="sm" onClick={handleGenerateReports} disabled={isGenerating || isSaving} className="gap-1.5 text-xs">
                  {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingUp className="h-3.5 w-3.5" />}
                  Generate Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasLoaded && rows.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No assets found. Add assets first under Assets Management.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
