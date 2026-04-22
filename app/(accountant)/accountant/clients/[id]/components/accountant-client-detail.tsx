"use client";

import { useState, useCallback } from "react";
import {
  Download, Eye, FileText, ChevronDown, ChevronUp,
  Loader2, RefreshCw, Calendar, X, TrendingUp, TrendingDown,
  Wallet, BarChart2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import type { PortfolioSummary } from "@/actions/portfolio-summary";
import { generatePerformanceReportPDF } from "@/components/front-end/generate-report-pdf";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

interface Props {
  client: any;
  portfolioSummary: PortfolioSummary | null;
}

export function AccountantClientDetail({ client, portfolioSummary }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reports, setReports] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  const fetchReports = useCallback(async (portfolioId: string, date: string) => {
    setLoading((prev) => new Set(prev).add(portfolioId));
    try {
      const dateParams = date
        ? {
            startDate: new Date(date + "T00:00:00.000Z").toISOString(),
            endDate: new Date(date + "T23:59:59.999Z").toISOString(),
          }
        : {};
      const res = await listPerformanceReports({ userPortfolioId: portfolioId, period: "daily", ...dateParams });
      if (res.success) {
        setReports((prev) => ({
          ...prev,
          [portfolioId]: [...(res.data ?? [])].sort(
            (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
          ),
        }));
      }
    } finally {
      setLoading((prev) => { const s = new Set(prev); s.delete(portfolioId); return s; });
    }
  }, []);

  const togglePortfolio = useCallback(async (portfolioId: string) => {
    setExpanded((prev) => {
      const s = new Set(prev);
      if (s.has(portfolioId)) { s.delete(portfolioId); return s; }
      s.add(portfolioId);
      return s;
    });
    if (!reports[portfolioId]) {
      await fetchReports(portfolioId, selectedDate);
    }
  }, [reports, selectedDate, fetchReports]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setReports({});
    // Re-fetch all expanded portfolios with new date
    expanded.forEach((id) => fetchReports(id, date));
  };

  const generatePDF = async (report: any, portfolio: any) => {
    setGeneratingPdf(report.id);
    try {
      const clientName = [client?.firstName, client?.lastName].filter(Boolean).join(" ") || client?.email || "—";
      const masterWallet = portfolioSummary?.masterWallet;
      const assets: any[] = portfolio.assets ?? [];

      // Build assetBreakdown by asset class
      const classMap: Record<string, { holdings: number; totalCashValue: number }> = {};
      assets.forEach((a: any) => {
        const cls = a.asset?.assetClass || "Other";
        if (!classMap[cls]) classMap[cls] = { holdings: 0, totalCashValue: 0 };
        classMap[cls].holdings += 1;
        classMap[cls].totalCashValue += a.closeValue ?? 0;
      });
      const totalCloseValue = assets.reduce((s: number, a: any) => s + (a.closeValue ?? 0), 0);
      const assetBreakdown = Object.entries(classMap).map(([assetClass, v]) => ({
        assetClass,
        holdings: v.holdings,
        totalCashValue: v.totalCashValue,
        percentage: totalCloseValue > 0 ? (v.totalCashValue / totalCloseValue) * 100 : 0,
      }));

      const reportData = {
        id: report.id,
        userPortfolioId: portfolio.id,
        reportDate: report.reportDate,
        totalCostPrice: report.totalCostPrice ?? 0,
        totalCloseValue: report.totalCloseValue ?? 0,
        totalLossGain: report.totalLossGain ?? 0,
        totalPercentage: report.totalPercentage ?? 0,
        totalFees: report.totalFees ?? 0,
        netAssetValue: report.netAssetValue ?? 0,
        bankCost: report.bankCost ?? (portfolio.wallet as any)?.bankFee ?? 0,
        transactionCost: report.transactionCost ?? (portfolio.wallet as any)?.transactionFee ?? 0,
        cashAtBank: report.cashAtBank ?? (portfolio.wallet as any)?.feeAtBank ?? 0,
        assetBreakdown,
        userPortfolio: {
          id: portfolio.id,
          customName: portfolio.customName,
          portfolio: portfolio.portfolio,
          userAssets: assets.map((a: any) => ({
            stock: a.stock ?? 0,
            allocationPercentage: a.allocationPercentage ?? 0,
            costPerShare: a.costPerShare ?? 0,
            costPrice: a.costPrice ?? 0,
            closeValue: a.closeValue ?? 0,
            lossGain: a.lossGain ?? 0,
            asset: {
              symbol: a.asset?.symbol,
              description: a.asset?.description,
              closePrice: a.asset?.closePrice,
            },
          })),
        },
      };

      const userData = {
        firstName: client?.firstName,
        lastName: client?.lastName,
        masterWallet: {
          accountNumber: masterWallet?.accountNumber,
          bankFee: (portfolio.wallet as any)?.bankFee ?? (masterWallet as any)?.bankFee,
          transactionFee: (portfolio.wallet as any)?.transactionFee ?? (masterWallet as any)?.transactionFee,
          feeAtBank: (portfolio.wallet as any)?.feeAtBank ?? (masterWallet as any)?.feeAtBank,
          totalFees: (portfolio.wallet as any)?.totalFees ?? masterWallet?.totalFees,
        },
      };

      return await generatePerformanceReportPDF(reportData, userData, clientName);
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleView = async (report: any, portfolio: any) => {
    const doc = await generatePDF(report, portfolio);
    window.open(URL.createObjectURL(doc.output("blob")), "_blank");
  };

  const handleDownload = async (report: any, portfolio: any) => {
    const doc = await generatePDF(report, portfolio);
    const name = [client?.firstName, client?.lastName].filter(Boolean).join("-") || "client";
    doc.save(`report-${name}-${report.reportDate.split("T")[0]}.pdf`);
  };

  if (!portfolioSummary) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <BarChart2 className="h-10 w-10 text-muted-foreground opacity-30" />
          <p className="text-sm text-muted-foreground">No portfolio data available for this client.</p>
        </CardContent>
      </Card>
    );
  }

  const { aggregate, masterWallet, portfolios } = portfolioSummary;
  const aggPos = aggregate.totalGainLoss >= 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Invested", value: fmt(aggregate.totalInvested),
            icon: Wallet, cls: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20",
          },
          {
            label: "Current Value", value: fmt(aggregate.totalValue),
            icon: BarChart2, cls: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20",
          },
          {
            label: "Total Gain / Loss",
            value: `${aggPos ? "+" : ""}${fmt(aggregate.totalGainLoss)}`,
            icon: aggPos ? TrendingUp : TrendingDown,
            cls: aggPos ? "text-emerald-400" : "text-red-400",
            bg: aggPos ? "bg-emerald-500/10" : "bg-red-500/10",
            border: aggPos ? "border-emerald-500/20" : "border-red-500/20",
          },
          {
            label: "Return %",
            value: `${aggregate.returnPct >= 0 ? "+" : ""}${aggregate.returnPct.toFixed(2)}%`,
            icon: aggPos ? TrendingUp : TrendingDown,
            cls: aggPos ? "text-emerald-400" : "text-red-400",
            bg: aggPos ? "bg-emerald-500/10" : "bg-red-500/10",
            border: aggPos ? "border-emerald-500/20" : "border-red-500/20",
          },
        ].map((item) => (
          <Card key={item.label} className={`border ${item.border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{item.label}</CardTitle>
              <div className={`rounded-lg p-1.5 ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.cls}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-bold ${item.cls}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Master Wallet */}
      {masterWallet && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-400" />
              Master Wallet
              <span className="font-mono text-xs text-muted-foreground font-normal ml-1">{masterWallet.accountNumber}</span>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Net Asset Value", value: fmt(masterWallet.netAssetValue), cls: "text-blue-400" },
                { label: "Total Deposited", value: fmt(masterWallet.totalDeposited), cls: "text-emerald-400" },
                { label: "Total Withdrawn", value: fmt(masterWallet.totalWithdrawn), cls: "text-red-400" },
                { label: "Total Fees", value: fmt(masterWallet.totalFees), cls: "text-amber-400" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-sm font-bold ${item.cls}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Performance Reports
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Click a portfolio to load its reports. Filter by date to view a specific day.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-40 text-sm h-8"
              />
              {selectedDate && (
                <Button size="sm" variant="ghost" onClick={() => handleDateChange("")} className="h-8 gap-1 text-xs">
                  <X className="h-3.5 w-3.5" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {portfolios.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No portfolios found.</p>
          ) : (
            portfolios.map((p) => {
              const isExpanded = expanded.has(p.id);
              const isLoading = loading.has(p.id);
              const portfolioReports = reports[p.id] ?? [];
              const isPos = p.totalLossGain >= 0;

              return (
                <div key={p.id} className="rounded-lg border border-border/60 overflow-hidden">
                  {/* Portfolio header row */}
                  <div
                    className="flex items-center gap-3 p-3 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => togglePortfolio(p.id)}
                  >
                    <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.customName}</p>
                      <p className="text-xs text-muted-foreground">{p.portfolio?.name}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">
                        Invested: <span className="font-semibold text-foreground">{fmt(p.totalInvested)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        NAV: <span className="font-semibold text-blue-500">{fmt(p.wallet?.netAssetValue ?? 0)}</span>
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 ${isPos ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"}`}
                      >
                        {p.returnPct >= 0 ? "+" : ""}{p.returnPct.toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
                      {isExpanded && !isLoading && (
                        <Button
                          size="sm" variant="ghost" className="h-6 w-6 p-0"
                          onClick={(e) => { e.stopPropagation(); fetchReports(p.id, selectedDate); }}
                          title="Refresh reports"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                      {isExpanded
                        ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                        : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Reports list */}
                  {isExpanded && (
                    <div className="border-t border-border/60">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        </div>
                      ) : portfolioReports.length === 0 ? (
                        <p className="px-4 py-4 text-xs text-muted-foreground italic">
                          {selectedDate
                            ? `No report found for ${new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}.`
                            : "No reports generated yet."}
                        </p>
                      ) : (
                        <div className="divide-y divide-border/40">
                          {portfolioReports.map((r) => {
                            const pos = r.totalLossGain >= 0;
                            const isGen = generatingPdf === r.id;
                            return (
                              <div key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/10 flex-wrap">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold">{fmtDate(r.reportDate)}</p>
                                  <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                                    <span>NAV: <span className="text-blue-500 font-medium">{fmt(r.netAssetValue)}</span></span>
                                    <span>Close: <span className="font-medium">{fmt(r.totalCloseValue)}</span></span>
                                    <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>
                                      {fmt(r.totalLossGain)}
                                    </span>
                                    <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>
                                      {r.totalPercentage >= 0 ? "+" : ""}{r.totalPercentage.toFixed(2)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm" variant="outline"
                                    onClick={() => handleView(r, p)}
                                    disabled={isGen}
                                    className="gap-1.5 text-xs h-7"
                                  >
                                    {isGen ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                                    View
                                  </Button>
                                  <Button
                                    size="sm" variant="outline"
                                    onClick={() => handleDownload(r, p)}
                                    disabled={isGen}
                                    className="gap-1.5 text-xs h-7"
                                  >
                                    {isGen ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                                    PDF
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
