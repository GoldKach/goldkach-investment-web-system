// app/admin/deposits/components/deposit-details-modal.tsx
"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CheckCircle, XCircle, Clock, User, Wallet, CreditCard,
  FileText, AlertCircle, Image as ImageIcon, ExternalLink,
  Download, Printer, Mail, Loader2, UserCheck, PieChart,
} from "lucide-react"
import { type Deposit, approveDeposit, rejectDeposit } from "@/actions/deposits"
import { getUserPortfolioById, type UserPortfolioAssetDTO } from "@/actions/user-portfolios"
import { downloadReceiptPdf } from "@/lib/download-receipt"
import { toast } from "sonner"
import { DepositReceipt } from "./deposit-receipt"

interface DepositDetailsModalProps {
  deposit:   Deposit
  isOpen:    boolean
  onClose:   () => void
  adminId:   string
  adminName: string
  onSuccess: () => void
}

export function DepositDetailsModal({
  deposit, isOpen, onClose, adminId, adminName, onSuccess,
}: DepositDetailsModalProps) {
  const [isApproving,   setIsApproving]   = useState(false)
  const [isRejecting,   setIsRejecting]   = useState(false)
  const [isSendingMail, setIsSendingMail] = useState(false)
  const [showReceipt,   setShowReceipt]   = useState(false)

  // Cost-per-share and close-price inputs for ALLOCATION top-ups
  const [portfolioAssets,    setPortfolioAssets]    = useState<UserPortfolioAssetDTO[]>([])
  const [costPerShareInputs, setCostPerShareInputs] = useState<Record<string, string>>({})
  const [closePriceInputs,   setClosePriceInputs]   = useState<Record<string, string>>({})
  const [assetsLoading,      setAssetsLoading]      = useState(false)

  const receiptRef = useRef<HTMLDivElement>(null)

  const isAllocation = deposit.depositTarget === "ALLOCATION"
  const isPending    = deposit.transactionStatus === "PENDING"

  // Fetch portfolio assets when modal opens for a pending ALLOCATION deposit
  useEffect(() => {
    if (!isOpen || !isAllocation || !isPending || !deposit.userPortfolioId) return
    setAssetsLoading(true)
    getUserPortfolioById(deposit.userPortfolioId, { userAssets: true })
      .then((r) => {
        const assets = r.success ? (r.data?.userAssets ?? []) : []
        setPortfolioAssets(assets)
        const cps: Record<string, string> = {}
        const cp:  Record<string, string> = {}
        assets.forEach((a) => {
          cps[a.assetId] = String(a.costPerShare ?? "")
          cp[a.assetId]  = String(a.asset?.closePrice ?? "")
        })
        setCostPerShareInputs(cps)
        setClosePriceInputs(cp)
      })
      .finally(() => setAssetsLoading(false))
  }, [isOpen, isAllocation, isPending, deposit.userPortfolioId])

  const sendReceiptEmail = async (updatedDeposit: Deposit) => {
    if (!updatedDeposit.user?.email) return
    const depositWithStaff = { ...updatedDeposit, createdByName: updatedDeposit.createdByName || adminName }
    try {
      const res = await fetch("/api/deposits/send-receipt", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deposit: depositWithStaff }),
      })
      const data = await res.json()
      if (data.success) toast.success(`Receipt emailed to ${updatedDeposit.user.email}`)
      else toast.error(data.error || "Deposit saved but email failed")
    } catch {
      toast.error("Deposit saved but email could not be sent")
    }
  }

  const handleApprove = async () => {
    const name = [deposit.user?.firstName, deposit.user?.lastName].filter(Boolean).join(" ") || "this user"

    // Validate cost-per-share + close-price inputs for ALLOCATION deposits
    if (isAllocation && portfolioAssets.length > 0) {
      for (const asset of portfolioAssets) {
        const sym = asset.asset?.symbol ?? asset.assetId
        const cps = Number(costPerShareInputs[asset.assetId])
        const cp  = Number(closePriceInputs[asset.assetId])
        if (!Number.isFinite(cps) || cps <= 0) {
          toast.error(`Enter a valid cost per share for ${sym}`)
          return
        }
        if (!Number.isFinite(cp) || cp <= 0) {
          toast.error(`Enter a valid close price for ${sym}`)
          return
        }
      }
    }

    if (!confirm(`Approve deposit of USh ${deposit.amount.toLocaleString()} for ${name}?`)) return

    setIsApproving(true)
    try {
      // Build assetPrices map for ALLOCATION deposits
      const assetPricesMap: Record<string, { costPerShare: number; closePrice: number }> | undefined =
        isAllocation && portfolioAssets.length > 0
          ? Object.fromEntries(
              portfolioAssets.map((a) => [
                a.assetId,
                { costPerShare: Number(costPerShareInputs[a.assetId]), closePrice: Number(closePriceInputs[a.assetId]) },
              ])
            )
          : undefined

      const r = await approveDeposit(deposit.id, { approvedById: adminId, approvedByName: adminName }, assetPricesMap)
      if (r.success) {
        toast.success("Deposit approved!")
        onSuccess()
        onClose()
        await sendReceiptEmail({ ...deposit, ...(r.data ?? {}) })
      } else {
        toast.error(r.error || "Failed to approve")
      }
    } catch { toast.error("Unexpected error") }
    finally { setIsApproving(false) }
  }

  const handleReject = async () => {
    const name = [deposit.user?.firstName, deposit.user?.lastName].filter(Boolean).join(" ") || "this user"
    const reason = prompt(`Reason for rejecting deposit of USh ${deposit.amount.toLocaleString()} for ${name} (optional):`) ?? ""
    if (!confirm("Confirm rejection?")) return
    setIsRejecting(true)
    try {
      const r = await rejectDeposit(deposit.id, { reason, rejectedById: adminId, rejectedByName: adminName })
      if (r.success) {
        toast.success("Deposit rejected")
        onSuccess()
        onClose()
      } else {
        toast.error(r.error || "Failed to reject")
      }
    } catch { toast.error("Unexpected error") }
    finally { setIsRejecting(false) }
  }

  const handleDownloadPdf = useCallback(async () => {
    if (!receiptRef.current) { toast.error("Receipt not ready"); return }
    try {
      await downloadReceiptPdf(
        receiptRef.current,
        `GoldKach-Receipt-${deposit.id.slice(0, 8).toUpperCase()}.pdf`
      )
      toast.success("Receipt downloaded")
    } catch (e) {
      console.error("PDF error:", e)
      toast.error("Failed to generate PDF")
    }
  }, [deposit.id])

  const handlePrint = useCallback(() => {
    if (!receiptRef.current) return
    const content = receiptRef.current.innerHTML
    const win = window.open("", "_blank", "width=800,height=900")
    if (!win) return
    win.document.write(`<html><head><title>GoldKach Receipt</title>
      <style>body{margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;}@media print{body{margin:0;}}</style>
      </head><body>${content}</body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 300)
  }, [])

  const handleSendEmail = async () => {
    if (!deposit.user?.email) { toast.error("No email for this client"); return }
    setIsSendingMail(true)
    try {
      const res  = await fetch("/api/deposits/send-receipt", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deposit }),
      })
      const data = await res.json()
      if (data.success) toast.success(`Receipt sent to ${deposit.user.email}`)
      else toast.error(data.error || "Failed to send email")
    } catch { toast.error("Failed to send email") }
    finally { setIsSendingMail(false) }
  }

  const statusIcon = () => {
    switch (deposit.transactionStatus) {
      case "PENDING":  return <Clock       className="h-5 w-5 text-yellow-500" />
      case "APPROVED": return <CheckCircle className="h-5 w-5 text-green-500" />
      case "REJECTED": return <XCircle     className="h-5 w-5 text-red-500" />
    }
  }

  const statusBadgeCls = () => {
    switch (deposit.transactionStatus) {
      case "PENDING":  return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30"
      case "APPROVED": return "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30"
      case "REJECTED": return "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
    }
  }

  const methodLabel: Record<string, string> = {
    BANK_TRANSFER: "Bank Transfer",
    CASH:          "Cash Deposit",
    CHEQUE:        "Cheque",
    OTHER:         "Other",
  }

  const card  = "bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2"
  const lbl   = "text-slate-500 dark:text-slate-400 text-sm"
  const val   = "text-slate-900 dark:text-white text-sm font-medium"
  const hd    = "text-slate-800 dark:text-white font-semibold mb-3 flex items-center gap-2 text-sm"
  const isPdf = deposit.proofFileName?.toLowerCase().endsWith(".pdf")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-xl flex items-center gap-2">
            {statusIcon()} Deposit Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className={`text-sm px-3 py-1 ${statusBadgeCls()}`}>
              {deposit.transactionStatus}
            </Badge>
            <Badge variant="outline" className={
              deposit.depositTarget === "MASTER"
                ? "text-sm px-3 py-1 bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                : "text-sm px-3 py-1 bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30"
            }>
              {deposit.depositTarget === "MASTER" ? "External Deposit" : "Portfolio Allocation"}
            </Badge>
          </div>

          {/* Amount hero */}
          <div className="bg-gradient-to-r from-[#1e2d5a] to-[#2d4a8a] p-6 rounded-lg text-center">
            <p className="text-slate-300 text-xs uppercase tracking-widest mb-1">Deposit Amount</p>
            <p className="text-white text-4xl font-bold">USh {deposit.amount.toLocaleString()}</p>
          </div>

          {/* Receipt actions */}
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => setShowReceipt(v => !v)}
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <FileText className="h-4 w-4 mr-1.5" />
              {showReceipt ? "Hide Receipt" : "View Receipt"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownloadPdf}
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <Download className="h-4 w-4 mr-1.5" /> Download PDF
            </Button>
            <Button size="sm" variant="outline" onClick={handlePrint}
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <Printer className="h-4 w-4 mr-1.5" /> Print
            </Button>
            <Button size="sm" variant="outline" onClick={handleSendEmail}
              disabled={isSendingMail || !deposit.user?.email}
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              {isSendingMail ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Mail className="h-4 w-4 mr-1.5" />}
              {isSendingMail ? "Sending…" : "Email Receipt"}
            </Button>
          </div>

          {/* Receipt preview (inline) */}
          {showReceipt && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
              <DepositReceipt ref={receiptRef} deposit={deposit} staffName={adminName} />
            </div>
          )}

          {/* Hidden receipt for PDF/print */}
          {!showReceipt && (
            <div style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none" }}>
              <DepositReceipt ref={receiptRef} deposit={deposit} staffName={adminName} />
            </div>
          )}

          <Separator className="bg-slate-200 dark:bg-slate-700" />

          {/* Client */}
          <div>
            <h3 className={hd}><User className="h-4 w-4" /> Client Information</h3>
            <div className={card}>
              <div className="flex justify-between"><span className={lbl}>Name</span><span className={val}>{[deposit.user?.firstName, deposit.user?.lastName].filter(Boolean).join(" ") || "N/A"}</span></div>
              <div className="flex justify-between"><span className={lbl}>Email</span><span className={val}>{deposit.user?.email || "N/A"}</span></div>
              <div className="flex justify-between items-center"><span className={lbl}>Account No</span><code className="text-slate-700 dark:text-white font-mono text-xs">{deposit.masterWallet?.accountNumber || deposit.portfolioWallet?.accountNumber || "N/A"}</code></div>
            </div>
          </div>

          {/* Deposited By */}
          <div>
            <h3 className={hd}><UserCheck className="h-4 w-4" /> Deposited By</h3>
            <div className={card}>
              <div className="flex justify-between"><span className={lbl}>Staff Name</span><span className={val}>{deposit.createdByName || adminName}</span></div>
              {deposit.createdByRole && <div className="flex justify-between"><span className={lbl}>Role</span><span className={val}>{deposit.createdByRole}</span></div>}
              <div className="flex justify-between"><span className={lbl}>Recorded At</span><span className={val}>{new Date(deposit.createdAt).toLocaleString()}</span></div>
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-700" />

          {/* Transaction */}
          <div>
            <h3 className={hd}><CreditCard className="h-4 w-4" /> Transaction Details</h3>
            <div className={card}>
              <div className="flex justify-between items-center"><span className={lbl}>Transaction ID</span><code className="text-slate-700 dark:text-white font-mono text-xs">{deposit.transactionId || "N/A"}</code></div>
              <div className="flex justify-between items-center"><span className={lbl}>Reference No</span><code className="text-slate-700 dark:text-white font-mono text-xs">{deposit.referenceNo || "N/A"}</code></div>
              <div className="flex justify-between"><span className={lbl}>Payment Method</span><span className={val}>{methodLabel[deposit.method ?? ""] || deposit.method || "N/A"}</span></div>
              <div className="flex justify-between"><span className={lbl}>Account No</span><span className={val}>{deposit.accountNo || "N/A"}</span></div>
              {deposit.description && (
                <div>
                  <span className={lbl}>Notes</span>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">{deposit.description}</p>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-700" />

          {/* Wallet */}
          <div>
            <h3 className={hd}><Wallet className="h-4 w-4" /> Wallet Information</h3>
            <div className={card}>
              {deposit.masterWallet && <div className="flex justify-between"><span className={lbl}>Master Cash Balance</span><span className={val}>USh {deposit.masterWallet.balance?.toLocaleString() ?? "N/A"}</span></div>}
              {isAllocation && deposit.portfolioWallet && (
                <>
                  <div className="flex justify-between items-center"><span className={lbl}>Portfolio Wallet</span><code className="text-slate-700 dark:text-white font-mono text-xs">{deposit.portfolioWallet.accountNumber || deposit.portfolioWalletId}</code></div>
                  <div className="flex justify-between"><span className={lbl}>Portfolio NAV</span><span className={val}>USh {deposit.portfolioWallet.netAssetValue?.toLocaleString() ?? "N/A"}</span></div>
                </>
              )}
            </div>
          </div>

          {/* ── Asset Cost Per Share (ALLOCATION top-ups only, while PENDING) ── */}
          {isAllocation && isPending && (
            <>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div>
                <h3 className={hd}>
                  <PieChart className="h-4 w-4" /> Asset Prices at Approval
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Enter the cost per share and close price for each asset at the time of this top-up approval. These determine stock units, close value, and gain/loss.
                </p>

                {assetsLoading ? (
                  <div className="flex items-center gap-2 py-4 text-slate-500 dark:text-slate-400 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading portfolio assets…
                  </div>
                ) : portfolioAssets.length === 0 ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 p-3 text-sm text-amber-700 dark:text-amber-400">
                    No assets found for this portfolio. The deposit can still be approved but no sub-portfolio positions will be created.
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px]">
                      <thead className="bg-slate-100 dark:bg-slate-800">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Asset</th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Class</th>
                          <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Alloc %</th>
                          <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 w-36">Cost/Share (USh)</th>
                          <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 w-36">Close Price (USh)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioAssets.map((asset, idx) => (
                          <tr key={asset.assetId} className={`border-t border-slate-200 dark:border-slate-700 ${idx % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-slate-900/30"}`}>
                            <td className="px-3 py-2.5">
                              <div className="font-semibold text-slate-900 dark:text-white">{asset.asset?.symbol ?? asset.assetId}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{asset.asset?.description}</div>
                            </td>
                            <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 text-xs">{asset.asset?.assetClass ?? "—"}</td>
                            <td className="px-3 py-2.5 text-right text-slate-700 dark:text-slate-300">{asset.allocationPercentage.toFixed(1)}%</td>
                            <td className="px-3 py-2.5">
                              <Label className="sr-only" htmlFor={`cps-${asset.assetId}`}>Cost per share for {asset.asset?.symbol}</Label>
                              <Input
                                id={`cps-${asset.assetId}`}
                                type="number"
                                min={0.01}
                                step={0.01}
                                placeholder="0.00"
                                className="h-8 text-right text-sm w-full"
                                value={costPerShareInputs[asset.assetId] ?? ""}
                                onChange={(e) => setCostPerShareInputs((prev) => ({ ...prev, [asset.assetId]: e.target.value }))}
                              />
                            </td>
                            <td className="px-3 py-2.5">
                              <Label className="sr-only" htmlFor={`cp-${asset.assetId}`}>Close price for {asset.asset?.symbol}</Label>
                              <Input
                                id={`cp-${asset.assetId}`}
                                type="number"
                                min={0.01}
                                step={0.01}
                                placeholder="0.00"
                                className="h-8 text-right text-sm w-full"
                                value={closePriceInputs[asset.assetId] ?? ""}
                                onChange={(e) => setClosePriceInputs((prev) => ({ ...prev, [asset.assetId]: e.target.value }))}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          <Separator className="bg-slate-200 dark:bg-slate-700" />

          {/* Audit */}
          <div>
            <h3 className={hd}><FileText className="h-4 w-4" /> Audit Trail</h3>
            <div className={card}>
              <div className="flex justify-between"><span className={lbl}>Created At</span><span className={val}>{new Date(deposit.createdAt).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className={lbl}>Updated At</span><span className={val}>{new Date(deposit.updatedAt).toLocaleString()}</span></div>
              {deposit.approvedByName && <div className="flex justify-between"><span className={lbl}>Approved By</span><span className={val}>{deposit.approvedByName}</span></div>}
              {deposit.approvedAt    && <div className="flex justify-between"><span className={lbl}>Approved At</span><span className={val}>{new Date(deposit.approvedAt).toLocaleString()}</span></div>}
              {deposit.rejectedByName && <div className="flex justify-between"><span className={lbl}>Rejected By</span><span className={val}>{deposit.rejectedByName}</span></div>}
              {deposit.rejectedAt    && <div className="flex justify-between"><span className={lbl}>Rejected At</span><span className={val}>{new Date(deposit.rejectedAt).toLocaleString()}</span></div>}
              {deposit.rejectReason  && <div><span className={lbl}>Rejection Reason</span><p className="text-red-600 dark:text-red-400 text-sm mt-1">{deposit.rejectReason}</p></div>}
            </div>
          </div>

          {/* Proof of Payment */}
          {deposit.proofUrl && (
            <>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div>
                <h3 className={hd}><ImageIcon className="h-4 w-4" /> Proof of Payment</h3>
                <div className={card}>
                  {deposit.proofFileName && (
                    <div className="flex justify-between items-center">
                      <span className={lbl}>File</span>
                      <span className="text-slate-700 dark:text-white text-xs font-mono">{deposit.proofFileName}</span>
                    </div>
                  )}
                  <a href={deposit.proofUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm underline">
                    <ExternalLink className="h-4 w-4" /> Open in new tab
                  </a>
                  {!isPdf && (
                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={deposit.proofUrl} alt="Proof of payment" className="w-full object-contain max-h-64" />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          {isPending && (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleApprove}
                disabled={isApproving || isRejecting || (isAllocation && assetsLoading)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isApproving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {isApproving ? "Approving…" : "Approve Deposit"}
              </Button>
              <Button onClick={handleReject} disabled={isApproving || isRejecting} variant="destructive" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                {isRejecting ? "Rejecting…" : "Reject Deposit"}
              </Button>
            </div>
          )}

          {!isPending && (
            <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                This deposit has already been {deposit.transactionStatus.toLowerCase()} and cannot be modified.
              </p>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
