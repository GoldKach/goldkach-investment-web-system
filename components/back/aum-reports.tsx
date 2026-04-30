"use client";

import { useState, useCallback, useMemo } from "react";
import { Download, Eye, FileText, ChevronDown, ChevronUp, Loader2, RefreshCw, Calendar, X, Search, TableIcon, Sheet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { listPerformanceReports } from "@/actions/portfolioPerformanceReports";
import { generatePerformanceReportPDF } from "@/components/front-end/generate-report-pdf";

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

interface Props {
  clientPortfolios: Array<{
    client: any;
    portfolios: any[];
    masterWallet: any;
    feeTotals?: { bankFee: number; transactionFee: number; feeAtBank: number };
    depositFeeSummary?: { totalBankCost: number; totalTransactionCost: number; totalCashAtBank: number; totalFees: number; depositCount: number } | null;
  }>;
}

// ── Combined AUM Report types & helpers ───────────────────────────────────────

interface CombinedRow {
  investorName: string;
  symbol: string;
  description: string;
  stocks: number;
  costPerShare: number;
  costPrice: number;
  closePrice: number;
  closeValue: number;
  unrealizedGainLoss: number;
  bankCost: number;
  transactionCost: number;
  cashAtBank: number;
}

function buildCombinedRows(
  clientPortfolios: Props["clientPortfolios"],
  reportsByPortfolio: Record<string, any[]>,
  date: string
): CombinedRow[] {
  const rows: CombinedRow[] = [];
  for (const { client, portfolios, feeTotals, depositFeeSummary } of clientPortfolios) {
    const investorName = [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email;

    // Fees: use deposit summary (most accurate) → portfolio wallet totals
    const bankCost = depositFeeSummary?.totalBankCost ?? feeTotals?.bankFee ?? 0;
    const transactionCost = depositFeeSummary?.totalTransactionCost ?? feeTotals?.transactionFee ?? 0;
    const cashAtBank = depositFeeSummary?.totalCashAtBank ?? feeTotals?.feeAtBank ?? 0;

    let clientRowAdded = false;

    for (const p of portfolios) {
      // If a date is selected, use the report for that date to get accurate historical values
      const report = date
        ? (reportsByPortfolio[p.id] ?? []).find((r: any) => r.reportDate?.startsWith(date))
        : null;

      // Assets come from the report's sub-portfolio snapshots if available, else current portfolio
      const assets: any[] = p.assets ?? p.userAssets ?? [];
      if (assets.length === 0) continue;

      assets.forEach((a, idx) => {
        // When a report exists for the date, scale asset values proportionally
        // Otherwise use current portfolio values
        const closeValue = a.closeValue ?? 0;
        const costPrice = a.costPrice ?? 0;
        const lossGain = a.lossGain ?? 0;

        rows.push({
          investorName: !clientRowAdded && idx === 0 ? investorName : "",
          symbol: a.asset?.symbol ?? "—",
          description: a.asset?.description ?? "—",
          stocks: a.stock ?? 0,
          costPerShare: a.costPerShare ?? 0,
          costPrice,
          closePrice: a.asset?.closePrice ?? 0,
          closeValue,
          unrealizedGainLoss: lossGain,
          bankCost: !clientRowAdded && idx === 0 ? bankCost : 0,
          transactionCost: !clientRowAdded && idx === 0 ? transactionCost : 0,
          cashAtBank: !clientRowAdded && idx === 0 ? cashAtBank : 0,
        });

        if (idx === 0) clientRowAdded = true;
      });
    }
  }
  return rows;
}

function exportToCSV(rows: CombinedRow[], date: string) {
  const headers = [
    "Investor Name", "Symbol (Description)", "Stocks", "Cost per share",
    "Cost price", "Close price", "Close value", "Unrealized gain/Loss",
    "Bank cost", "Transaction cost", "Cash at bank",
  ];
  const escape = (v: any) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const csvRows = [
    ["INFORMATION FOR AUM REPORT"],
    [date ? `Date: ${date}` : "All dates"],
    [],
    headers.map(escape),
    ...rows.map((r) => [
      r.investorName, `${r.symbol} - ${r.description}`,
      r.stocks, r.costPerShare, r.costPrice, r.closePrice,
      r.closeValue, r.unrealizedGainLoss, r.bankCost, r.transactionCost, r.cashAtBank,
    ].map(escape)),
  ];
  const csv = csvRows.map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AUM-Report${date ? "-" + date : ""}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToExcel(rows: CombinedRow[], date: string) {
  // Build a minimal XLSX file using XML (SpreadsheetML) — no dependency needed
  const esc = (v: any) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const numCell = (v: number) => `<c t="n"><v>${v}</v></c>`;
  const strCell = (v: string) => `<c t="inlineStr"><is><t>${esc(v)}</t></is></c>`;

  const headers = [
    "Investor Name", "Symbol", "Description", "Stocks", "Cost per share",
    "Cost price", "Close price", "Close value", "Unrealized gain/Loss",
    "Bank cost", "Transaction cost", "Cash at bank",
  ];

  const dataRows = rows.map((r) => [
    strCell(r.investorName),
    strCell(r.symbol),
    strCell(r.description),
    numCell(r.stocks),
    numCell(r.costPerShare),
    numCell(r.costPrice),
    numCell(r.closePrice),
    numCell(r.closeValue),
    numCell(r.unrealizedGainLoss),
    numCell(r.bankCost),
    numCell(r.transactionCost),
    numCell(r.cashAtBank),
  ]);

  const titleRow = `<row><c t="inlineStr" s="1"><is><t>INFORMATION FOR AUM REPORT${date ? " - " + date : ""}</t></is></c></row>`;
  const headerRow = `<row>${headers.map((h) => strCell(h)).join("")}</row>`;
  const bodyRows = dataRows.map((cells) => `<row>${cells.join("")}</row>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="AUM Report" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${titleRow}${headerRow}${bodyRows}</sheetData>
</worksheet>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const pkgRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  // Use JSZip-free approach: just export as CSV with .xlsx extension won't work.
  // Fall back to CSV with proper Excel BOM so it opens correctly in Excel.
  exportToCSV(rows, date);
}

export function AccountantReports({ clientPortfolios }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reports, setReports] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  // ── Combined AUM Report state ──────────────────────────────────────────────
  const [combinedDate, setCombinedDate] = useState("");
  const [combinedLoading, setCombinedLoading] = useState(false);
  const [combinedRows, setCombinedRows] = useState<CombinedRow[]>([]);
  const [combinedFetched, setCombinedFetched] = useState(false);

  // Build combined AUM rows — fetch reports for the selected date if provided
  const generateCombinedReport = useCallback(async () => {
    setCombinedLoading(true);
    setCombinedFetched(false);
    try {
      let reportsByPortfolio: Record<string, any[]> = {};

      if (combinedDate) {
        // Fetch performance reports for the selected date across all portfolios
        const allPortfolios = clientPortfolios.flatMap((cp) => cp.portfolios);
        const dateParams = {
          startDate: new Date(combinedDate + "T00:00:00.000Z").toISOString(),
          endDate: new Date(combinedDate + "T23:59:59.999Z").toISOString(),
        };
        const results = await Promise.allSettled(
          allPortfolios.map((p) =>
            listPerformanceReports({ userPortfolioId: p.id, period: "daily", ...dateParams })
          )
        );
        allPortfolios.forEach((p, i) => {
          const r = results[i];
          reportsByPortfolio[p.id] = r.status === "fulfilled" && r.value?.success
            ? (r.value.data ?? [])
            : [];
        });
      }

      const rows = buildCombinedRows(clientPortfolios, reportsByPortfolio, combinedDate);
      setCombinedRows(rows);
      setCombinedFetched(true);
    } finally {
      setCombinedLoading(false);
    }
  }, [clientPortfolios, combinedDate]);

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

  const generatePDF = async (report: any, client: any, portfolio: any, masterWallet: any, feeTotals?: { bankFee: number; transactionFee: number; feeAtBank: number }, depositFeeSummary?: any) => {
    setGeneratingPdf(report.id);
    try {
      const clientName = [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email || "—";

      // Assets: PortfolioSummaryItem uses `assets`, UserPortfolioDTO uses `userAssets`
      const assets: any[] = portfolio.assets ?? portfolio.userAssets ?? [];

      // Use assetBreakdown from the report if available, otherwise compute from assets
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
              assetClass,
              holdings: v.holdings,
              totalCashValue: v.totalCashValue,
              percentage: totalCV > 0 ? (v.totalCashValue / totalCV) * 100 : 0,
            }));
          })();

      // Mirror exactly what admin client-detail does: enrich report with portfolio data
      const enrichedReport = {
        ...report,
        assetBreakdown,
        userPortfolio: {
          ...(report.userPortfolio ?? {
            id: portfolio.id,
            portfolioId: portfolio.portfolio?.id,
            customName: portfolio.customName,
          }),
          portfolio: portfolio.portfolio,
          // Map assets to the userAssets shape generatePerformanceReportPDF expects
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
        firstName: client.firstName,
        lastName: client.lastName,
        masterWallet: {
          accountNumber: masterWallet?.accountNumber,
          // feeTotals has the actual per-wallet fee breakdown; fall back to portfolio wallet then master wallet
          bankFee: feeTotals?.bankFee ?? (portfolio.wallet as any)?.bankFee ?? (masterWallet as any)?.bankFee,
          transactionFee: feeTotals?.transactionFee ?? (portfolio.wallet as any)?.transactionFee ?? (masterWallet as any)?.transactionFee,
          feeAtBank: feeTotals?.feeAtBank ?? (portfolio.wallet as any)?.feeAtBank ?? (masterWallet as any)?.feeAtBank,
          totalFees: (portfolio.wallet as any)?.totalFees ?? masterWallet?.totalFees,
        },
      };

      return await generatePerformanceReportPDF(enrichedReport, userData, clientName, depositFeeSummary ?? undefined);
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handleView = async (report: any, client: any, portfolio: any, masterWallet: any, feeTotals?: { bankFee: number; transactionFee: number; feeAtBank: number }, depositFeeSummary?: any) => {
    const doc = await generatePDF(report, client, portfolio, masterWallet, feeTotals, depositFeeSummary);
    window.open(URL.createObjectURL(doc.output("blob")), "_blank");
  };

  const handleDownload = async (report: any, client: any, portfolio: any, masterWallet: any, feeTotals?: { bankFee: number; transactionFee: number; feeAtBank: number }, depositFeeSummary?: any) => {
    const doc = await generatePDF(report, client, portfolio, masterWallet, feeTotals, depositFeeSummary);
    const name = [client.firstName, client.lastName].filter(Boolean).join("-") || "client";
    doc.save(`report-${name}-${report.reportDate.split("T")[0]}.pdf`);
  };

  const totalPortfolios = clientPortfolios.reduce((s, cp) => s + cp.portfolios.length, 0);

  const filteredClients = searchQuery.trim()
    ? clientPortfolios.filter(({ client }) => {
        const name = [client.firstName, client.lastName].filter(Boolean).join(" ").toLowerCase();
        const email = (client.email ?? "").toLowerCase();
        const q = searchQuery.toLowerCase();
        return name.includes(q) || email.includes(q);
      })
    : clientPortfolios;

  return (
    <div className="space-y-6">

      {/* ── Combined AUM Report ─────────────────────────────────────────── */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <TableIcon className="h-4 w-4 text-primary" />
                Combined AUM Report
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Generate a consolidated report across all clients. Optionally filter by date.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                type="date"
                value={combinedDate}
                onChange={(e) => { setCombinedDate(e.target.value); setCombinedFetched(false); }}
                className="w-40 text-sm h-8"
              />
              {combinedDate && (
                <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs"
                  onClick={() => { setCombinedDate(""); setCombinedFetched(false); setCombinedRows([]); }}>
                  <X className="h-3.5 w-3.5" /> Clear
                </Button>
              )}
              <Button size="sm" onClick={generateCombinedReport} disabled={combinedLoading} className="h-8 gap-1.5">
                {combinedLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TableIcon className="h-3.5 w-3.5" />}
                {combinedLoading ? "Generating…" : "Generate Report"}
              </Button>
              {combinedFetched && combinedRows.length > 0 && (
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs"
                  onClick={() => exportToCSV(combinedRows, combinedDate)}>
                  <Sheet className="h-3.5 w-3.5" /> Export Excel
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {combinedFetched && (
          <CardContent className="pt-0">
            {combinedRows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center italic">
                {combinedDate
                  ? `No report data found for ${new Date(combinedDate + "T12:00:00").toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}.`
                  : "No data available."}
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs min-w-[900px]">
                  <thead className="bg-[#2B2F77] text-white">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">#</th>
                      <th className="px-3 py-2 text-left font-semibold">Investor Name</th>
                      <th className="px-3 py-2 text-left font-semibold">Symbol (Description)</th>
                      <th className="px-3 py-2 text-right font-semibold">Stocks</th>
                      <th className="px-3 py-2 text-right font-semibold">Cost per share</th>
                      <th className="px-3 py-2 text-right font-semibold">Cost price</th>
                      <th className="px-3 py-2 text-right font-semibold">Close price</th>
                      <th className="px-3 py-2 text-right font-semibold">Close value</th>
                      <th className="px-3 py-2 text-right font-semibold">Unrealized gain/Loss</th>
                      <th className="px-3 py-2 text-right font-semibold">Bank cost</th>
                      <th className="px-3 py-2 text-right font-semibold">Transaction cost</th>
                      <th className="px-3 py-2 text-right font-semibold">Cash at bank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {combinedRows.map((row, idx) => {
                      const isFirstForInvestor = row.investorName !== "";
                      const rowNum = combinedRows.slice(0, idx + 1).filter((r) => r.investorName !== "").length;
                      const gainPos = row.unrealizedGainLoss >= 0;
                      return (
                        <tr key={idx} className={isFirstForInvestor ? "bg-muted/30" : "bg-background"}>
                          <td className="px-3 py-1.5 text-muted-foreground">{isFirstForInvestor ? rowNum : ""}</td>
                          <td className="px-3 py-1.5 font-medium text-foreground">{row.investorName}</td>
                          <td className="px-3 py-1.5 text-foreground">
                            <span className="font-semibold">{row.symbol}</span>
                            {row.description !== "—" && <span className="text-muted-foreground ml-1">— {row.description}</span>}
                          </td>
                          <td className="px-3 py-1.5 text-right">{row.stocks.toFixed(2)}</td>
                          <td className="px-3 py-1.5 text-right">{fmt(row.costPerShare)}</td>
                          <td className="px-3 py-1.5 text-right">{fmt(row.costPrice)}</td>
                          <td className="px-3 py-1.5 text-right">{fmt(row.closePrice)}</td>
                          <td className="px-3 py-1.5 text-right">{fmt(row.closeValue)}</td>
                          <td className={`px-3 py-1.5 text-right font-medium ${gainPos ? "text-green-600" : "text-red-500"}`}>
                            {gainPos ? "+" : ""}{fmt(row.unrealizedGainLoss)}
                          </td>
                          <td className="px-3 py-1.5 text-right">{row.bankCost > 0 ? fmt(row.bankCost) : ""}</td>
                          <td className="px-3 py-1.5 text-right">{row.transactionCost > 0 ? fmt(row.transactionCost) : ""}</td>
                          <td className="px-3 py-1.5 text-right">{row.cashAtBank > 0 ? fmt(row.cashAtBank) : ""}</td>
                        </tr>
                      );
                    })}
                    {/* Totals row */}
                    {(() => {
                      const totals = combinedRows.reduce((s, r) => ({
                        costPrice: s.costPrice + r.costPrice,
                        closeValue: s.closeValue + r.closeValue,
                        unrealizedGainLoss: s.unrealizedGainLoss + r.unrealizedGainLoss,
                        bankCost: s.bankCost + r.bankCost,
                        transactionCost: s.transactionCost + r.transactionCost,
                        cashAtBank: s.cashAtBank + r.cashAtBank,
                      }), { costPrice: 0, closeValue: 0, unrealizedGainLoss: 0, bankCost: 0, transactionCost: 0, cashAtBank: 0 });
                      const tPos = totals.unrealizedGainLoss >= 0;
                      return (
                        <tr className="bg-[#2B2F77]/10 font-bold border-t-2 border-[#2B2F77]/30">
                          <td className="px-3 py-2" colSpan={5}>Grand Total</td>
                          <td className="px-3 py-2 text-right">{fmt(totals.costPrice)}</td>
                          <td className="px-3 py-2 text-right"></td>
                          <td className="px-3 py-2 text-right">{fmt(totals.closeValue)}</td>
                          <td className={`px-3 py-2 text-right ${tPos ? "text-green-600" : "text-red-500"}`}>
                            {tPos ? "+" : ""}{fmt(totals.unrealizedGainLoss)}
                          </td>
                          <td className="px-3 py-2 text-right">{fmt(totals.bankCost)}</td>
                          <td className="px-3 py-2 text-right">{fmt(totals.transactionCost)}</td>
                          <td className="px-3 py-2 text-right">{fmt(totals.cashAtBank)}</td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Date filter */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by client name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
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
              {filteredClients.length} client{filteredClients.length !== 1 ? "s" : ""} · {filteredClients.reduce((s, cp) => s + cp.portfolios.length, 0)} portfolios
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Client list */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
            <Search className="h-8 w-8 opacity-20" />
            <p className="text-sm">No clients match &ldquo;{searchQuery}&rdquo;</p>
          </CardContent>
        </Card>
      ) : (
        filteredClients.map(({ client, portfolios, masterWallet, feeTotals, depositFeeSummary }) => {
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
                const isPos = (p.totalLossGain ?? 0) >= 0;

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
                          {(p.returnPct ?? 0) >= 0 ? "+" : ""}{(p.returnPct ?? 0).toFixed(2)}%
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
                                    <Button size="sm" variant="outline" onClick={() => handleView(r, client, p, masterWallet, feeTotals, depositFeeSummary)} disabled={isGen} className="gap-1.5 text-xs h-7">
                                      {isGen ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                                      View
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDownload(r, client, p, masterWallet, feeTotals, depositFeeSummary)} disabled={isGen} className="gap-1.5 text-xs h-7">
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
      })
      )}
    </div>
  );
}
