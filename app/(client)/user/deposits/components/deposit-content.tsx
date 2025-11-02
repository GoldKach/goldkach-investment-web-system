// components/user/deposits-page-content.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DepositModal } from "@/components/deposit-modal"
import { DepositList } from "@/components/user/depositlist"
import Link from "next/link"
import { createDeposit, type Deposit } from "@/actions/deposits"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DepositsPageContentProps {
  deposits: Deposit[]
  userId: string
  user:any
  walletId: string
}

export function DepositsPageContent({walletId, deposits,user, userId }: DepositsPageContentProps) {
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Calculate total balance from approved deposits
  const totalBalance = deposits
    .filter((d) => d.transactionStatus === "APPROVED")
    .reduce((sum, d) => sum + d.amount, 0)
    .toFixed(2)

  // Transform deposits for the DepositList component
  const formattedDeposits = deposits.map((deposit) => {
    // Map API status to component status
    let status: "approved" | "pending" | "rejected"
    switch (deposit.transactionStatus) {
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
      id: deposit.id,
      amount: `$${deposit.amount.toLocaleString("en-US", { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`,
      method: deposit.method || "Not Specified",
      status,
      date: new Date(deposit.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      transactionId: deposit.transactionId || `DEP-${deposit.id.slice(0, 8)}`,
      description: deposit.description || undefined,
    }
  })

  const handleDepositSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const result = await createDeposit({
        userId: userId,
        walletId: data.walletId,
        amount: parseFloat(data.amount),
        method: data.method,
        transactionId: data.transactionId,
        transactionStatus: "PENDING",
      })

      if (result.success) {
        toast.success("Deposit request submitted successfully!")
        setDepositModalOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to submit deposit request")
      }
    } catch (error) {
      console.error("Error submitting deposit:", error)
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
            <h1 className="text-4xl font-bold text-white mb-2">Wallet Management</h1>
            <p className="text-slate-400">Manage your deposits and withdrawals</p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setDepositModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              disabled={isSubmitting}
            >
              Create Deposit Request
            </Button>
            <Link href="/user/withdraws">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
              >
                Withdraw
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h2 className="text-white font-semibold mb-4">Recent Deposits</h2>
              <DepositList deposits={formattedDeposits} />
            </div>

            <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h2 className="text-white font-semibold mb-4">Wallet Balance</h2>
              <p className="text-3xl font-bold text-blue-400">${totalBalance}</p>
              <p className="text-slate-400 text-sm mt-2">
                {deposits.filter((d) => d.transactionStatus === "APPROVED").length} approved deposits
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pending:</span>
                  <span className="text-yellow-400">
                    {deposits.filter((d) => d.transactionStatus === "PENDING").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Rejected:</span>
                  <span className="text-red-400">
                    {deposits.filter((d) => d.transactionStatus === "REJECTED").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Deposits:</span>
                  <span className="text-white">{deposits.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DepositModal 
      user={user}
      walletId={walletId}
        open={depositModalOpen} 
        onOpenChange={setDepositModalOpen} 
        onSubmit={handleDepositSubmit}
        // isSubmitting={isSubmitting}
      />
    </main>
  )
}