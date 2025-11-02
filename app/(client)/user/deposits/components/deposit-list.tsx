// components/user/depositlist.tsx
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Clock, 
  XCircle,
  ArrowUpRight 
} from "lucide-react"

type DepositStatus = "pending" | "approved" | "rejected"

type DepositItem = {
  id: string
  amount: string
  method: string
  status: DepositStatus
  date: string
  transactionId: string
  description?: string
}

const statusConfig: Record<DepositStatus, {
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

export function DepositList({ deposits }: { deposits: DepositItem[] }) {
  if (deposits.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-700 rounded-lg">
        <div className="flex justify-center mb-4">
          <ArrowUpRight className="h-12 w-12 text-slate-600" />
        </div>
        <p className="text-slate-400 text-sm">No deposits yet</p>
        <p className="text-slate-500 text-xs mt-1">
          Create your first deposit request to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {deposits.map((deposit) => {
        const config = statusConfig[deposit.status]
        const StatusIcon = config.icon

        return (
          <Card
            key={deposit.id}
            className="p-4 border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all hover:border-slate-600"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                {/* Amount and Status */}
                <div className="flex items-center gap-3">
                  <p className="text-white font-semibold text-lg">
                    {deposit.amount}
                  </p>
                  <Badge 
                    variant="outline"
                    className={`text-xs px-2 py-1 border ${config.color}`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>

                {/* Method */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">via</span>
                  <p className="text-slate-400 text-sm font-medium">
                    {deposit.method}
                  </p>
                </div>

                {/* Description if available */}
                {deposit.description && (
                  <p className="text-slate-500 text-xs italic">
                    {deposit.description}
                  </p>
                )}

                {/* Transaction ID */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-slate-600 text-xs">ID:</span>
                  <code className="text-slate-500 text-xs font-mono bg-slate-900/50 px-2 py-0.5 rounded">
                    {deposit.transactionId}
                  </code>
                </div>
              </div>

              {/* Date */}
              <div className="text-right ml-4">
                <p className="text-slate-400 text-sm whitespace-nowrap">
                  {deposit.date}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}