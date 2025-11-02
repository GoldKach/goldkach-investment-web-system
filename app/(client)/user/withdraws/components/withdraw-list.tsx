// components/user/withdraw-list.tsx
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Clock, 
  XCircle,
  ArrowDownRight,
  Building2
} from "lucide-react"

type WithdrawalStatus = "pending" | "approved" | "rejected"

type WithdrawalItem = {
  id: string
  amount: string
  bankName: string
  bankAccountName: string
  status: WithdrawalStatus
  date: string
  transactionId: string
  referenceNo: string
  bankBranch?: string
  method?: string
  description?: string
}

const statusConfig: Record<WithdrawalStatus, {
  color: string
  icon: typeof Clock
  label: string
}> = {
  pending: {
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Clock,
    label: "Pending"
  },
  approved: {
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2,
    label: "Approved"
  },
  rejected: {
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
    label: "Rejected"
  }
}

export function WithdrawalList({ withdrawals }: { withdrawals: WithdrawalItem[] }) {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-700 rounded-lg">
        <div className="flex justify-center mb-4">
          <ArrowDownRight className="h-12 w-12 text-slate-600" />
        </div>
        <p className="text-slate-400 text-sm">No withdrawals yet</p>
        <p className="text-slate-500 text-xs mt-1">
          Create your first withdrawal request to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {withdrawals.map((withdrawal) => {
        const config = statusConfig[withdrawal.status]
        const StatusIcon = config.icon

        return (
          <Card
            key={withdrawal.id}
            className="p-4 border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all hover:border-slate-600"
          >
            <div className="space-y-3">
              {/* Amount and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-white font-semibold text-lg">
                    {withdrawal.amount}
                  </p>
                  <Badge 
                    variant="outline"
                    className={`text-xs px-2 py-1 border ${config.color}`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">
                  {withdrawal.date}
                </p>
              </div>

              {/* Bank Details */}
              <div className="flex items-start gap-2 bg-slate-900/50 p-3 rounded">
                <Building2 className="h-4 w-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {withdrawal.bankName}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {withdrawal.bankAccountName}
                    {withdrawal.bankBranch && ` · ${withdrawal.bankBranch}`}
                  </p>
                </div>
              </div>

              {/* Description if available */}
              {withdrawal.description && (
                <p className="text-slate-500 text-xs italic px-3">
                  {withdrawal.description}
                </p>
              )}

              {/* Reference and Transaction ID */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-600">Ref:</span>
                  <code className="text-slate-500 ml-1 font-mono">
                    {withdrawal.referenceNo}
                  </code>
                </div>
                <div>
                  <span className="text-slate-600">TX ID:</span>
                  <code className="text-slate-500 ml-1 font-mono">
                    {withdrawal.transactionId}
                  </code>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}