interface Withdrawal {
  id: string
  amount: string
  bankName: string
  bankAccountName: string
  status: "pending" | "completed" | "failed"
  date: string
  transactionId: string
  referenceNo: string
}

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
}

export function WithdrawalList({ withdrawals }: { withdrawals: Withdrawal[] }) {
  return (
    <div className="space-y-3">
      {withdrawals.map((withdrawal) => (
        <div
          key={withdrawal.id}
          className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p className="text-white font-semibold">{withdrawal.amount}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[withdrawal.status]}`}>
                {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              {withdrawal.bankName} - {withdrawal.bankAccountName}
            </p>
            <div className="flex gap-4 text-slate-500 text-xs mt-1">
              <p>ID: {withdrawal.transactionId}</p>
              <p>Ref: {withdrawal.referenceNo}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">{withdrawal.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
