"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, CheckCircle, XCircle, Download, FileDown, Wallet, ArrowUpDown, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadKycPdf, downloadBulkKycPdf } from "@/lib/generate-kyc-pdf";

function getAddress(u: any) {
  return (
    u.individualOnboarding?.homeAddress ||
    u.companyOnboarding?.companyAddress ||
    "—"
  );
}

function downloadContactsPDF(clients: any[], displayName: (u: any) => string) {
  const rows = clients.map((u, i) => `
    <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"}">
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${i + 1}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${displayName(u)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${u.email || "—"}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${u.phone || "—"}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${getAddress(u)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${u.masterWallet?.accountNumber || "—"}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>GoldKach — Client Contact List</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif;font-size:12px;color:#111827;padding:24px}
      .header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;border-bottom:2px solid #1e3a8a;padding-bottom:12px}
      .header h1{font-size:18px;font-weight:700;color:#1e3a8a}
      .header p{font-size:11px;color:#6b7280;margin-top:2px}
      .meta{font-size:11px;color:#6b7280;text-align:right}
      table{width:100%;border-collapse:collapse;margin-top:8px}
      thead tr{background:#1e3a8a;color:white}
      thead th{padding:10px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
    </style></head><body>
    <div class="header">
      <div><h1>GoldKach Investment</h1><p>Client Contact Directory</p></div>
      <div class="meta"><p>Total: <strong>${clients.length}</strong></p><p>${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</p></div>
    </div>
    <table><thead><tr><th>#</th><th>Client Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Account No.</th></tr></thead>
    <tbody>${rows}</tbody></table></body></html>`;

  const win = window.open("", "_blank", "width=1100,height=800");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

export function CRClientsTable({ clients, basePath = "/cr/clients" }: { clients: any[]; basePath?: string }) {
  const [query, setQuery] = useState("");
  const [contactQuery, setContactQuery] = useState("");
  const router = useRouter();

  const displayName = (u: any) =>
    u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;

  const filtered = clients.filter((u) => {
    const q = query.toLowerCase();
    return (
      displayName(u).toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.phone ?? "").includes(query) ||
      (u.masterWallet?.accountNumber ?? "").toLowerCase().includes(q)
    );
  });

  const filteredContact = clients.filter((u) => {
    const q = contactQuery.toLowerCase();
    return (
      displayName(u).toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.phone ?? "").includes(contactQuery) ||
      getAddress(u).toLowerCase().includes(q)
    );
  });

  const active = clients.filter((u) => u.status === "ACTIVE").length;
  const pending = clients.filter((u) => u.status === "PENDING").length;
  const inactive = clients.filter(
    (u) => u.status !== "ACTIVE" && u.status !== "PENDING"
  ).length;

  const noPortfolio = clients.filter((u) => (u.userPortfolios?.length ?? 0) === 0);

  // Clients with uninvested cash sitting in master wallet (pending allocation)
  const pendingAllocation = clients
    .filter((u) => Number(u.masterWallet?.balance ?? 0) > 0)
    .sort((a, b) => Number(b.masterWallet?.balance ?? 0) - Number(a.masterWallet?.balance ?? 0));

  const fmt$ = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Clients</h1>
          <p className="text-sm text-slate-400 mt-1">All registered investment clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => downloadBulkKycPdf(clients)}
            title="Download KYC for all clients"
          >
            <FileDown className="h-4 w-4" />
            All KYC PDF
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Clients", value: clients.length, color: "text-blue-500" },
          { label: "Active", value: active, color: "text-green-500" },
          { label: "Pending", value: pending, color: "text-amber-500" },
          { label: "Inactive", value: inactive, color: "text-slate-400" },
          { label: "Pending Allocations", value: pendingAllocation.length, color: "text-amber-400" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="noportfolio">No Portfolio ({noPortfolio.length})</TabsTrigger>
          <TabsTrigger value="pending-allocation" className="gap-1.5">
            <Wallet className="h-3.5 w-3.5" />
            Pending Allocations
            {pendingAllocation.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 leading-none">
                {pendingAllocation.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        {/* ── Clients tab ── */}
        <TabsContent value="clients" className="space-y-4 mt-4">
          {/* Search + filtered KYC download */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by name, email, phone or account number…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>
            <span className="text-xs text-muted-foreground">{filtered.length} clients</span>
            {query && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 ml-auto"
                onClick={() => downloadBulkKycPdf(filtered)}
                title="Download KYC for current search results"
              >
                <FileDown className="h-4 w-4" />
                KYC PDF ({filtered.length})
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2 text-left">Client</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Approved</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => {
                    const name = displayName(u);
                    const initials = name.slice(0, 2).toUpperCase();
                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 rounded-lg shrink-0">
                              <AvatarImage src={u.imageUrl || ""} alt={name} />
                              <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-[10px] font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-100 text-xs">{name}</p>
                              <p className="text-[9px] text-muted-foreground font-mono">{u.masterWallet?.accountNumber || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-300 text-xs">{u.email}</td>
                        <td className="px-3 py-2 text-slate-500 text-xs">{u.phone || "—"}</td>
                        <td className="px-3 py-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              u.status === "ACTIVE"
                                ? "border-green-300 text-green-700 dark:text-green-400"
                                : u.status === "PENDING"
                                ? "border-amber-300 text-amber-600"
                                : "border-slate-300 text-slate-500"
                            }`}
                          >
                            {u.status || "—"}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          {u.isApproved ? (
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-[10px] h-7 px-2 text-slate-500 hover:text-slate-800"
                              onClick={() => downloadKycPdf(u)}
                              title="Download KYC PDF"
                            >
                              <FileDown className="h-3 w-3" /> KYC
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-[10px] h-7 px-2"
                              onClick={() => router.push(`${basePath}/${u.id}`)}
                            >
                              <Eye className="h-3 w-3" /> View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ── No Portfolio tab ── */}
        <TabsContent value="noportfolio" className="space-y-4 mt-4">
          <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2 text-left">Client</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Approved</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {noPortfolio.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                      All clients have portfolios.
                    </td>
                  </tr>
                ) : (
                  noPortfolio.map((u) => {
                    const name = displayName(u);
                    const initials = name.slice(0, 2).toUpperCase();
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 rounded-lg shrink-0">
                              <AvatarImage src={u.imageUrl || ""} alt={name} />
                              <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-[10px] font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-100 text-xs">{name}</p>
                              <p className="text-[9px] text-muted-foreground font-mono">{u.masterWallet?.accountNumber || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-300 text-xs">{u.email}</td>
                        <td className="px-3 py-2 text-slate-500 text-xs">{u.phone || "—"}</td>
                        <td className="px-3 py-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              u.status === "ACTIVE"
                                ? "border-green-300 text-green-700 dark:text-green-400"
                                : u.status === "PENDING"
                                ? "border-amber-300 text-amber-600"
                                : "border-slate-300 text-slate-500"
                            }`}
                          >
                            {u.status || "—"}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          {u.isApproved ? (
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-[10px] h-7 px-2 text-slate-500 hover:text-slate-800"
                              onClick={() => downloadKycPdf(u)}
                              title="Download KYC PDF"
                            >
                              <FileDown className="h-3 w-3" /> KYC
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-[10px] h-7 px-2"
                              onClick={() => router.push(`${basePath}/${u.id}`)}
                            >
                              <Eye className="h-3 w-3" /> View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ── Pending Allocations tab ── */}
        <TabsContent value="pending-allocation" className="space-y-4 mt-4">
          {pendingAllocation.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground rounded-xl border border-dashed border-slate-200 dark:border-[#2B2F77]/30">
              <Wallet className="h-10 w-10 opacity-20" />
              <p className="text-sm font-medium">No clients with uninvested funds</p>
              <p className="text-xs opacity-70">All master wallet balances are $0.00</p>
            </div>
          ) : (
            <>
              {/* Summary banner */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-500">
                    {pendingAllocation.length} client{pendingAllocation.length !== 1 ? "s" : ""} with uninvested funds
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Total pending:{" "}
                    <span className="font-semibold text-amber-400">
                      {fmt$(pendingAllocation.reduce((s, u) => s + Number(u.masterWallet?.balance ?? 0), 0))}
                    </span>
                    {" "}— funds deposited but not yet allocated to a portfolio
                  </p>
                </div>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">Sorted by balance</span>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
                <table className="w-full text-sm min-w-[820px]">
                  <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Account No.</th>
                      <th className="px-4 py-3 text-right">
                        <span className="flex items-center justify-end gap-1">
                          <Wallet className="h-3 w-3" /> Uninvested Balance
                        </span>
                      </th>
                      <th className="px-4 py-3 text-right">Total Deposited</th>
                      <th className="px-4 py-3 text-center">Portfolios</th>
                      <th className="px-4 py-3 text-left">Contact</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                    {pendingAllocation.map((u, idx) => {
                      const name = displayName(u);
                      const balance = Number(u.masterWallet?.balance ?? 0);
                      const totalDeposited = Number(u.masterWallet?.totalDeposited ?? 0);
                      const portfolioCount = u.userPortfolios?.length ?? 0;

                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-amber-50/40 dark:hover:bg-amber-500/5 transition-colors"
                        >
                          {/* # */}
                          <td className="px-4 py-3 text-xs text-muted-foreground">{idx + 1}</td>

                          {/* Client */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                                <AvatarImage src={u.imageUrl || ""} alt={name} />
                                <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-[10px] font-bold">
                                  {name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 text-xs truncate">{name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Account No */}
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono text-muted-foreground">
                              {u.masterWallet?.accountNumber || "—"}
                            </span>
                          </td>

                          {/* Uninvested Balance — highlighted */}
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex flex-col items-end">
                              <span className="text-sm font-bold text-amber-500">{fmt$(balance)}</span>
                              {totalDeposited > 0 && (
                                <span className="text-[10px] text-muted-foreground">
                                  {((balance / totalDeposited) * 100).toFixed(1)}% of total deposits
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Total Deposited */}
                          <td className="px-4 py-3 text-right">
                            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                              {fmt$(totalDeposited)}
                            </span>
                          </td>

                          {/* Portfolio count */}
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                              portfolioCount === 0
                                ? "bg-red-500/10 text-red-400"
                                : "bg-blue-500/10 text-blue-400"
                            }`}>
                              {portfolioCount}
                            </span>
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3">
                            <span className="text-xs text-muted-foreground">{u.phone || "—"}</span>
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3 text-right">
                            <Button
                              size="sm"
                              className="gap-1.5 text-[10px] h-7 px-3 bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border border-amber-500/30"
                              variant="outline"
                              onClick={() => router.push(`${basePath}/${u.id}`)}
                            >
                              <Eye className="h-3 w-3" /> Allocate
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search by name, email, phone or address…"
                value={contactQuery}
                onChange={(e) => setContactQuery(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>
            <span className="text-xs text-muted-foreground">{filteredContact.length} clients</span>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 ml-auto"
              onClick={() => downloadContactsPDF(filteredContact, displayName)}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Client Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Address</th>
                  <th className="px-3 py-2 text-left">Account No.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
                {filteredContact.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  filteredContact.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors">
                      <td className="px-3 py-2 text-xs text-muted-foreground">{idx + 1}</td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-slate-800 dark:text-slate-100 text-xs">{displayName(u)}</p>
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300 text-xs">{u.email || "—"}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs">{u.phone || "—"}</td>
                      <td className="px-3 py-2 text-slate-500 text-xs max-w-[220px]">
                        <span className="truncate block" title={getAddress(u)}>{getAddress(u)}</span>
                      </td>
                      <td className="px-3 py-2 text-xs font-mono text-slate-500">
                        {u.masterWallet?.accountNumber || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
