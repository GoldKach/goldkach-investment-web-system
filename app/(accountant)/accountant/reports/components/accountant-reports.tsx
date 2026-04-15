"use client";

import { useState, useCallback } from "react";
import { Download, Eye, FileText, ChevronDown, ChevronUp, Loader2, RefreshCw, Calendar, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

interface Props {
  clientPortfolios: Array<{
    client: any;
    portfolios: any[];
    masterWallet: any;
  }>;
}

export function AccountantReports({ clientPortfolios }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reports, setReports] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  const togglePortfolio = useCallback(async (portfolioId: string) => {
    setExpanded((prev) => {
      const s = new Set(prev);
      if (s.has(portfolioId)) { s.delete(portfolioId); return s; }
      s.add(portfolioId);
      return s;
    });

    if (!reports[portfolioId]) {
      setLoading((prev) => new Set(prev).add(portfolioId));
      try {
        const dateParams = selectedDate
          ? {
              startDate: new Date(selectedDate + "T00:00:00.000Z").toISOString(),
              endDate:   new Date(selectedDate + "T23:59:59.999Z").toISOString(),
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
    }
  }, [reports, selectedDate]);

  const refreshPortfolio = async (portfolioId: string) => {
    setLoading((prev) => new Set(prev).add(portfolioId));
    try {
      const dateParams = selectedDate
        ? {
            startDate: new Date(selectedDate + "T00:00:00.000Z").toISOString(),
            endDate:   new Date(selectedDate + "T23:59:59.999Z").toISOString(),
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
  };

  const generatePDF = async (report: any, client: any, portfolio: any, masterWallet: any) => {
    setGeneratingPdf(report.id);
    try {
      const doc = new jsPDF("portrait");
      const logoImg = new Image();
      logoImg.src = "/logos/GoldKach-Logo-New-1.jpg";
      await new Promise((res) => { logoImg.onload = res; logoImg.onerror = res; });

      const addBorderAndLogo = async () => {
        doc.setDrawColor(25, 51, 136);
        doc.setLineWidth(4);
        doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, "S");
        try { doc.addImage(logoImg, "JPEG", 10, 10, 45, 35); } catch {}
      };

      await addBorderAndLogo();

      doc.setFillColor(25, 51, 136);
      doc.rect(70, 15, 130, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("GoldKach Performance Report", 135, 27, { align: "center" });
      doc.setTextColor(0, 0, 0);

      let y = 50;
      const clientName = [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email;
      const portfolioName = portfolio.portfolio?.name || portfolio.customName;
      const quarter = `Q${Math.floor(new Date(report.reportDate).getMonth() / 3) + 1} ${new Date(report.reportDate).getFullYear()}`;

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
        ["Account No:", masterWallet?.accountNumber ?? "—"],
        ["Reporting Period:", quarter],
        ["Report Date:", fmtDate(report.reportDate)],
      ].forEach(([label, value]) => {
        doc.setFont("helvetica", "bold"); doc.text(label, 20, y);
        doc.setFont("helvetica", "normal"); doc.text(value, 60, y);
        y += 6;
      });

      y += 5;
      doc.setFillColor(25, 51, 136);
      doc.rect(15, y, 90, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Performance Snapshot", 20, y + 7);
      doc.setTextColor(0, 0, 0);
      y += 15;

      const totalCosts = (report.totalCostPrice ?? 0) + (report.totalFees ?? 0);
      autoTable(doc, {
        startY: y,
        head: [["Metric", "Value"]],
        body: [
          ["Close Value",    fmt(report.totalCloseValue)],
          ["Cost Price",     fmt(report.totalCostPrice)],
          ["Total Fees",     fmt(report.totalFees)],
          ["Total Costs",    fmt(totalCosts)],
          ["Net Asset Value", fmt(report.netAssetValue)],
          ["Gain / Loss",    fmt(report.totalLossGain)],
          ["Return %",       `${report.totalPercentage >= 0 ? "+" : ""}${report.totalPercentage.toFixed(2)}%`],
        ],
        theme: "grid",
        headStyles: { fillColor: [25, 51, 136], textColor: [255, 255, 255], fontSize: 10 },
        bodyStyles: { fontSize: 10 },
        columnStyles: { 0: { halign: "left", cellWidth: 60 }, 1: { halign: "right", cellWidth: 60 } },
        margin: { left: 20 },
        tableWidth: 120,
        didParseCell: (data) => {
          if (data.row.index === 3 && data.section === "body") {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [255, 243, 205];
          }
        },
      });

      y = (doc as any).lastAutoTable.finalY + 10;

      // Deductions section
      doc.setFillColor(25, 51, 136);
      doc.rect(15, y, 90, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Deductions", 20, y + 7);
      doc.setTextColor(0, 0, 0);
      y += 15;

      autoTable(doc, {
        startY: y,
        head: [["Description", "Amount"]],
        body: [
          ["Bank Cost", fmt(report.bankCost ?? masterWallet?.bankFee ?? 0)],
          ["Transaction Cost", fmt(report.transactionCost ?? masterWallet?.transactionFee ?? 0)],
          ["Cash at Bank", fmt(report.cashAtBank ?? masterWallet?.feeAtBank ?? 0)],
          ["Total Deductions", fmt(report.totalFees ?? 0)],
        ],
        theme: "grid",
        headStyles: { fillColor: [25, 51, 136], textColor: [255, 255, 255], fontSize: 10 },
        bodyStyles: { fontSize: 10 },
        columnStyles: { 0: { halign: "left", cellWidth: 60 }, 1: { halign: "right", cellWidth: 60 } },
        margin: { left: 20 },
        tableWidth: 120,
        didParseCell: (data) => {
          if (data.row.index === 3 && data.section === "body") {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [230, 230, 230];
          }
        },
      });

      y = (doc as any).lastAutoTable.finalY + 10;

      // Asset holdings
      const assets = portfolio.assets ?? [];
      if (assets.length > 0) {
        doc.addPage();
        await addBorderAndLogo();
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
        const sub = assets.reduce((s: any, a: any) => ({
          costPrice: s.costPrice + a.costPrice,
          closeValue: s.closeValue + a.closeValue,
          lossGain: s.lossGain + a.lossGain,
        }), { costPrice: 0, closeValue: 0, lossGain: 0 });
        rows.push(["Sub Total", "", "", "", "", fmt(sub.costPrice), "", fmt(sub.closeValue), fmt(sub.lossGain)]);

        autoTable(doc, {
          startY: y,
          head: [["Symbol", "Description", "Stocks", "Alloc%", "Cost/Share", "Cost Price", "Close Price", "Close Value", "Gain/Loss"]],
          body: rows,
          theme: "grid",
          headStyles: { fillColor: [25, 51, 136], textColor: [255, 255, 255], fontSize: 7, fontStyle: "bold", halign: "center", cellPadding: 1.5 },
          bodyStyles: { fontSize: 7, cellPadding: 1.5 },
          columnStyles: {
            0: { cellWidth: 14, halign: "left" }, 1: { cellWidth: 28, halign: "left" },
            2: { cellWidth: 18, halign: "right" }, 3: { cellWidth: 16, halign: "center" },
            4: { cellWidth: 20, halign: "right" }, 5: { cellWidth: 24, halign: "right" },
            6: { cellWidth: 22, halign: "right" }, 7: { cellWidth: 22, halign: "right" },
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
      await addBorderAndLogo();
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

  const handleView = async (report: any, client: any, portfolio: any, masterWallet: any) => {
    const doc = await generatePDF(report, client, portfolio, masterWallet);
    window.open(URL.createObjectURL(doc.output("blob")), "_blank");
  };

  const handleDownload = async (report: any, client: any, portfolio: any, masterWallet: any) => {
    const doc = await generatePDF(report, client, portfolio, masterWallet);
    const name = [client.firstName, client.lastName].filter(Boolean).join("-") || "client";
    doc.save(`report-${name}-${report.reportDate.split("T")[0]}.pdf`);
  };

  const totalPortfolios = clientPortfolios.reduce((s, cp) => s + cp.portfolios.length, 0);

  return (
    <div className="space-y-6">
      {/* Date filter */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Filter by date:</span>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setReports({}); }}
              className="w-44 text-sm"
            />
            {selectedDate && (
              <Button size="sm" variant="ghost" onClick={() => { setSelectedDate(""); setReports({}); }} className="gap-1 text-xs">
                <X className="h-3.5 w-3.5" /> Clear
              </Button>
            )}
            <span className="text-xs text-slate-400 ml-auto">
              {clientPortfolios.length} clients · {totalPortfolios} portfolios
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Client list */}
      {clientPortfolios.map(({ client, portfolios, masterWallet }) => {
        const clientName = [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email;
        return (
          <Card key={client.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">{clientName}</CardTitle>
              <CardDescription className="text-xs">{client.email} · {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {portfolios.map((p) => {
                const isExpanded = expanded.has(p.id);
                const isLoading = loading.has(p.id);
                const portfolioReports = reports[p.id] ?? [];
                const isPos = p.totalLossGain >= 0;

                return (
                  <div key={p.id} className="rounded-lg border border-border/60 overflow-hidden">
                    <div
                      className="flex items-center gap-3 p-3 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => togglePortfolio(p.id)}
                    >
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{p.customName}</p>
                        <p className="text-[10px] text-muted-foreground">{p.portfolio?.name}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground">NAV: <span className="font-semibold text-blue-500">{fmt(p.wallet?.netAssetValue ?? 0)}</span></span>
                        <span className={`font-semibold ${isPos ? "text-green-600" : "text-red-500"}`}>
                          {p.returnPct >= 0 ? "+" : ""}{p.returnPct.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
                        {isExpanded && !isLoading && (
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                            onClick={(e) => { e.stopPropagation(); refreshPortfolio(p.id); }}>
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        )}
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border/60">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                          </div>
                        ) : portfolioReports.length === 0 ? (
                          <p className="px-4 py-4 text-xs text-muted-foreground italic">
                            {selectedDate
                              ? `No report found for ${new Date(selectedDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}.`
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
                                    <p className="text-xs font-semibold">{fmtDate(r.reportDate)}</p>
                                    <div className="flex gap-3 mt-0.5 text-[10px] text-muted-foreground flex-wrap">
                                      <span>NAV: <span className="text-blue-500 font-medium">{fmt(r.netAssetValue)}</span></span>
                                      <span>Close: <span className="font-medium">{fmt(r.totalCloseValue)}</span></span>
                                      <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>{fmt(r.totalLossGain)}</span>
                                      <span className={`font-medium ${pos ? "text-green-600" : "text-red-500"}`}>
                                        {r.totalPercentage >= 0 ? "+" : ""}{r.totalPercentage.toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <Button size="sm" variant="outline" onClick={() => handleView(r, client, p, masterWallet)} disabled={isGen} className="gap-1.5 text-xs h-7">
                                      {isGen ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                                      View
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDownload(r, client, p, masterWallet)} disabled={isGen} className="gap-1.5 text-xs h-7">
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
      })}
    </div>
  );
}
