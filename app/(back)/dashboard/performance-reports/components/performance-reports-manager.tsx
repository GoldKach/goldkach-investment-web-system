"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { BarChart2, Play, Zap, CheckCircle, XCircle, Loader2, Calendar } from "lucide-react";
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

interface Portfolio {
  id: string;
  customName: string;
  portfolio: { name: string };
  latestReport?: { reportDate: string } | null;
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

interface PortfolioState {
  status: ReportStatus;
  message?: string;
}

export function PerformanceReportsManager({ clientPortfolios, adminId, adminName }: Props) {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [portfolioStates, setPortfolioStates] = useState<Record<string, PortfolioState>>({});
  const [clientStates, setClientStates] = useState<Record<string, ReportStatus>>({});
  const [isBulkGenerating, startBulkTransition] = useTransition();
  const [bulkResult, setBulkResult] = useState<{ success: number; failed: number; total: number } | null>(null);

  const setPortfolioStatus = (portfolioId: string, state: PortfolioState) => {
    setPortfolioStates((prev) => ({ ...prev, [portfolioId]: state }));
  };

  const setClientStatus = (clientId: string, status: ReportStatus) => {
    setClientStates((prev) => ({ ...prev, [clientId]: status }));
  };

  // Generate report for a single portfolio
  const handleSingleReport = async (portfolioId: string, portfolioName: string) => {
    setPortfolioStatus(portfolioId, { status: "generating" });
    const res = await generatePerformanceReport({
      userPortfolioId: portfolioId,
      reportDate: reportDate || undefined,
    });
    if (res.success) {
      setPortfolioStatus(portfolioId, { status: "success", message: `Report generated for ${new Date(reportDate).toLocaleDateString()}` });
      toast.success(`Report generated for ${portfolioName}`);
    } else {
      setPortfolioStatus(portfolioId, { status: "error", message: res.error });
      toast.error(`Failed: ${res.error}`);
    }
  };

  // Generate all reports for a single client
  const handleClientReport = async (clientId: string, clientName: string) => {
    setClientStatus(clientId, "generating");
    const res = await generateUserPerformanceReports(clientId, reportDate || undefined);
    if (res.success) {
      setClientStatus(clientId, "success");
      toast.success(`Reports generated for ${clientName} — ${res.data?.success ?? 0} portfolios`);
    } else {
      setClientStatus(clientId, "error");
      toast.error(`Failed for ${clientName}: ${res.error}`);
    }
  };

  // Generate all reports for all portfolios
  const handleBulkGenerate = () => {
    setBulkResult(null);
    startBulkTransition(async () => {
      const res = await generateAllPerformanceReports();
      if (res.success && res.data) {
        setBulkResult(res.data);
        toast.success(`Bulk generation complete — ${res.data.success}/${res.data.total} succeeded`);
      } else {
        toast.error(res.error || "Bulk generation failed.");
      }
    });
  };

  const totalPortfolios = clientPortfolios.reduce((s, cp) => s + cp.portfolios.length, 0);

  return (
    <div className="space-y-6">
      {/* Report Date + Bulk Generate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Bulk Report Generation
          </CardTitle>
          <CardDescription>
            Generate performance reports for all {totalPortfolios} portfolios across {clientPortfolios.length} clients at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-1.5">
              <Label htmlFor="reportDate" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Report Date
              </Label>
              <Input
                id="reportDate"
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-48"
              />
            </div>
            <Button
              onClick={handleBulkGenerate}
              disabled={isBulkGenerating}
              className="gap-2"
            >
              {isBulkGenerating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating All…</>
              ) : (
                <><Zap className="h-4 w-4" /> Generate All Reports</>
              )}
            </Button>
          </div>

          {bulkResult && (
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              <span>
                <span className="font-semibold text-green-500">{bulkResult.success}</span> succeeded,{" "}
                <span className={`font-semibold ${bulkResult.failed > 0 ? "text-red-500" : "text-muted-foreground"}`}>{bulkResult.failed}</span> failed
                {" "}out of <span className="font-semibold">{bulkResult.total}</span> total
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-client report generation */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Individual Client Reports
        </h2>

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
                      size="sm"
                      variant="outline"
                      onClick={() => handleClientReport(client.id, clientName)}
                      disabled={clientStatus === "generating"}
                      className="gap-1.5 text-xs"
                    >
                      {clientStatus === "generating" ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                      ) : clientStatus === "success" ? (
                        <><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Generated</>
                      ) : clientStatus === "error" ? (
                        <><XCircle className="h-3.5 w-3.5 text-red-500" /> Retry All</>
                      ) : (
                        <><Play className="h-3.5 w-3.5" /> Generate All</>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {portfolios.map((p) => {
                      const pState = portfolioStates[p.id] ?? { status: "idle" };
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/20 border border-border/50"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <BarChart2 className="h-4 w-4 text-slate-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{p.customName}</p>
                              <p className="text-[10px] text-muted-foreground">{p.portfolio?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {p.latestReport && (
                              <span className="text-[10px] text-muted-foreground">
                                Last: {new Date(p.latestReport.reportDate).toLocaleDateString()}
                              </span>
                            )}
                            {pState.status === "success" && (
                              <Badge variant="outline" className="text-[10px] border-green-400/40 text-green-500 bg-green-500/10">
                                <CheckCircle className="h-2.5 w-2.5 mr-1" /> Done
                              </Badge>
                            )}
                            {pState.status === "error" && (
                              <Badge variant="outline" className="text-[10px] border-red-400/40 text-red-500 bg-red-500/10">
                                <XCircle className="h-2.5 w-2.5 mr-1" /> Failed
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSingleReport(p.id, p.customName)}
                              disabled={pState.status === "generating"}
                              className="h-7 px-2 text-xs gap-1"
                            >
                              {pState.status === "generating" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <><Play className="h-3 w-3" /> Generate</>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
