"use client"

import { useState, useRef, useCallback } from "react"
import { type Deposit } from "@/actions/deposits"
import { DepositReceipt } from "@/app/(back)/dashboard/deposits/components/deposit-receipt"
import { downloadReceiptPdf } from "@/lib/download-receipt"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CreditCard, Building2, Smartphone, AlertCircle,
  CheckCircle, Clock, Copy, Check, Download, ChevronDown, ChevronUp,
} from "lucide-react"
import { toast } from "sonner"

interface DepositsPageContentProps {
  deposits: Deposit[]
  user: any
}

const bankDetails = {
  bankName: "STANBIC BANK UGANDA LIMITED",
  accountName: "GoldKach Uganda Ltd",
  accountNumberUGX: "9030024940933",
  accountNumberUSD: "9030024940992",
  swiftCode: "SBICUGKK",
  address: "Plot 17 HANNINGTON ROAD, CRESTED TOWERS, SHORT TOWER KAMPALA",
}

const statusCls: Record<string, string> = {
  APPROVED: "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
  PENDING:  "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
  REJECTED: "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
}

function DepositCard({ deposit, user }: { deposit: Deposit; user: any }) {
  const [expanded, setExpanded] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  const handleDownload = useCallback(async () => {
    if (!receiptRef.current) { toast.error("Receipt not ready"); return }
    setDownloading(true)
    try {
      await downloadReceiptPdf(
        receiptRef.current,
        `GoldKach-Receipt-${deposit.id.slice(0, 8).toUpperCase()}.pdf`
      )
      toast.success("Receipt downloaded")
    } catch (e) {
      console.error("PDF error:", e)
      toast.error("Failed to generate receipt")
    } finally {
      setDownloading(false)
    }
  }, [deposit.id])

  const isApproved = deposit.transactionStatus === "APPROVED"
  const depositWithUser = { ...deposit, user: deposit.user ?? { firstName: user?.firstName, lastName: user?.lastName, email: user?.email, id: user?.id } }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 overflow-hidden">
      {/* Summary row */}
      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-slate-900 dark:text-white font-bold text-lg">
            ${deposit.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <Badge variant="outline" className={statusCls[deposit.transactionStatus]}>
            {deposit.transactionStatus}
          </Badge>
          {deposit.depositTarget && (
            <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
              {deposit.depositTarget === "MASTER" ? "External" : "Allocation"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <p className="text-slate-500 dark:text-slate-400 text-xs hidden sm:block">
            {new Date(deposit.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
          {isApproved && (
            <Button size="sm" variant="outline" onClick={handleDownload} disabled={downloading}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs h-8">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {downloading ? "Generating…" : "Receipt"}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setExpanded(v => !v)}
            className="text-slate-500 dark:text-slate-400 h-8 w-8 p-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
            <Field label="Date" value={new Date(deposit.createdAt).toLocaleString()} />
            <Field label="Transaction ID" value={deposit.transactionId} mono />
            <Field label="Reference No" value={deposit.referenceNo} mono />
            <Field label="Method" value={deposit.method} />
            <Field label="Mobile No" value={deposit.mobileNo} />
            <Field label="Account No" value={deposit.accountNo} />
            {deposit.createdByName  && <Field label="Created by"  value={deposit.createdByName} />}
            {deposit.approvedByName && <Field label="Approved by" value={deposit.approvedByName} />}
            {deposit.approvedAt     && <Field label="Approved at" value={new Date(deposit.approvedAt).toLocaleString()} />}
            {deposit.rejectedByName && <Field label="Rejected by" value={deposit.rejectedByName} cls="text-red-500" />}
            {deposit.rejectedAt     && <Field label="Rejected at" value={new Date(deposit.rejectedAt).toLocaleString()} />}
          </div>
          {deposit.description && (
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Note: </span>{deposit.description}
            </p>
          )}
          {deposit.rejectReason && (
            <p className="mt-2 text-xs text-red-500">
              <span className="font-medium">Rejection reason: </span>{deposit.rejectReason}
            </p>
          )}
        </div>
      )}

      {/* Hidden receipt for PDF generation */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1, pointerEvents: "none" }}>
        <DepositReceipt ref={receiptRef} deposit={depositWithUser} />
      </div>
    </div>
  )
}

function Field({ label, value, mono, cls }: { label: string; value?: string | null; mono?: boolean; cls?: string }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-sm font-medium text-slate-900 dark:text-white break-all ${mono ? "font-mono" : ""} ${cls ?? ""}`}>{value}</p>
    </div>
  )
}

export function DepositsPageContent({ deposits, user }: DepositsPageContentProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const approved = deposits.filter(d => d.transactionStatus === "APPROVED").length
  const pending  = deposits.filter(d => d.transactionStatus === "PENDING").length
  const rejected = deposits.filter(d => d.transactionStatus === "REJECTED").length
  const totalBalance = deposits
    .filter(d => d.transactionStatus === "APPROVED")
    .reduce((sum, d) => sum + d.amount, 0)
    .toFixed(2)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Deposits</h1>
          <p className="text-slate-600 dark:text-slate-400">View your deposit history and how to make a deposit</p>
        </div>

        {/* Stats */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 shadow-sm">
          <div className="mb-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Approved Balance</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">${totalBalance}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Approved</p>
                <p className="text-slate-900 dark:text-white font-semibold">{approved}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Pending</p>
                <p className="text-slate-900 dark:text-white font-semibold">{pending}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Rejected</p>
                <p className="text-slate-900 dark:text-white font-semibold">{rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions + Bank Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Deposit Instructions */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 shadow-sm space-y-6">
            <h2 className="text-slate-900 dark:text-white font-semibold text-xl">How to Deposit</h2>

            <div>
              <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Accepted Payment Methods
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Bank Transfer (ACH / Wire)</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Credit / Debit Card</li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" /> How It Works
              </h3>
              <ol className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
                {[
                  "Make payment to the bank account details shown on the right",
                  "Contact your relationship manager with your proof of payment",
                  "Your deposit will be reviewed and approved within 24 hours",
                  "Funds will be available in your wallet once approved",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
              <h3 className="text-amber-700 dark:text-amber-400 font-medium mb-2 flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" /> Important Notes
              </h3>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                <li>• Minimum deposit: $1,000</li>
                <li>• Processing time: 24–48 hours</li>
                <li>• Keep your transaction ID for reference</li>
                <li>• Contact support if not approved within 48 hours</li>
              </ul>
            </div>
          </div>

          {/* Bank Details */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 shadow-sm">
            <h2 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Bank Account Details
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Use these details to make your bank transfer</p>

            <div className="space-y-4">
              {[
                { label: "Bank Name",            value: bankDetails.bankName,          key: "bank",    mono: false },
                { label: "Account Name",         value: bankDetails.accountName,       key: "account", mono: false },
                { label: "Account Number (UGX)", value: bankDetails.accountNumberUGX,  key: "ugx",     mono: true  },
                { label: "Account Number (USD)", value: bankDetails.accountNumberUSD,  key: "usd",     mono: true  },
                { label: "Swift Code",           value: bankDetails.swiftCode,         key: "swift",   mono: true  },
                { label: "Branch Address",       value: bankDetails.address,           key: "address", mono: false },
              ].map(({ label, value, key, mono }) => (
                <div key={key}>
                  <label className="text-slate-600 dark:text-slate-400 text-xs font-medium block mb-1">{label}</label>
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded p-3 border border-slate-200 dark:border-slate-700 gap-2">
                    <span className={`text-slate-900 dark:text-white text-sm leading-relaxed ${mono ? "font-mono" : ""}`}>{value}</span>
                    <button type="button" onClick={() => handleCopy(value, key)}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex-shrink-0">
                      {copiedField === key ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
              <h3 className="text-blue-700 dark:text-blue-400 font-medium mb-2 flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4" /> Mobile Money
              </h3>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                <li>• MTN Mobile Money: Dial *165#</li>
                <li>• Airtel Money: Dial *185#</li>
                <li>• Remember to save your transaction ID</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deposit History */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 shadow-sm">
          <h2 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl">Deposit History</h2>
          {deposits.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No deposits found.</p>
          ) : (
            <div className="space-y-3">
              {deposits.map(d => <DepositCard key={d.id} deposit={d} user={user} />)}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
