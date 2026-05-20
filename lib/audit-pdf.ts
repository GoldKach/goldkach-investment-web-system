// Client-side only — do not import from server components or server actions
import type { AuditReportData } from "@/actions/audit-logs";

const NAIROBI_TZ = "Africa/Nairobi";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: NAIROBI_TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: NAIROBI_TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function usd(n: number) {
  return `$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function userName(u: { firstName: string; lastName: string | null } | null) {
  if (!u) return "—";
  return [u.firstName, u.lastName].filter(Boolean).join(" ");
}

function statusBadgeColor(status: string): [number, number, number] {
  switch (status.toUpperCase()) {
    case "APPROVED": return [22, 163, 74];
    case "REJECTED": return [220, 38, 38];
    case "PENDING":  return [202, 138, 4];
    case "REVERSED": return [234, 88, 12];
    default:         return [100, 116, 139];
  }
}

export interface PdfReportOptions {
  data: AuditReportData;
  startDate?: string;
  endDate?: string;
  generatedBy?: string;
  includeSections: {
    sessions: boolean;
    deposits: boolean;
    withdrawals: boolean;
  };
}

export async function generateAuditPdf(opts: PdfReportOptions): Promise<void> {
  // Dynamic import keeps jspdf out of SSR bundle
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();

  const GOLD   = [180, 140, 60]  as [number, number, number];
  const DARK   = [15, 23, 42]    as [number, number, number];
  const MID    = [51, 65, 85]    as [number, number, number];
  const LIGHT  = [241, 245, 249] as [number, number, number];
  const WHITE  = [255, 255, 255] as [number, number, number];

  const now = new Date().toLocaleString("en-GB", {
    timeZone: NAIROBI_TZ,
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const dateLabel =
    opts.startDate && opts.endDate
      ? `${fmtDate(opts.startDate)} – ${fmtDate(opts.endDate)}`
      : opts.startDate
      ? `From ${fmtDate(opts.startDate)}`
      : opts.endDate
      ? `Up to ${fmtDate(opts.endDate)}`
      : "All time";

  /* ── Helper: draw page header ─────────────────────────────────────────── */
  function drawPageHeader(title: string) {
    // Top bar
    doc.setFillColor(...DARK);
    doc.rect(0, 0, PW, 18, "F");

    // Gold accent line
    doc.setFillColor(...GOLD);
    doc.rect(0, 18, PW, 1.2, "F");

    // Logo / company name
    doc.setTextColor(...WHITE);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("GoldKach Investment", 10, 11);

    // Section title
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text(title, PW - 10, 11, { align: "right" });

    // Sub-header row
    doc.setFillColor(...LIGHT);
    doc.rect(0, 19.2, PW, 8, "F");
    doc.setTextColor(...MID);
    doc.setFontSize(7.5);
    doc.text(`Period: ${dateLabel}`, 10, 24.5);
    doc.text(`Generated: ${now} (EAT)`, PW / 2, 24.5, { align: "center" });
    if (opts.generatedBy) {
      doc.text(`By: ${opts.generatedBy}`, PW - 10, 24.5, { align: "right" });
    }
  }

  /* ── Helper: draw page footer ─────────────────────────────────────────── */
  function drawFooters() {
    const total = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setFillColor(...DARK);
      doc.rect(0, PH - 8, PW, 8, "F");
      doc.setFontSize(6.5);
      doc.setTextColor(150, 150, 150);
      doc.text("CONFIDENTIAL — For authorised use only", 10, PH - 3.5);
      doc.text(`Page ${i} of ${total}`, PW - 10, PH - 3.5, { align: "right" });
    }
  }

  /* ── Cover Page ─────────────────────────────────────────────────────────── */
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PW, PH, "F");

  // Gold diagonal accent
  doc.setFillColor(...GOLD);
  doc.triangle(0, PH * 0.6, PW * 0.45, PH, 0, PH, "F");

  // Company name
  doc.setTextColor(...GOLD);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("GoldKach", PW / 2, 60, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...WHITE);
  doc.text("Investment Management", PW / 2, 72, { align: "center" });

  // Report title
  doc.setFillColor(...GOLD);
  doc.rect(PW / 2 - 60, 85, 120, 0.7, "F");
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("AUDIT REPORT", PW / 2, 100, { align: "center" });
  doc.setFillColor(...GOLD);
  doc.rect(PW / 2 - 60, 104, 120, 0.7, "F");

  // Metadata box
  doc.setFillColor(255, 255, 255, 0.08);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(PW / 2 - 70, 115, 140, 52, 3, 3, "D");

  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  const meta = [
    ["Period",       dateLabel],
    ["Generated",    `${now} (EAT)`],
    ["Prepared by",  opts.generatedBy ?? "Admin"],
    ["Sections",     [
      opts.includeSections.sessions     ? "Login Sessions" : null,
      opts.includeSections.deposits     ? "Deposits"       : null,
      opts.includeSections.withdrawals  ? "Withdrawals"    : null,
    ].filter(Boolean).join(", ")],
  ];
  let my = 126;
  for (const [label, value] of meta) {
    doc.setTextColor(...GOLD);
    doc.text(`${label}:`, PW / 2 - 62, my);
    doc.setTextColor(...WHITE);
    doc.text(String(value), PW / 2 - 30, my);
    my += 9;
  }

  // Counts
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  const counts = [
    opts.includeSections.sessions    ? `${opts.data.loginSessions.length} sessions`    : null,
    opts.includeSections.deposits    ? `${opts.data.deposits.length} deposits`          : null,
    opts.includeSections.withdrawals ? `${opts.data.withdrawals.length} withdrawals`   : null,
  ].filter(Boolean).join("   ·   ");
  doc.text(counts, PW / 2, 178, { align: "center" });

  /* ── Section 1: Login Sessions ──────────────────────────────────────────── */
  if (opts.includeSections.sessions && opts.data.loginSessions.length > 0) {
    doc.addPage();
    drawPageHeader("Login Sessions");

    const rows = opts.data.loginSessions.map((s) => [
      userName(s.user),
      s.user?.email ?? "—",
      s.user?.role ?? "—",
      fmt(s.createdAt),
      fmt(s.expiresAt),
      s.revoked ? "Revoked" : "Active",
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["User", "Email", "Role", "Login Time (EAT)", "Expires (EAT)", "Status"]],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: DARK,
        textColor: GOLD,
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: 3,
      },
      bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: MID },
      alternateRowStyles: { fillColor: [248, 250, 252] as [number, number, number] },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 52 },
        2: { cellWidth: 28 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 22 },
      },
      margin: { left: 10, right: 10 },
      didParseCell(data) {
        if (data.section === "body" && data.column.index === 5) {
          const val = String(data.cell.raw ?? "");
          const [r, g, b] = val === "Active" ? [22, 163, 74] : [220, 38, 38];
          data.cell.styles.textColor = [r, g, b];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });
  }

  /* ── Section 2: Deposits ────────────────────────────────────────────────── */
  if (opts.includeSections.deposits && opts.data.deposits.length > 0) {
    doc.addPage();
    drawPageHeader("Deposits");

    const rows = opts.data.deposits.map((d) => [
      userName(d.user),
      d.user?.email ?? "—",
      usd(d.amount),
      d.depositTarget === "ALLOCATION" ? "Allocation" : "Master Deposit",
      d.transactionStatus,
      d.method ?? "—",
      d.approvedByName ?? d.rejectedByName ?? d.createdByName ?? "—",
      d.approvedAt
        ? fmt(d.approvedAt)
        : d.rejectedAt
        ? fmt(d.rejectedAt)
        : fmt(d.createdAt),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Client", "Email", "Amount", "Type", "Status", "Method", "Actioned By", "Date (EAT)"]],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: DARK,
        textColor: GOLD,
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: 3,
      },
      bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: MID },
      alternateRowStyles: { fillColor: [248, 250, 252] as [number, number, number] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 48 },
        2: { cellWidth: 28, halign: "right" },
        3: { cellWidth: 32 },
        4: { cellWidth: 22 },
        5: { cellWidth: 22 },
        6: { cellWidth: 35 },
        7: { cellWidth: 40 },
      },
      margin: { left: 10, right: 10 },
      didParseCell(data) {
        if (data.section === "body" && data.column.index === 4) {
          const [r, g, b] = statusBadgeColor(String(data.cell.raw ?? ""));
          data.cell.styles.textColor = [r, g, b];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    // Totals footer
    const total = opts.data.deposits.reduce((s, d) => s + d.amount, 0);
    const approved = opts.data.deposits.filter((d) => d.transactionStatus === "APPROVED");
    const approvedTotal = approved.reduce((s, d) => s + d.amount, 0);
    const lastY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(
      `Total: ${usd(total)}   Approved: ${approved.length} (${usd(approvedTotal)})   Pending: ${opts.data.deposits.filter((d) => d.transactionStatus === "PENDING").length}   Rejected: ${opts.data.deposits.filter((d) => d.transactionStatus === "REJECTED").length}`,
      10,
      lastY + 6
    );
  }

  /* ── Section 3: Withdrawals ─────────────────────────────────────────────── */
  if (opts.includeSections.withdrawals && opts.data.withdrawals.length > 0) {
    doc.addPage();
    drawPageHeader("Withdrawals & Redemptions");

    const rows = opts.data.withdrawals.map((w) => [
      userName(w.user),
      w.user?.email ?? "—",
      usd(w.amount),
      w.withdrawalType === "REDEMPTION" ? "Redemption" : "Cash Out",
      w.transactionStatus,
      w.bankName || "—",
      w.approvedByName ?? w.rejectedByName ?? w.createdByName ?? "—",
      w.approvedAt
        ? fmt(w.approvedAt)
        : w.rejectedAt
        ? fmt(w.rejectedAt)
        : fmt(w.createdAt),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Client", "Email", "Amount", "Type", "Status", "Bank", "Actioned By", "Date (EAT)"]],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: DARK,
        textColor: GOLD,
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: 3,
      },
      bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: MID },
      alternateRowStyles: { fillColor: [248, 250, 252] as [number, number, number] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 48 },
        2: { cellWidth: 28, halign: "right" },
        3: { cellWidth: 28 },
        4: { cellWidth: 22 },
        5: { cellWidth: 28 },
        6: { cellWidth: 35 },
        7: { cellWidth: 38 },
      },
      margin: { left: 10, right: 10 },
      didParseCell(data) {
        if (data.section === "body" && data.column.index === 4) {
          const [r, g, b] = statusBadgeColor(String(data.cell.raw ?? ""));
          data.cell.styles.textColor = [r, g, b];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    // Totals footer
    const total = opts.data.withdrawals.reduce((s, w) => s + w.amount, 0);
    const approved = opts.data.withdrawals.filter((w) => w.transactionStatus === "APPROVED");
    const approvedTotal = approved.reduce((s, w) => s + w.amount, 0);
    const lastY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(
      `Total: ${usd(total)}   Approved: ${approved.length} (${usd(approvedTotal)})   Pending: ${opts.data.withdrawals.filter((w) => w.transactionStatus === "PENDING").length}   Rejected: ${opts.data.withdrawals.filter((w) => w.transactionStatus === "REJECTED").length}`,
      10,
      lastY + 6
    );
  }

  drawFooters();

  const filename = `goldkach-audit-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
