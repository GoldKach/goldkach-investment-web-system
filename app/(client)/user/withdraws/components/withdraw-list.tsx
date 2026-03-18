

// // components/user/withdraw-list.tsx
// import { Badge } from "@/components/ui/badge"
// import { Card } from "@/components/ui/card"
// import { 
//   CheckCircle2, 
//   Clock, 
//   XCircle,
//   ArrowDownRight,
//   Building2
// } from "lucide-react"

// type WithdrawalStatus = "pending" | "approved" | "rejected"

// type WithdrawalItem = {
//   id: string
//   amount: string
//   bankName: string
//   bankAccountName: string
//   status: WithdrawalStatus
//   date: string
//   transactionId: string
//   referenceNo: string
//   bankBranch?: string
//   method?: string
//   description?: string
//   accountNo?: string
// }

// const statusConfig: Record<WithdrawalStatus, {
//   badgeClass: string
//   icon: typeof Clock
//   label: string
// }> = {
//   pending: {
//     badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
//     icon: Clock,
//     label: "Pending"
//   },
//   approved: {
//     badgeClass: "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
//     icon: CheckCircle2,
//     label: "Approved"
//   },
//   rejected: {
//     badgeClass: "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
//     icon: XCircle,
//     label: "Rejected"
//   }
// }

// export function WithdrawalList({ withdrawals }: { withdrawals: WithdrawalItem[] }) {
//   if (withdrawals.length === 0) {
//     return (
//       <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-transparent">
//         <div className="flex justify-center mb-4">
//           <ArrowDownRight className="h-12 w-12 text-slate-400 dark:text-slate-600" />
//         </div>
//         <p className="text-slate-600 dark:text-slate-400 text-sm">No withdrawals yet</p>
//         <p className="text-slate-500 text-xs mt-1">
//           Create your first withdrawal request to get started
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-3">
//       {withdrawals.map((withdrawal) => {
//         const config = statusConfig[withdrawal.status]
//         const StatusIcon = config.icon

//         return (
//           <Card
//             key={withdrawal.id}
//             className="p-4 border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
//           >
//             <div className="space-y-3">
//               {/* Amount and Status */}
//               <div className="flex items-center justify-between flex-wrap gap-2">
//                 <div className="flex items-center gap-3">
//                   <p className="text-slate-900 dark:text-white font-semibold text-lg">
//                     {withdrawal.amount}
//                   </p>
//                   <Badge 
//                     variant="outline"
//                     className={`text-xs px-2 py-1 border ${config.badgeClass}`}
//                   >
//                     <StatusIcon className="h-3 w-3 mr-1" />
//                     {config.label}
//                   </Badge>
//                 </div>
//                 <p className="text-slate-900 dark:text-slate-400 text-sm">
//                   {withdrawal.date}
//                 </p>
//               </div>

//               {/* Bank Details */}
//               <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
//                 <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-slate-900 dark:text-white text-sm font-medium">
//                     {withdrawal.bankName}
//                   </p>
//                   <p className="text-slate-600 dark:text-slate-400 text-xs truncate">
//                     {withdrawal.bankAccountName}
//                     {withdrawal.bankBranch && ` · ${withdrawal.bankBranch}`}
//                   </p>
//                 </div>
//               </div>

//               {/* Description if available */}
//               {withdrawal.description && (
//                 <p className="text-slate-600 dark:text-slate-500 text-xs italic px-3 py-2 bg-slate-50 dark:bg-slate-900/30 rounded border border-slate-200 dark:border-slate-700">
//                   {withdrawal.description}
//                 </p>
//               )}

//               {/* Account Number if available */}
//               {withdrawal.accountNo && (
//                 <p className="text-slate-500 dark:text-slate-500 text-xs px-3">
//                   A/C No: <span className="font-mono">{withdrawal.accountNo}</span>
//                 </p>
//               )}

//               {/* Reference and Transaction ID */}
//               <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
//                 <div>
//                   <span className="text-slate-500 dark:text-slate-600 font-medium">Ref:</span>
//                   <code className="text-slate-700 dark:text-slate-500 ml-1 font-mono block truncate">
//                     {withdrawal.referenceNo}
//                   </code>
//                 </div>
//                 <div>
//                   <span className="text-slate-500 dark:text-slate-600 font-medium">TX ID:</span>
//                   <code className="text-slate-700 dark:text-slate-500 ml-1 font-mono block truncate">
//                     {withdrawal.transactionId}
//                   </code>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }




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
  accountNo?: string
}

const statusConfig: Record<WithdrawalStatus, {
  badgeClass: string
  icon: typeof Clock
  label: string
}> = {
  pending: {
    badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
    icon: Clock,
    label: "Pending"
  },
  approved: {
    badgeClass: "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
    icon: CheckCircle2,
    label: "Approved"
  },
  rejected: {
    badgeClass: "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    icon: XCircle,
    label: "Rejected"
  }
}

export function WithdrawalList({ withdrawals }: { withdrawals: WithdrawalItem[] }) {
  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-transparent">
        <div className="flex justify-center mb-4">
          <ArrowDownRight className="h-12 w-12 text-slate-400 dark:text-slate-600" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">No withdrawals yet</p>
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
            className="p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all hover:border-slate-400 dark:hover:border-slate-600 shadow-sm"
          >
            <div className="space-y-3">
              {/* Amount and Status */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <p className="text-slate-900 dark:text-white font-semibold text-lg">
                    {withdrawal.amount}
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-1 border ${config.badgeClass}`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {withdrawal.date}
                </p>
              </div>

              {/* Bank Details */}
              <div className="flex items-start gap-2 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-300 dark:border-slate-700">
                <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white text-sm font-medium">
                    {withdrawal.bankName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs truncate">
                    {withdrawal.bankAccountName}
                    {withdrawal.bankBranch && ` · ${withdrawal.bankBranch}`}
                  </p>
                </div>
              </div>

              {/* Description if available */}
              {withdrawal.description && (
                <p className="text-slate-600 dark:text-slate-500 text-xs italic px-3 py-2 bg-slate-100 dark:bg-slate-900/30 rounded border border-slate-300 dark:border-slate-700">
                  {withdrawal.description}
                </p>
              )}

              {/* Account Number if available */}
              {withdrawal.accountNo && (
                <p className="text-slate-500 dark:text-slate-500 text-xs px-3">
                  A/C No: <span className="font-mono">{withdrawal.accountNo}</span>
                </p>
              )}

              {/* Reference and Transaction ID */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 dark:text-slate-500 font-medium">Ref:</span>
                  <code className="text-slate-800 dark:text-slate-400 ml-1 font-mono block truncate">
                    {withdrawal.referenceNo}
                  </code>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-500 font-medium">TX ID:</span>
                  <code className="text-slate-800 dark:text-slate-400 ml-1 font-mono block truncate">
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