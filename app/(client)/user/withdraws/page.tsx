// "use client"

// import { Button } from "@/components/ui/button"
// import { WithdrawalList } from "@/components/user/withdraw-list"

// const sampleWithdrawals = [
//   {
//     id: "1",
//     amount: "$300.00",
//     bankName: "STANBIC BANK UGANDA LIMITED",
//     bankAccountName: "GoldKach Uganda Ltd",
//     status: "completed" as const,
//     date: "Nov 18, 2024",
//     transactionId: "TXN-2024-W001",
//     referenceNo: "REF-001-24",
//   },
//   {
//     id: "2",
//     amount: "$500.00",
//     bankName: "BANK OF UGANDA",
//     bankAccountName: "John Doe",
//     status: "completed" as const,
//     date: "Nov 15, 2024",
//     transactionId: "TXN-2024-W002",
//     referenceNo: "REF-002-24",
//   },
//   {
//     id: "3",
//     amount: "$200.00",
//     bankName: "STANBIC BANK UGANDA LIMITED",
//     bankAccountName: "GoldKach Uganda Ltd",
//     status: "pending" as const,
//     date: "Nov 19, 2024",
//     transactionId: "TXN-2024-W003",
//     referenceNo: "REF-003-24",
//   },
//   {
//     id: "4",
//     amount: "$150.00",
//     bankName: "DFCU BANK",
//     bankAccountName: "Business Account",
//     status: "failed" as const,
//     date: "Nov 12, 2024",
//     transactionId: "TXN-2024-W004",
//     referenceNo: "REF-004-24",
//   },
// ]

// const totalWithdrawn = sampleWithdrawals
//   .filter((w) => w.status === "completed")
//   .reduce((sum, w) => sum + Number.parseFloat(w.amount.replace(/[$,]/g, "")), 0)
//   .toFixed(2)

// export default function WithdrawalsPage() {
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="space-y-8">
//           <div>
//             <h1 className="text-4xl font-bold text-white mb-2">Withdrawals</h1>
//             <p className="text-slate-400">View and manage your withdrawal history</p>
//           </div>

//           <div className="flex gap-4">
//             <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Create Withdrawal Request</Button>
//             <Button
//               variant="outline"
//               className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
//               onClick={() => (window.location.href = "/user/deposits")}
//             >
//               Back to Deposits
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 border border-slate-700 rounded-lg p-6 bg-slate-900/50">
//               <h2 className="text-white font-semibold mb-4">Withdrawal History</h2>
//               <WithdrawalList withdrawals={sampleWithdrawals} />
//             </div>

//             <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
//               <h2 className="text-white font-semibold mb-4">Withdrawal Summary</h2>
//               <p className="text-3xl font-bold text-blue-400">${totalWithdrawn}</p>
//               <p className="text-slate-400 text-sm mt-2">
//                 {sampleWithdrawals.filter((w) => w.status === "completed").length} completed withdrawals
//               </p>
//               <div className="mt-6 pt-6 border-t border-slate-700">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between text-slate-400">
//                     <span>Pending:</span>
//                     <span className="text-yellow-400">
//                       $
//                       {sampleWithdrawals
//                         .filter((w) => w.status === "pending")
//                         .reduce((sum, w) => sum + Number.parseFloat(w.amount.replace(/[$,]/g, "")), 0)
//                         .toFixed(2)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-slate-400">
//                     <span>Failed:</span>
//                     <span className="text-red-400">
//                       $
//                       {sampleWithdrawals
//                         .filter((w) => w.status === "failed")
//                         .reduce((sum, w) => sum + Number.parseFloat(w.amount.replace(/[$,]/g, "")), 0)
//                         .toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }





"use client"

import { Button } from "@/components/ui/button"
import { WithdrawalList } from "@/components/user/withdraw-list"
import { WithdrawalModal } from "@/components/withdraw-modal"


const sampleWithdrawals = [
  {
    id: "1",
    amount: "$300.00",
    bankName: "STANBIC BANK UGANDA LIMITED",
    bankAccountName: "GoldKach Uganda Ltd",
    status: "completed" as const,
    date: "Nov 18, 2024",
    transactionId: "TXN-2024-W001",
    referenceNo: "REF-001-24",
  },
  {
    id: "2",
    amount: "$500.00",
    bankName: "BANK OF UGANDA",
    bankAccountName: "John Doe",
    status: "completed" as const,
    date: "Nov 15, 2024",
    transactionId: "TXN-2024-W002",
    referenceNo: "REF-002-24",
  },
  {
    id: "3",
    amount: "$200.00",
    bankName: "STANBIC BANK UGANDA LIMITED",
    bankAccountName: "GoldKach Uganda Ltd",
    status: "pending" as const,
    date: "Nov 19, 2024",
    transactionId: "TXN-2024-W003",
    referenceNo: "REF-003-24",
  },
  {
    id: "4",
    amount: "$150.00",
    bankName: "DFCU BANK",
    bankAccountName: "Business Account",
    status: "failed" as const,
    date: "Nov 12, 2024",
    transactionId: "TXN-2024-W004",
    referenceNo: "REF-004-24",
  },
]

const totalWithdrawn = sampleWithdrawals
  .filter((w) => w.status === "completed")
  .reduce((sum, w) => sum + Number.parseFloat(w.amount.replace(/[$,]/g, "")), 0)
  .toFixed(2)

export default function WithdrawalsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Withdrawals</h1>
            <p className="text-slate-400">View and manage your withdrawal history</p>
          </div>

          <div className="flex gap-4">
            <WithdrawalModal trigger="Create Withdrawal Request" availableBalance={35557} />
            <Button
              variant="outline"
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
              onClick={() => (window.location.href = "/")}
            >
              Back to Deposits
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
              onClick={() => (window.location.href = "/reports")}
            >
              View Reports
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h2 className="text-white font-semibold mb-4">Withdrawal History</h2>
              <WithdrawalList withdrawals={sampleWithdrawals} />
            </div>

            <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h2 className="text-white font-semibold mb-4">Withdrawal Summary</h2>
              <p className="text-3xl font-bold text-blue-400">${totalWithdrawn}</p>
              <p className="text-slate-400 text-sm mt-2">
                {sampleWithdrawals.filter((w) => w.status === "completed").length} completed withdrawals
              </p>
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Pending:</span>
                    <span className="text-yellow-400">
                      $
                      {sampleWithdrawals
                        .filter((w) => w.status === "pending")
                        .reduce((sum, w) => sum + Number.parseFloat(w.amount.replace(/[$,]/g, "")), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Failed:</span>
                    <span className="text-red-400">
                      $
                      {sampleWithdrawals
                        .filter((w) => w.status === "failed")
                        .reduce((sum, w) => sum + Number.parseFloat(w.amount.replace(/[$,]/g, "")), 0)
                        .toFixed(2)}
                    </span>
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
