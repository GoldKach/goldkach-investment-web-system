"use client"

import { forwardRef } from "react"
import { type Deposit } from "@/actions/deposits"

interface DepositReceiptProps {
  deposit:    Deposit
  staffName?: string
  id?:        string
}

// This component renders the printable/PDF receipt.
// It uses inline styles so html2canvas/jspdf can capture it correctly.
export const DepositReceipt = forwardRef<HTMLDivElement, DepositReceiptProps>(
  ({ deposit, staffName, id }, ref) => {
    const clientName =
      [deposit.user?.firstName, deposit.user?.lastName].filter(Boolean).join(" ") ||
      deposit.user?.email ||
      "N/A"

    const fmt = (v?: number | null) =>
      v != null ? `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "N/A"

    const fmtDate = (d?: string | null) =>
      d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "N/A"

    const maskAccount = (acc?: string | null) => {
      if (!acc) return "N/A";
      if (acc.length <= 3) return acc;
      return "x".repeat(acc.length - 3) + acc.slice(-3);
    }

    const methodLabel: Record<string, string> = {
      BANK_TRANSFER: "Bank Transfer",
      CASH:          "Cash Deposit",
      CHEQUE:        "Cheque",
      OTHER:         "Other",
    }

    const statusColor: Record<string, string> = {
      PENDING:  "#d97706",
      APPROVED: "#16a34a",
      REJECTED: "#dc2626",
    }

    return (
      <div
        ref={ref}
        id={id}
        style={{
          width: "680px",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          background: "#ffffff",
          color: "#1e293b",
          padding: "0",
          margin: "0",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e2d5a 0%, #2d4a8a 100%)",
            padding: "32px 40px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/GoldKach-Logo-New-1.png"
              alt="GoldKach"
              style={{ height: "56px", width: "auto", objectFit: "contain" }}
            />
            <div>
              <div style={{ color: "#ffffff", fontSize: "22px", fontWeight: "700", letterSpacing: "0.5px" }}>
                GoldKach
              </div>
              <div style={{ color: "#38bdf8", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Unlocking Global Investments
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Deposit Receipt
            </div>
            <div style={{ color: "#ffffff", fontSize: "13px", fontWeight: "600", marginTop: "4px" }}>
              #{deposit.id.slice(0, 8).toUpperCase()}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "2px" }}>
              {fmtDate(deposit.createdAt)}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            background: "#f0f4ff",
            borderBottom: "3px solid #38bdf8",
            padding: "12px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
            Status
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: statusColor[deposit.transactionStatus] ?? "#64748b",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            ● {deposit.transactionStatus}
          </span>
        </div>

        {/* Amount hero */}
        <div
          style={{
            background: "#f8fafc",
            padding: "28px 40px",
            textAlign: "center",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div style={{ color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
            Deposit Amount
          </div>
          <div style={{ color: "#1e2d5a", fontSize: "42px", fontWeight: "800", letterSpacing: "-1px" }}>
            {fmt(deposit.amount)}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 40px", display: "flex", gap: "24px" }}>

          {/* Left column */}
          <div style={{ flex: 1 }}>
            <SectionTitle>Client Information</SectionTitle>
            <Row label="Client Name"    value={clientName} />
            <Row label="Email"          value={deposit.user?.email || "N/A"} />
            <Row label="Account No"     value={deposit.masterWallet?.accountNumber || deposit.portfolioWallet?.accountNumber || "N/A"} mono />

            <SectionTitle style={{ marginTop: "20px" }}>Transaction Details</SectionTitle>
            <Row label="Transaction ID" value={deposit.transactionId || "N/A"} mono />
            <Row label="Reference No"   value={deposit.referenceNo || "N/A"} mono />
            <Row label="Payment Method" value={methodLabel[deposit.method ?? ""] || deposit.method || "N/A"} />
            <Row label="Account No"     value={deposit.accountNo || "N/A"} />

            {(deposit.bankCost || deposit.transactionCost || deposit.cashAtBank) && (
              <>
                <SectionTitle style={{ marginTop: "20px" }}>Deductions</SectionTitle>
                <Row label="Bank Cost" value={fmt(deposit.bankCost)} />
                <Row label="Transaction Cost" value={fmt(deposit.transactionCost)} />
                <Row label="Cash at Bank" value={fmt(deposit.cashAtBank)} />
                <Row label="Total Fees" value={fmt(deposit.totalFees)} bold />
              </>
            )}
          </div>

          {/* Right column */}
          <div style={{ flex: 1 }}>
            <SectionTitle>Recorded By</SectionTitle>
            <Row label="Deposited By" value={deposit.createdByName || staffName || "N/A"} />
            <Row label="Created At"   value={fmtDate(deposit.createdAt)} />

            {deposit.transactionStatus === "APPROVED" && (
              <>
                <SectionTitle style={{ marginTop: "20px" }}>Approval Details</SectionTitle>
                <Row label="Approved By" value={deposit.approvedByName || "N/A"} />
                <Row label="Approved At" value={fmtDate(deposit.approvedAt)} />
              </>
            )}

            {deposit.transactionStatus === "REJECTED" && (
              <>
                <SectionTitle style={{ marginTop: "20px" }}>Rejection Details</SectionTitle>
                <Row label="Rejected By" value={deposit.rejectedByName || "N/A"} />
                <Row label="Rejected At" value={fmtDate(deposit.rejectedAt)} />
                {deposit.rejectReason && (
                  <Row label="Reason" value={deposit.rejectReason} />
                )}
              </>
            )}

            {deposit.description && (
              <>
                <SectionTitle style={{ marginTop: "20px" }}>Notes</SectionTitle>
                <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", background: "#f8fafc", padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                  {deposit.description}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: "#1e2d5a",
            padding: "16px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: "10px" }}>
            GoldKach Investment Management · info@goldkach.co.ug · goldkach.co.ug
          </div>
          <div style={{ color: "#38bdf8", fontSize: "10px", fontWeight: "600" }}>
            Unlocking Global Investments
          </div>
        </div>
      </div>
    )
  }
)

DepositReceipt.displayName = "DepositReceipt"

/* ── helpers ── */
function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "1.2px",
        color: "#2d4a8a",
        borderBottom: "2px solid #38bdf8",
        paddingBottom: "4px",
        marginBottom: "10px",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Row({ label, value, mono, bold }: { label: string; value: string; mono?: boolean; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px", gap: "8px" }}>
      <span style={{ fontSize: "11px", color: "#64748b", flexShrink: 0 }}>{label}</span>
      <span
        style={{
          fontSize: "11px",
          color: "#1e293b",
          fontWeight: bold ? "800" : "600",
          fontFamily: mono ? "monospace" : "inherit",
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  )
}
