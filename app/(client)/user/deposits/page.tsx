// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { DepositModal } from "@/components/deposit-modal"

// export default function Home() {
//   const [depositModalOpen, setDepositModalOpen] = useState(false)

//   const handleDepositSubmit = (data: any) => {
//     console.log("Deposit request submitted:", data)
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="space-y-8">
//           <div>
//             <h1 className="text-4xl font-bold text-white mb-2">Wallet Management</h1>
//             <p className="text-slate-400">Manage your deposits and withdrawals</p>
//           </div>

//           <div className="flex gap-4">
//             <Button
//               onClick={() => setDepositModalOpen(true)}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
//             >
//               Create Deposit Request
//             </Button>
//             <Button
//               variant="outline"
//               className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
//             >
//               Withdraw
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
//               <h2 className="text-white font-semibold mb-4">Recent Deposits</h2>
//               <p className="text-slate-400 text-sm">No deposits yet. Start by creating a deposit request.</p>
//             </div>

//             <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
//               <h2 className="text-white font-semibold mb-4">Wallet Balance</h2>
//               <p className="text-3xl font-bold text-blue-400">$0.00</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <DepositModal open={depositModalOpen} onOpenChange={setDepositModalOpen} onSubmit={handleDepositSubmit}/>
//     </main>
//   )
// }



"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DepositModal } from "@/components/deposit-modal"
import { DepositList } from "@/components/user/depositlist"
import Link from "next/link"

const sampleDeposits = [
  {
    id: "1",
    amount: "$500.00",
    method: "Bank Transfer",
    status: "completed" as const,
    date: "Nov 15, 2024",
    transactionId: "TXN-2024-001",
  },
  {
    id: "2",
    amount: "$1,200.00",
    method: "Mobile Money",
    status: "completed" as const,
    date: "Nov 10, 2024",
    transactionId: "TXN-2024-002",
  },
  {
    id: "3",
    amount: "$750.00",
    method: "Bank Transfer",
    status: "pending" as const,
    date: "Nov 18, 2024",
    transactionId: "TXN-2024-003",
  },
]

const totalBalance = sampleDeposits
  .filter((d) => d.status === "completed")
  .reduce((sum, d) => sum + Number.parseFloat(d.amount.replace(/[$,]/g, "")), 0)
  .toFixed(2)

export default function Home() {
  const [depositModalOpen, setDepositModalOpen] = useState(false)

  const handleDepositSubmit = (data: any) => {
    console.log("Deposit request submitted:", data)
    // Handle deposit submission here
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
            >
              Create Deposit Request
            </Button>
           <Link href="/user/withdraws">
              <Button
              variant="outline"
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent"
            >
              Withdraw
            </Button></Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h2 className="text-white font-semibold mb-4">Recent Deposits</h2>
              <DepositList deposits={sampleDeposits} />
            </div>

            <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
              <h2 className="text-white font-semibold mb-4">Wallet Balance</h2>
              <p className="text-3xl font-bold text-blue-400">${totalBalance}</p>
              <p className="text-slate-400 text-sm mt-2">
                {sampleDeposits.filter((d) => d.status === "completed").length} completed deposits
              </p>
            </div>
          </div>
        </div>
      </div>

      <DepositModal open={depositModalOpen} onOpenChange={setDepositModalOpen} onSubmit={handleDepositSubmit} />
    </main>
  )
}
