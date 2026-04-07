"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  BarChart2, Play, Zap, CheckCircle, XCircle, Loader2,
  Calendar, TrendingUp, TrendingDown, ChevronDown, ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generatePerformanceReport,
  generateAllPerformanceReports,
  generateUserPerformanceReports,
} from "@/actions/portfolioPerformanceReports";

const fmt = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

interface Portfolio {
  id: string;
  customName: string;
  portfolio: { name: string; riskTolerance?: string };
  totalInvested: number;
  portfolioValue: number;
  totalLossGain: number;
  returnPct: number;
  wallet?: { netAssetValue?: number; totalFees?: number } | null;
  latestReport?: { reportDate: string; netAssetValue?: number; totalLossGain?: number; totalPercentage?: number } | null;
  reports: any[];
}

interface ClientPortfolio {
  client: any;
  portfolios: Portfolio[];
}

interface Props {
  clientPortfolios: ClientPortfolio[];
  adminId: string;
  adminName: string;
}

type ReportStatus = "idle" | "generating" | "success" | "error";

export function PerformanceReportsManager({ clientPortfolios, adminId, adminName }: Props) {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [portfolioStates, setPortfolioStates] = useState<Record<string, ReportStatus>>({});
  const [clientStates, setClientStates] = useState<Record<string, ReportStatus>>({});
  const [expandedPortfolios, setExpandedPortfolios] = useState<Set<string>>(new Set());
  const [isBulkGenerating, startBulkTransition] = useTransition();
  const [bulkResult, setBulkResult] = useState<{ success: number; failed: number; total: number } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPortfolios((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const setPortfolioStatus = (id: string, status: ReportStatus) =>
    setPortfolioStates((prev) => ({ ...prev, [id]: status }));

  const setClientStatus = (id: string, status: ReportStatus) =>
    setClientStates((prev) => ({ ...prev, [id]: status }));

  const handleSingleReport = async (portfolioId: string, portfolioName: string) => {
    setPortfolioStatus(portfolioId, "generating");
    const res = await generatePerformanceReport({ userPortfolioId: portfolioId, reportDate: reportDate || undefined });
    if (res.success) {
      setPortfolioStatus(portfolioId, "success");
      toast.success(`Report generated for ${portfolioName}`);
    } else {
      setPortfolioStatus(portfolioId, "error");
      toast.error(`Failed: ${res.error}`);
    }
  };

  const handleClientReport = async (clientId: string, clientName: string) => {
    setClientStatus(clientId, "generating");
    const res = await generateUserPerformanceReports(clientId, reportDate || undefined);
    if (res.success) {
      setClientStatus(clientId, "success");
      toast.success(`Reports generated for ${clientName}`);
    } else {
      setClientStatus(clientId, "error");
      toast.error(`Failed for ${clientName}: ${res.error}`);
    }
  };

  const handleBulkGenerate = () => {
    setBulkResult(null);
    startBulkTransition(async () => {
      const res = await generateAllPerformanceReports();
      if (res.success && res.data) {
        setBulkResult(res.data);
        toast.success(`Bulk complete — ${res.data.success}/${res.data.total} succeeded`);
      } else {
        toast.error(res.error || "Bulk generation failed.");
      }
    });
  };

  const totalPortfolios = clientPortfolios.reduce((s, cp) => s + cp.portfolios.length, 0);

  return (
    <div className="space-y-6">
      {/* Bulk Generate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" /> Bulk Report Generation
          </CardTitle>
          <CardDescription>
            Generate reports for all {totalPortfolios} portfolios across {clientPortfolios.length} clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-1.5">
              <Label htmlFor="reportDate" className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5" /> Report Date
              </Label>
              <Input id="reportDate" type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="w-48" />
            </div>
            <Button onClick={handleBulkGenerate} disabled={isBulkGenerating} className="gap-2">
              {isBulkGenerating
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating All…</>
                : <><Zap className="h-4 w-4" /> Generate All Reports</>}
            </Button>
          </div>
          {bulkResult && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              <span>
                <span className="font-semibold text-green-500">{bulkResult.success}</span> succeeded,{" "}
                <span className={`font-semibold ${bulkResult.failed > 0 ? "text-red-500" : "text-muted-foreground"}`}>{bulkResult.failed}</span> failed
                {" "}out of <span className="font-semibold">{bulkResult.total}</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-client */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Client Portfolios & Reports</h2>

        {clientPortfolios.length === 0 ? (
          <p className="text-sm text-slate-400">No client portfolios found.</p>
        ) : (
          clientPortfolios.map(({ client, portfolios }) => {
            const clientName = [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email;
            const clientStatus = clientStates[client.id] ?? "idle";

            return (
              <Card key={client.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <CardTitle className="text-sm font-semibold">{clientName}</CardTitle>
                      <CardDescription className="text-xs">{client.email} · {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}</CardDescription>
                    </div>
                    <Button
                      size="sm" variant="outline"
                      onClick={() => handleClientReport(client.id, clientName)}
                      disabled={clientStatus === "generating"}
                      className="gap-1.5 text-xs"
                    >
                      {clientStatus === "generating" ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                        : clientStatus === "success" ? <><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Generated</>
                        : clientStatus === "error" ? <><XCircle className="h-3.5 w-3.5 text-red-500" /> Retry All</>
                        : <><Play className="h-3.5 w-3.5" /> Generate All</>}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {portfolios.map((p) => {
                    const pStatus = portfolioStates[p.id] ?? "idle";
                    const isExpanded = expandedPortfolios.has(p.id);
                    const isPositive = p.totalLossGain >= 0;

                    return (
                      <div key={p.id} className="rounded-lg border border-border/60 overflow-hidden">
                        {/* Portfolio header row */}
                        <div className="flex items-center gap-3 p-3 bg-muted/20">
                          <BarChart2 className="h-4 w-4 text-slate-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{p.customName}</p>
                            <p className="text-[10px] text-muted-foreground">{p.portfolio?.name}</p>
                          </div>

                          {/* Current metrics */}
                          <div className="hidden md:flex items-center gap-4 text-xs">
                            <div className="text-center">
                              <p className="text-muted-foreground text-[10px]">Invested</p>
                              <p className="font-semibold">{fmt(p.totalInvested)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground text-[10px]">NAV</p>
                              <p className="font-semibold">{fmt(p.wallet?.netAssetValue ?? 0)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground text-[10px]">Return</p>
                              <p className={`font-semibold flex items-center gap-0.5 ${isPositive ? "text-green-500" : "text-red-500"}`}>
                                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {p.returnPct >= 0 ? "+" : ""}{p.returnPct.toFixed(2)}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground text-[10px]">Gain/Loss</p>
                              <p className={`font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>{fmt(p.totalLossGain)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {pStatus === "success" && <Badge variant="outline" className="text-[10px] border-green-400/40 text-green-500 bg-green-500/10"><CheckCircle className="h-2.5 w-2.5 mr-1" />Done</Badge>}
                            {pStatus === "error" && <Badge variant="outline" className="text-[10px] border-red-400/40 text-red-500 bg-red-500/10"><XCircle className="h-2.5 w-2.5 mr-1" />Failed</Badge>}
                            <Button size="sm" variant="ghost" onClick={() => handleSingleReport(p.id, p.customName)} disabled={pStatus === "generating"} className="h-7 px-2 text-xs gap-1">
                              {pStatus === "generating" ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Play className="h-3 w-3" /> Generate</>}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => toggleExpand(p.id)} className="h-7 px-2">
                              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>

                        {/* Expanded: existing reports */}
                        {isExpanded && (
                          <div className="border-t border-border/60">
                            {p.reports.length === 0 ? (
                              <p className="px-4 py-3 text-xs text-muted-foreground italic">No reports generated yet.</p>
                            ) : (
                              <table className="w-full text-xs">
                                <thead className="bg-muted/10 text-[10px] text-muted-foreground uppercase tracking-wide">
                                  <tr>
                                    <th className="px-4 py-2 text-left">Report Date</th>
                                    <th className="px-4 py-2 text-right">Close Value</th>
                                    <th className="px-4 py-2 text-right">NAV</th>
                                    <th className="px-4 py-2 text-right">Cost Price</th>
                                    <th className="px-4 py-2 text-right">Gain/Loss</th>
                                    <th className="px-4 py-2 text-right">Return %</th>
                                    <th className="px-4 py-2 text-right">Fees</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                  {p.reports.map((r: any) => {
                                    const pos = r.totalLossGain >= 0;
                                    return (
                                      <tr key={r.id} className="hover:bg-muted/10">
                                        <td className="px-4 py-2 font-medium">{fmtDate(r.reportDate)}</td>
                                        <td className="px-4 py-2 text-right">{fmt(r.totalCloseValue)}</td>
                                        <td className="px-4 py-2 text-right font-semibold text-blue-500">{fmt(r.netAssetValue)}</td>
                                        <td className="px-4 py-2 text-right">{fmt(r.totalCostPrice)}</td>
                                        <td className={`px-4 py-2 text-right font-semibold ${pos ? "text-green-500" : "text-red-500"}`}>{fmt(r.totalLossGain)}</td>
                                        <td className={`px-4 py-2 text-right font-semibold ${pos ? "text-green-500" : "text-red-500"}`}>
                                          {r.totalPercentage >= 0 ? "+" : ""}{r.totalPercentage.toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-2 text-right text-muted-foreground">{fmt(r.totalFees)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
