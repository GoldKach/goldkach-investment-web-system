
// app/user/withdraws/components/withdraw-page-content.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WithdrawalList } from "@/components/user/withdraw-list"
import { WithdrawalModal } from "@/components/withdraw-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createWithdrawal, Withdrawal } from "@/actions/withdraws"

interface WithdrawalsPageContentProps {
  withdrawals: Withdrawal[]
  user: {
    id: string
    walletId: string
    accountNumber: string
    availableBalance: number
    totalBalance: number
  }
}

export function WithdrawalsPageContent({ withdrawals, user }: WithdrawalsPageContentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Calculate total withdrawn from approved withdrawals
  const totalWithdrawn = withdrawals
    .filter((w) => w.transactionStatus === "APPROVED")
    .reduce((sum, w) => sum + w.amount, 0)
    .toFixed(2)

  // Calculate pending amount
  const pendingAmount = withdrawals
    .filter((w) => w.transactionStatus === "PENDING")
    .reduce((sum, w) => sum + w.amount, 0)
    .toFixed(2)

  // Calculate rejected amount
  const rejectedAmount = withdrawals
    .filter((w) => w.transactionStatus === "REJECTED")
    .reduce((sum, w) => sum + w.amount, 0)
    .toFixed(2)

  // Transform withdrawals for the WithdrawalList component
  const formattedWithdrawals = withdrawals.map((withdrawal) => {
    let status: "approved" | "pending" | "rejected"
    switch (withdrawal.transactionStatus) {
      case "APPROVED":
        status = "approved"
        break
      case "PENDING":
        status = "pending"
        break
      case "REJECTED":
        status = "rejected"
        break
      default:
        status = "pending"
    }

    return {
      id: withdrawal.id,
      amount: `$${withdrawal.amount.toLocaleString("en-US", { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`,
      bankName: withdrawal.bankName,
      bankAccountName: withdrawal.bankAccountName,
      status,
      date: new Date(withdrawal.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      transactionId: withdrawal.transactionId || `WDR-${withdrawal.id.slice(0, 8)}`,
      referenceNo: withdrawal.referenceNo,
      bankBranch: withdrawal.bankBranch,
      method: withdrawal.method || "Bank Transfer",
      description: withdrawal.description || undefined,
    }
  })

  const handleWithdrawalSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // Use wallet accountNumber as reference
      const referenceNo = data.referenceNo || user.accountNumber

      const result = await createWithdrawal({
        userId: user.id,
        walletId: user.walletId,
        amount: parseFloat(data.amount),
        referenceNo: referenceNo,
        method: data.method || "Bank Transfer",
        bankName: data.bankName,
        bankAccountName: data.bankAccountName,
        bankBranch: data.bankBranch,
        AccountNo: data.AccountNo || user.accountNumber, // Use wallet account number as default
        AccountName: data.AccountName,
        description: data.description,
      })

      if (result.success) {
        toast.success("Withdrawal request submitted successfully!")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to submit withdrawal request")
      }
    } catch (error) {
      console.error("Error submitting withdrawal:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Withdrawals</h1>
            <p className="text-slate-400">View and manage your withdrawal history</p>
          </div>

          <div className="flex gap-4">
            <WithdrawalModal 
              availableBalance={user.availableBalance}
              user={user}
              onSubmit={handleWithdrawalSubmit}
              isSubmitting={isSubmitting}
            />
            <Link href="/user/deposits">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
              >
                Back to Deposits
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h2 className="text-white font-semibold mb-4">Withdrawal History</h2>
              <WithdrawalList withdrawals={formattedWithdrawals} />
            </div>

            <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h2 className="text-white font-semibold mb-4">Withdrawal Summary</h2>
              
              {/* Account Info */}
              <div className="mb-6 pb-6 border-b border-slate-700">
                <p className="text-slate-400 text-xs mb-1">Account Number</p>
                <p className="text-white font-mono text-sm">{user.accountNumber}</p>
              </div>

              <p className="text-3xl font-bold text-blue-400">${totalWithdrawn}</p>
              <p className="text-slate-400 text-sm mt-2">
                {withdrawals.filter((w) => w.transactionStatus === "APPROVED").length} approved withdrawals
              </p>
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Available Balance:</span>
                    <span className="text-green-400 font-semibold">
                      ${user.availableBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Balance:</span>
                    <span className="text-white font-semibold">
                      ${user.totalBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Pending:</span>
                    <span className="text-yellow-400">${pendingAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Rejected:</span>
                    <span className="text-red-400">${rejectedAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Total Withdrawals:</span>
                    <span className="text-white font-semibold">{withdrawals.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}