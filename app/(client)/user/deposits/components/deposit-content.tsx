

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
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Check
} from "lucide-react"

interface DepositsPageContentProps {
  deposits: Deposit[]
  userId: string
  user: any
  walletId: string
}

const bankDetails = {
  bankName: "STANBIC BANK UGANDA LIMITED",
  accountName: "GoldKach Uganda Ltd",
  accountNumberUGX: "9030024940933",
  accountNumberUSD: "9030024940992",
  swiftCode: "SBICUGKK",
  address: "Plot 17 HANNINGTON ROAD, CRESTED TOWERS, SHORT TOWER KAMPALA",
}

export function DepositsPageContent({walletId, deposits, user, userId }: DepositsPageContentProps) {
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const router = useRouter()

  // Calculate total balance from approved deposits
  const totalBalance = deposits
    .filter((d) => d.transactionStatus === "APPROVED")
    .reduce((sum, d) => sum + d.amount, 0)
    .toFixed(2)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

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
        AccountNo: user.wallet.accountNumber,
        referenceNo: user.wallet.accountNumber
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
    <main className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Wallet Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your deposits and withdrawals</p>
          </div>

          {/* Wallet Balance Card */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-slate-600 dark:text-slate-400 text-sm mb-1">Total Balance</h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">${totalBalance}</p>
              </div>
              <Link href="/user/withdraws">
                <Button
                  variant="outline"
                  className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Withdraw Funds
                </Button>
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">Approved</p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {deposits.filter((d) => d.transactionStatus === "APPROVED").length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">Pending</p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {deposits.filter((d) => d.transactionStatus === "PENDING").length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">Rejected</p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {deposits.filter((d) => d.transactionStatus === "REJECTED").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content: Deposit Form (Left) & Bank Details (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Create Deposit */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 shadow-sm">
              <h2 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl">Create Deposit Request</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Submit a new deposit request. All deposits are reviewed and approved within 24 hours.
              </p>
              <Button
                onClick={() => setDepositModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "New Deposit Request"}
              </Button>

              {/* Account Info */}
              <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-xs mb-2">Your Account Number</p>
                <p className="text-slate-900 dark:text-white font-mono text-lg">{user.wallet.accountNumber}</p>
              </div>

              {/* Deposit Instructions */}
              <div className="mt-6 space-y-6">
                {/* Payment Methods */}
                <div>
                  <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Accepted Payment Methods
                  </h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                      <span>Bank Transfer (ACH/Wire)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                      <span>Credit/Debit Card</span>
                    </li>
                    {/* <li className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                      <span>Mobile Money (MTN, Airtel)</span>
                    </li> */}
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    How It Works
                  </h3>
                  <ol className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
                      <span>Click "New Deposit Request" and fill in the deposit details</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
                      <span>Make payment using your preferred method</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
                      <span>Your deposit will be reviewed and approved within 24 hours</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">4</span>
                      <span>Funds will be available in your wallet once approved</span>
                    </li>
                  </ol>
                </div>

                {/* Important Notes */}
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
                  <h3 className="text-amber-700 dark:text-amber-400 font-medium mb-2 flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Important Notes
                  </h3>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                    <li>• Minimum deposit: $1000</li>
                    <li>• Processing time: 24-48 hours</li>
                    <li>• Keep your transaction ID for reference</li>
                    <li>• Contact support if not approved within 48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Bank Details */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 shadow-sm">
              <h2 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bank Account Details
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Use these details to make your bank transfer
              </p>
              
              <div className="space-y-4">
                {/* Bank Name */}
                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-xs font-medium block mb-1">Bank Name</label>
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white text-sm">{bankDetails.bankName}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.bankName, "bank")}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {copiedField === "bank" ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* Account Name */}
                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-xs font-medium block mb-1">Account Name</label>
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white text-sm">{bankDetails.accountName}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.accountName, "account")}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {copiedField === "account" ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* Account Number UGX */}
                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-xs font-medium block mb-1">Account Number (UGX)</label>
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white text-sm font-mono">{bankDetails.accountNumberUGX}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.accountNumberUGX, "ugx")}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {copiedField === "ugx" ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* Account Number USD */}
                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-xs font-medium block mb-1">Account Number (USD)</label>
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white text-sm font-mono">{bankDetails.accountNumberUSD}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.accountNumberUSD, "usd")}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {copiedField === "usd" ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* Swift Code */}
                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-xs font-medium block mb-1">Swift Code</label>
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white text-sm font-mono">{bankDetails.swiftCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.swiftCode, "swift")}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {copiedField === "swift" ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-xs font-medium block mb-1">Branch Address</label>
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded p-3 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white text-xs leading-relaxed">{bankDetails.address}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.address, "address")}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition ml-2 flex-shrink-0"
                    >
                      {copiedField === "address" ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Money Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                <h3 className="text-blue-700 dark:text-blue-400 font-medium mb-2 flex items-center gap-2 text-sm">
                  <Smartphone className="h-4 w-4" />
                  Mobile Money
                </h3>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                  <li>• MTN Mobile Money: Dial *165#</li>
                  <li>• Airtel Money: Dial *185#</li>
                  <li>• Remember to save your transaction ID</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Deposits */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white dark:bg-slate-900/50 shadow-sm">
            <h2 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl">Recent Deposits</h2>
            <DepositList deposits={formattedDeposits} />
          </div>
        </div>
      </div>

      <DepositModal 
        user={user}
        walletId={walletId}
        open={depositModalOpen} 
        onOpenChange={setDepositModalOpen} 
        onSubmit={handleDepositSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  )
}