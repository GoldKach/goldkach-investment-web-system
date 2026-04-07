"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Download, Eye, TrendingUp, TrendingDown,
  RefreshCw, Loader2, FileText, BarChart2, Calendar, X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { listPerformanceReports, getLatestPerformanceReport } from "@/actions/portfolioPerformanceReports";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { PeriodFilter } from "@/components/agent/period-filter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Period = "daily" | "weekly" | "monthly";

const fmt = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function AgentPortfolioReportsPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const userPortfolioId = params.userPortfolioId as string;

  const [period, setPeriod] = useState<Period>("daily");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [reports, setReports] = useState<any[]>([]);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [portfolioSummary, setPortfolioSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  const portfolioItem = portfolioSummary?.portfolios?.find((p: any) => p.id === userPortfolioId);
  const clientInfo = portfolioSummary?.user;

  const fetchData = useCallback(async (p: Period, date?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Build date range params — if a specific date is selected, fetch just that day
      const dateParams = date
        ? {
            startDate: new Date(date + "T00:00:00.000Z").toISOString(),
            endDate:   new Date(date + "T23:59:59.999Z").toISOString(),
          }
        : {};

      const [reportsRes, latestRes, summaryRes] = await Promise.all([
        listPerformanceReports({ userPortfolioId, period: p, ...dateParams }),
        getLatestPerformanceReport(userPortfolioId),
        getPortfolioSummary(clientId),
      ]);
      if (reportsRes.success) {
        setReports([...(reportsRes.data ?? [])].sort(
          (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
        ));
      } else {
        setError(reportsRes.error || "Failed to load reports.");
      }
      if (latestRes.success) setLatestReport(latestRes.data ?? null);
      if (summaryRes.success) setPortfolioSummary(summaryRes.data ?? null);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [userPortfolioId, clientId]);

  useEffect(() => { fetchData(period, selectedDate || undefined); }, [period, selectedDate, fetchData]);

  const generatePDF = async (report: any) => {
    setGeneratingPdf(report.id);
    try {
      const doc = new jsPDF("portrait");
      const logoImg = new Image();
      logoImg.src = "/logos/GoldKach-Logo-New-1.jpg";
      await new Promise((res) => { logoImg.onload = res; logoImg.onerror = res; });

      // Border
      doc.setDrawColor(25, 51, 136);
      doc.setLineWidth(4);
      doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, "S");

      // Logo
      try { doc.addImage(logoImg, "JPEG", 10, 10, 45, 35); } catch {}

      // Title
      doc.setFillColor(25, 51, 136);
      doc.rect(70, 15, 130, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("GoldKach Performance Report", 135, 27, { align: "center" });
      doc.setTextColor(0, 0, 0);

      let y = 50;
      const clientName = clientInfo
        ? [clientInfo.firstName, clientInfo.lastName].filter(Boolean).join(" ") || clientInfo.email
        : "Client";
      const portfolioName = portfolioItem?.portfolio?.name || portfolioItem?.customName || "Portfolio";
      const reportDate = fmtDate(report.reportDate);
      const quarter = `Q${Math.floor(new Date(report.reportDate).getMonth() / 3) + 1} ${new Date(report.reportDate).getFullYear()}`;

      // Client info section
      doc.setFillColor(25, 51, 136);
      doc.rect(15, y, 90, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Client Information", 20, y + 7);
      doc.setTextColor(0, 0, 0);
      y += 15;
      doc.setFontSize(10);
      [
        ["Client Name:", clientName],
        ["Fund Name:", portfolioName],
        ["Reporting Period:", quarter],
        ["Report Date:", reportDate],
      ].forEach(([label, value]) => {
        doc.setFont("helvetica", "bold"); doc.text(label, 20, y);
        doc.setFont("helvetica", "normal"); doc.text(value, 60, y);
        y += 6;
      });

      y += 5;

      // Performance snapshot
      doc.setFillColor(25, 51, 136);
      doc.rect(15, y, 90, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Performance Snapshot", 20, y + 7);
      doc.setTextColor(0, 0, 0);
      y += 15;

      autoTable(doc, {
        startY: y,
        head: [["Metric", "Value"]],
        body: [
          ["Close Value", fmt(report.totalCloseValue)],
          ["Cost Price", fmt(report.totalCostPrice)],
          ["Net Asset Value", fmt(report.netAssetValue)],
          ["Gain / Loss", fmt(report.totalLossGain)],
          ["Return %", `${report.totalPercentage >= 0 ? "+" : ""}${report.totalPercentage.toFixed(2)}%`],
          ["Total Fees", fmt(report.totalFees)],
        ],
        theme: "grid",
        headStyles: { fillColor: [25, 51, 136], textColor: [255, 255, 255], fontSize: 10 },
        bodyStyles: { fontSize: 10 },
        columnStyles: { 0: { halign: "left", cellWidth: 60 }, 1: { halign: "right", cellWidth: 60 } },
        margin: { left: 20 },
        tableWidth: 120,
      });

      y = (doc as any).lastAutoTable.finalY + 10;

      // Asset holdings — page 2
      const assets = portfolioItem?.assets ?? [];
      if (assets.length > 0) {
        doc.addPage();
        doc.setDrawColor(25, 51, 136);
        doc.setLineWidth(4);
        doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, "S");
        try { doc.addImage(logoImg, "JPEG", 10, 10, 45, 35); } catch {}

        y = 50;
        doc.setFillColor(25, 51, 136);
        doc.rect(15, y, 120, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Portfolio Holdings", 20, y + 7);
        doc.setTextColor(0, 0, 0);
        y += 15;

        const rows = assets.map((a: any) => [
          a.asset?.symbol || "—",
          a.asset?.description || "—",
          a.stock.toFixed(2),
          `${a.allocationPercentage.toFixed(0)}%`,
          fmt(a.costPerShare),
          fmt(a.costPrice),
          fmt(a.asset?.closePrice || 0),
          fmt(a.closeValue),
          fmt(a.lossGain),
        ]);
        const subTotal = assets.reduce((s: any, a: any) => ({
          costPrice: s.costPrice + a.costPrice,
          closeValue: s.closeValue + a.closeValue,
          lossGain: s.lossGain + a.lossGain,
        }), { costPrice: 0, closeValue: 0, lossGain: 0 });
        rows.push(["Sub Total", "", "", "", "", fmt(subTotal.costPrice), "", fmt(subTotal.closeValue), fmt(subTotal.lossGain)]);

        autoTable(doc, {
          startY: y,
          head: [["Symbol", "Description", "Stocks", "Alloc%", "Cost/Share", "Cost Price", "Close Price", "Close Value", "Gain/Loss"]],
          body: rows,
          theme: "grid",
          headStyles: { fillColor: [25, 51, 136], textColor: [255, 255, 255], fontSize: 7, fontStyle: "bold", halign: "center", cellPadding: 1.5 },
          bodyStyles: { fontSize: 7, cellPadding: 1.5 },
          columnStyles: {
            0: { cellWidth: 14, halign: "left" },
            1: { cellWidth: 28, halign: "left" },
            2: { cellWidth: 18, halign: "right" },
            3: { cellWidth: 16, halign: "center" },
            4: { cellWidth: 20, halign: "right" },
            5: { cellWidth: 24, halign: "right" },
            6: { cellWidth: 22, halign: "right" },
            7: { cellWidth: 22, halign: "right" },
            8: { cellWidth: 23, halign: "right" },
          },
          margin: { left: 15, right: 15 },
          didParseCell: (data) => {
            if (data.row.index === rows.length - 1 && data.section === "body") {
              data.cell.styles.fontStyle = "bold";
              data.cell.styles.fillColor = [230, 230, 230];
            }
          },
        });
      }

      // Footer page
      doc.addPage();
      doc.setDrawColor(25, 51, 136);
      doc.setLineWidth(4);
      doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, "S");
      try { doc.addImage(logoImg, "JPEG", 10, 10, 45, 35); } catch {}
      y = 50;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("GoldKach Uganda Limited is regulated by the Capital Markets Authority of Uganda as a Fund", 15, y);
      doc.text("Manager. Licence No. GKUL 2526 (FM)", 15, y + 5);
      y += 20;
      ["3rd Floor Kanjokya House", "Plot 90 Kanjokya Street", "P.O.Box 500094", "Kampala, Uganda",
        "+256 200903314 / +256 393246074", "info@goldkach.co.ug | itsupport@goldkach.co.ug"].forEach((line) => {
        doc.text(line, 15, y); y += 5;
      });

      return doc;
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleView = async (report: any) => {
    const doc = await generatePDF(report);
    window.open(URL.createObjectURL(doc.output("blob")), "_blank");
  };

  const handleDownload = async (report: any) => {
    const doc = await generatePDF(report);
    const name = clientInfo ? [clientInfo.firstName, clientInfo.lastName].filter(Boolean).join("-") : "client";
    doc.save(`report-${name}-${report.reportDate.split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={`/agent/clients/${clientId}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to client
        </Link>
      </div>

      {portfolioItem && (
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">{portfolioItem.customName} — Reports</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {clientInfo ? [clientInfo.firstName, clientInfo.lastName].filter(Boolean).join(" ") : "Client"} · {portfolioItem.portfolio?.name}
          </p>
        </div>
      )}

      {/* Latest snapshot */}
      {latestReport && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { label: "NAV", value: fmt(latestReport.netAssetValue), color: "text-blue-500" },
            { label: "Close Value", value: fmt(latestReport.totalCloseValue), color: "" },
            { label: "Cost Price", value: fmt(latestReport.totalCostPrice), color: "" },
            { label: "Gain/Loss", value: fmt(latestReport.totalLossGain), color: latestReport.totalLossGain >= 0 ? "text-green-600" : "text-red-500" },
            { label: "Return", value: `${latestReport.totalPercentage >= 0 ? "+" : ""}${latestReport.totalPercentage.toFixed(2)}%`, color: latestReport.totalPercentage >= 0 ? "text-green-600" : "text-red-500" },
            { label: "Fees", value: fmt(latestReport.totalFees), color: "text-amber-500" },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-slate-400">{m.label}</p>
                <p className={`text-base font-bold mt-0.5 ${m.color || "text-slate-800 dark:text-white"}`}>{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Report list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" /> Performance Reports
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? `Showing reports for ${new Date(selectedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                  : `${reports.length} reports · ${period}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <PeriodFilter value={period} onChange={(p) => { setPeriod(p); setSelectedDate(""); }} />
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); }}
                  className="w-40 text-xs h-8"
                  title="Filter by specific date"
                />
                {selectedDate && (
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => setSelectedDate("")}
                    className="h-8 w-8 p-0"
                    title="Clear date filter"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={() => fetchData(period, selectedDate || undefined)} disabled={loading} className="gap-1 h-8">
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <p className="px-4 py-8 text-center text-sm text-red-500">{error}</p>
          ) : reports.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              {selectedDate
                ? `No report found for ${new Date(selectedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. Reports are generated daily — select a date when a report was generated.`
                : "No reports found for this period."}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {reports.map((r) => {
                const pos = r.totalLossGain >= 0;
                const isGenerating = generatingPdf === r.id;
                return (
                  <div key={r.id} className="flex items-center gap-4 px-4 py-4 hover:bg-muted/10 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{fmtDate(r.reportDate)}</p>
                        <Badge variant="outline" className={`text-xs ${pos ? "border-green-400/40 text-green-500 bg-green-500/10" : "border-red-400/40 text-red-500 bg-red-500/10"}`}>
                          {pos ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {r.totalPercentage >= 0 ? "+" : ""}{r.totalPercentage.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-slate-500 flex-wrap">
                        <span>NAV: <span className="font-medium text-blue-500">{fmt(r.netAssetValue)}</span></span>
                        <span>Close: <span className="font-medium">{fmt(r.totalCloseValue)}</span></span>
                        <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>{fmt(r.totalLossGain)}</span>
                        <span>Fees: {fmt(r.totalFees)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleView(r)} disabled={isGenerating} className="gap-1.5 text-xs">
                        {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                        View PDF
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(r)} disabled={isGenerating} className="gap-1.5 text-xs">
                        {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
