"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Client = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  status?: string | null;
  isApproved?: boolean | null;
  masterWallet?: { accountNumber?: string | null } | null;
  individualOnboarding?: {
    homeAddress?: string | null;
    nationality?: string | null;
    fullName?: string | null;
  } | null;
  companyOnboarding?: {
    companyAddress?: string | null;
    companyName?: string | null;
  } | null;
};

function displayName(u: Client) {
  return u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "—";
}

function getAddress(u: Client) {
  return (
    u.individualOnboarding?.homeAddress ||
    u.companyOnboarding?.companyAddress ||
    "—"
  );
}

function downloadContactsPDF(clients: Client[]) {
  // Use jsPDF-style manual PDF generation via browser print
  // Build an HTML table and trigger print-to-PDF
  const rows = clients.map((u, i) => `
    <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"}">
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${i + 1}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${displayName(u)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${u.email || "—"}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${u.phone || "—"}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${getAddress(u)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${u.masterWallet?.accountNumber || "—"}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
        <span style="
          display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;
          background:${u.status === "ACTIVE" ? "#d1fae5" : "#f3f4f6"};
          color:${u.status === "ACTIVE" ? "#065f46" : "#6b7280"};
        ">${u.status || "—"}</span>
      </td>
    </tr>
  `).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>GoldKach — Client Contact List</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #111827; padding: 24px; }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; }
        .header h1 { font-size: 18px; font-weight: 700; color: #1e3a8a; }
        .header p { font-size: 11px; color: #6b7280; margin-top: 2px; }
        .meta { font-size: 11px; color: #6b7280; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        thead tr { background: #1e3a8a; color: white; }
        thead th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        tbody tr:hover { background: #eff6ff; }
        @media print {
          body { padding: 12px; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>GoldKach Investment</h1>
          <p>Client Contact Directory</p>
        </div>
        <div class="meta">
          <p>Total Clients: <strong>${clients.length}</strong></p>
          <p>Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Account No.</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;

  const win = window.open("", "_blank", "width=1100,height=800");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

export function ClientsContactTable({
  clients,
  basePath = "/dashboard/users/clients",
}: {
  clients: Client[];
  basePath?: string;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = clients.filter((u) => {
    const q = query.toLowerCase();
    return (
      displayName(u).toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.phone ?? "").includes(query) ||
      getAddress(u).toLowerCase().includes(q)
    );
  });

  const active  = clients.filter((u) => u.status === "ACTIVE").length;
  const pending = clients.filter((u) => u.status === "PENDING").length;
  const inactive = clients.filter((u) => u.status !== "ACTIVE" && u.status !== "PENDING").length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Clients</h1>
          <p className="text-sm text-slate-400 mt-1">All registered investment clients</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => downloadContactsPDF(filtered)}
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Clients", value: clients.length, color: "text-blue-500" },
          { label: "Active",        value: active,          color: "text-green-500" },
          { label: "Pending",       value: pending,         color: "text-amber-500" },
          { label: "Inactive",      value: inactive,        color: "text-slate-400" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search by name, email, phone or address…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {clients.length} clients
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-[#2B2F77]/30 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 dark:bg-[#2B2F77]/10 text-xs text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2.5 text-left">#</th>
              <th className="px-3 py-2.5 text-left">Client</th>
              <th className="px-3 py-2.5 text-left">Email</th>
              <th className="px-3 py-2.5 text-left">Phone</th>
              <th className="px-3 py-2.5 text-left">Address</th>
              <th className="px-3 py-2.5 text-left">Account No.</th>
              <th className="px-3 py-2.5 text-left">Status</th>
              <th className="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2B2F77]/20">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  No clients found.
                </td>
              </tr>
            ) : (
              filtered.map((u, idx) => {
                const name    = displayName(u);
                const address = getAddress(u);
                const initials = name.slice(0, 2).toUpperCase();
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#2B2F77]/10 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{idx + 1}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 rounded-lg shrink-0">
                          <AvatarImage src={u.imageUrl || ""} alt={name} />
                          <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-[10px] font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100 text-xs">{name}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">
                            {u.masterWallet?.accountNumber || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300 text-xs">{u.email || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs">{u.phone || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs max-w-[200px]">
                      <span className="truncate block" title={address}>{address}</span>
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono text-slate-500">
                      {u.masterWallet?.accountNumber || "—"}
                    </td>
                    <td className="px-3 py-2.5">
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
                    <td className="px-3 py-2.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-[10px] h-7 px-2"
                        onClick={() => router.push(`${basePath}/${u.id}`)}
                      >
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
