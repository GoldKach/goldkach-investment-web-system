"use client";

import { useState, useCallback } from "react";
import { FileText, ChevronDown, ChevronUp, Loader2, Eye, Download, Calendar, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import { generatePerformanceReportPDF } from "@/components/front-end/generate-report-pdf";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

interface Props {
  portfolios: any[];
  reports: Record<string, any[]>;
  client: any;
  masterWallet: any;
}

export function AccountantReportsSection({ portfolios, reports: initialReports, client, masterWallet }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reports, setReports] = useState<Record<string, any[]>>(initialReports);
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
    expanded.forEach((id) => fetchReports(id, date));
  };

  const generatePDF = async (report: any, portfolio: any) => {
    setGeneratingPdf(report.id);
    try {
      const clientName = [client?.firstName, client?.lastName].filter(Boolean).join(" ") || client?.email || "—";
      const assets: any[] = portfolio.assets ?? portfolio.userAssets ?? [];

      const assetBreakdown: any[] = report.assetBreakdown?.length
        ? report.assetBreakdown
        : (() => {
            const classMap: Record<string, { holdings: number; totalCashValue: number }> = {};
            assets.forEach((a: any) => {
              const cls = a.asset?.assetClass || "Other";
              if (!classMap[cls]) classMap[cls] = { holdings: 0, totalCashValue: 0 };
              classMap[cls].holdings += 1;
              classMap[cls].totalCashValue += a.closeValue ?? 0;
            });
            const totalCV = assets.reduce((s: number, a: any) => s + (a.closeValue ?? 0), 0);
            return Object.entries(classMap).map(([assetClass, v]) => ({
              assetClass, holdings: v.holdings, totalCashValue: v.totalCashValue,
              percentage: totalCV > 0 ? (v.totalCashValue / totalCV) * 100 : 0,
            }));
          })();

      const enrichedReport = {
        ...report,
        assetBreakdown,
        userPortfolio: {
          ...(report.userPortfolio ?? { id: portfolio.id, portfolioId: portfolio.portfolio?.id, customName: portfolio.customName }),
          portfolio: portfolio.portfolio,
          userAssets: assets.map((a: any) => ({
            stock: a.stock ?? 0,
            allocationPercentage: a.allocationPercentage ?? 0,
            costPerShare: a.costPerShare ?? 0,
            costPrice: a.costPrice ?? 0,
            closeValue: a.closeValue ?? 0,
            lossGain: a.lossGain ?? 0,
            asset: { symbol: a.asset?.symbol, description: a.asset?.description, closePrice: a.asset?.closePrice },
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

      return await generatePerformanceReportPDF(enrichedReport, userData, clientName);
    } finally {
      setGeneratingPdf(null);
    }
  };

  if (portfolios.length === 0) return null;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Performance Reports
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Click a portfolio to load its reports. Filter by date to view a specific day.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
      <CardContent className="pt-0 space-y-3">
        {portfolios.map((p) => {
          const isExpanded = expanded.has(p.id);
          const isLoading = loading.has(p.id);
          const portfolioReports = reports[p.id] ?? [];

          return (
            <div key={p.id} className="rounded-lg border border-border/60 overflow-hidden">
              <div
                className="flex items-center gap-3 p-3 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => togglePortfolio(p.id)}
              >
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.customName}</p>
                  <p className="text-xs text-muted-foreground">{p.portfolio?.name}</p>
                </div>
                <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                  {p.latestReport && (
                    <span>
                      NAV: <span className="font-semibold text-blue-500">{fmt(p.latestReport.netAssetValue)}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border/60">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
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
                                <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>{fmt(r.totalLossGain)}</span>
                                <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>
                                  {r.totalPercentage >= 0 ? "+" : ""}{r.totalPercentage.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                size="sm" variant="outline"
                                onClick={async () => { const doc = await generatePDF(r, p); window.open(URL.createObjectURL(doc.output("blob")), "_blank"); }}
                                disabled={isGen} className="gap-1.5 text-xs h-7"
                              >
                                {isGen ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                                View
                              </Button>
                              <Button
                                size="sm" variant="outline"
                                onClick={async () => {
                                  const doc = await generatePDF(r, p);
                                  const name = [client?.firstName, client?.lastName].filter(Boolean).join("-") || "client";
                                  doc.save(`report-${name}-${r.reportDate.split("T")[0]}.pdf`);
                                }}
                                disabled={isGen} className="gap-1.5 text-xs h-7"
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
        })}
      </CardContent>
    </Card>
  );
}
