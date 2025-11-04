// app/admin/deposits/components/deposit-details-modal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Wallet,
  Calendar,
  Hash,
  DollarSign,
  CreditCard,
  FileText,
  AlertCircle
} from "lucide-react"
import { type Deposit, approveDeposit, updateDeposit } from "@/actions/deposits"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DepositDetailsModalProps {
  deposit: Deposit
  isOpen: boolean
  onClose: () => void
  adminId: string
  adminName: string
  onSuccess: () => void
}

export function DepositDetailsModal({ 
  deposit, 
  isOpen, 
  onClose, 
  adminId, 
  adminName,
  onSuccess 
}: DepositDetailsModalProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    if (!confirm(`Approve deposit of $${deposit.amount.toLocaleString()} for ${deposit.user?.name || "this user"}?`)) {
      return
    }

    setIsApproving(true)
    try {
      const result = await approveDeposit(deposit.id, adminName)
      
      if (result.success) {
        toast.success("Deposit approved successfully!")
        onSuccess()
        onClose()
      } else {
        toast.error(result.error || "Failed to approve deposit")
      }
    } catch (error) {
      console.error("Error approving deposit:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!confirm(`Reject deposit of $${deposit.amount.toLocaleString()} for ${deposit.user?.name || "this user"}?`)) {
      return
    }

    setIsRejecting(true)
    try {
      const result = await updateDeposit(deposit.id, {
        transactionStatus: "REJECTED"
      })
      
      if (result.success) {
        toast.success("Deposit rejected")
        onSuccess()
        onClose()
      } else {
        toast.error(result.error || "Failed to reject deposit")
      }
    } catch (error) {
      console.error("Error rejecting deposit:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsRejecting(false)
    }
  }

  const getStatusIcon = () => {
    switch (deposit.transactionStatus) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-400" />
    }
  }

  const getStatusColor = () => {
    switch (deposit.transactionStatus) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "APPROVED":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "REJECTED":
        return "bg-red-500/20 text-red-400 border-red-500/30"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            {getStatusIcon()}
            Deposit Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`text-sm px-3 py-1 ${getStatusColor()}`}>
              {deposit.transactionStatus}
            </Badge>
            <p className="text-slate-400 text-sm">
              ID: <code className="text-slate-300 font-mono">{deposit.id.slice(0, 8)}</code>
            </p>
          </div>

          {/* Amount */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Amount</p>
            <p className="text-4xl font-bold text-white">
              ${deposit.amount.toLocaleString()}
            </p>
          </div>

          {/* User Information */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              User Information
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="text-white">{deposit.user?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-white">{deposit.user?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User ID:</span>
                <code className="text-white font-mono text-sm">{deposit.userId}</code>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Transaction Details */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transaction Details
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <code className="text-white font-mono text-sm">
                  {deposit.transactionId || "N/A"}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference No:</span>
                <code className="text-white font-mono text-sm">
                  {deposit.referenceNo || "N/A"}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <span className="text-white">{deposit.method || "N/A"}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-slate-400">Mobile No:</span>
                <span className="text-white">{deposit.mobileNo || "N/A"}</span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-slate-400">Account No:</span>
                <span className="text-white">{deposit.AccountNo || "N/A"}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Wallet Information */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Information
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Wallet ID:</span>
                <code className="text-white font-mono text-sm">{deposit.walletId}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Net Asset Value:</span>
                <span className="text-white">
                  ${deposit.wallet?.netAssetValue?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Additional Information */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Information
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Created At:</span>
                <span className="text-white">
                  {new Date(deposit.createdAt).toLocaleString()}
                </span>
              </div>
              {deposit.ApprovedBy && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Approved By:</span>
                  <span className="text-white">{deposit.ApprovedBy}</span>
                </div>
              )}
              {deposit.description && (
                <div>
                  <span className="text-slate-400">Description:</span>
                  <p className="text-white mt-1">{deposit.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {deposit.transactionStatus === "PENDING" && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isApproving ? "Approving..." : "Approve Deposit"}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isRejecting ? "Rejecting..." : "Reject Deposit"}
              </Button>
            </div>
          )}

          {deposit.transactionStatus !== "PENDING" && (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-slate-400" />
              <p className="text-slate-400 text-sm">
                This deposit has already been {deposit.transactionStatus.toLowerCase()} and cannot be modified.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}