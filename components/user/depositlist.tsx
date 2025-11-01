interface Deposit {
  id: string
  amount: string
  method: string
  status: "pending" | "completed" | "failed"
  date: string
  transactionId: string
}

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
}

export function DepositList({ deposits }: { deposits: Deposit[] }) {
  return (
    <div className="space-y-3">
      {deposits.map((deposit) => (
        <div
          key={deposit.id}
          className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-white font-semibold">{deposit.amount}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[deposit.status]}`}>
                {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{deposit.method}</p>
            <p className="text-slate-500 text-xs mt-1">ID: {deposit.transactionId}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">{deposit.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
