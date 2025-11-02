// // components/withdraw-modal.tsx
// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"

// interface WithdrawalModalProps {
//   availableBalance: number
//   user: {
//     id: string
//     walletId?: string
//   }
//   onSubmit?: (data: WithdrawalFormData) => void
//   isSubmitting?: boolean
// }

// export interface WithdrawalFormData {
//   amount: string
//   bankName: string
//   bankAccountName: string
//   bankBranch: string
//   AccountNo?: string
//   AccountName?: string
//   referenceNo?: string
//   method?: string
//   description?: string
//   walletId: string
// }

// export function WithdrawalModal({ availableBalance, user, onSubmit, isSubmitting }: WithdrawalModalProps) {
//   const [open, setOpen] = useState(false)
//   const [formData, setFormData] = useState<WithdrawalFormData>({
//     amount: "",
//     bankName: "",
//     bankAccountName: "",
//     bankBranch: "",
//     AccountNo: "",
//     AccountName: "",
//     description: "",
//     method: "Bank Transfer",
//     walletId: user.walletId || "",
//   })

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!formData.walletId) {
//       alert("Wallet ID not found. Please contact support.")
//       return
//     }

//     const amount = parseFloat(formData.amount)
//     if (amount <= 0) {
//       alert("Please enter a valid amount")
//       return
//     }

//     if (amount > availableBalance) {
//       alert(`Insufficient balance. Available: $${availableBalance.toLocaleString()}`)
//       return
//     }

//     if (!formData.bankName || !formData.bankAccountName || !formData.bankBranch) {
//       alert("Please fill in all required bank details")
//       return
//     }

//     onSubmit?.(formData)
//     setFormData({
//       amount: "",
//       bankName: "",
//       bankAccountName: "",
//       bankBranch: "",
//       AccountNo: "",
//       AccountName: "",
//       description: "",
//       method: "Bank Transfer",
//       walletId: user.walletId || "",
//     })
//     setOpen(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button 
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
//           disabled={!user.walletId || availableBalance <= 0}
//         >
//           Create Withdrawal Request
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
//         <DialogHeader>
//           <DialogTitle className="text-white text-xl">Create Withdrawal Request</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//           {/* Available Balance Display */}
//           <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
//             <Label className="text-slate-400 text-sm">Available Balance</Label>
//             <p className="text-2xl font-bold text-green-400 mt-1">
//               ${availableBalance.toLocaleString()}
//             </p>
//           </div>

//           {/* Amount */}
//           <div>
//             <Label htmlFor="amount" className="text-white">
//               Withdrawal Amount <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="amount"
//               type="number"
//               step="0.01"
//               min="0"
//               max={availableBalance}
//               placeholder="Enter amount"
//               value={formData.amount}
//               onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//               className="bg-slate-800 border-slate-700 text-white mt-2"
//               disabled={isSubmitting}
//               required
//             />
//           </div>

//           {/* Bank Details Section */}
//           <div className="border-t border-slate-700 pt-4">
//             <h3 className="text-white font-semibold mb-4">Bank Details</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="bankName" className="text-white">
//                   Bank Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="bankName"
//                   placeholder="e.g., STANBIC BANK"
//                   value={formData.bankName}
//                   onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
//                   className="bg-slate-800 border-slate-700 text-white mt-2"
//                   disabled={isSubmitting}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="bankBranch" className="text-white">
//                   Bank Branch <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="bankBranch"
//                   placeholder="e.g., Main Branch"
//                   value={formData.bankBranch}
//                   onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
//                   className="bg-slate-800 border-slate-700 text-white mt-2"
//                   disabled={isSubmitting}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="mt-4">
//               <Label htmlFor="bankAccountName" className="text-white">
//                 Account Name <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="bankAccountName"
//                 placeholder="Account holder name"
//                 value={formData.bankAccountName}
//                 onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
//                 className="bg-slate-800 border-slate-700 text-white mt-2"
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>

//             <div className="mt-4">
//               <Label htmlFor="AccountNo" className="text-white">
//                 Account Number
//               </Label>
//               <Input
//                 id="AccountNo"
//                 placeholder="Bank account number"
//                 value={formData.AccountNo}
//                 onChange={(e) => setFormData({ ...formData, AccountNo: e.target.value })}
//                 className="bg-slate-800 border-slate-700 text-white mt-2"
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <Label htmlFor="description" className="text-white">
//               Description (Optional)
//             </Label>
//             <Textarea
//               id="description"
//               placeholder="Add any additional notes"
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="bg-slate-800 border-slate-700 text-white mt-2 min-h-[80px]"
//               disabled={isSubmitting}
//             />
//           </div>

//           {/* Submit Button */}
//           <Button 
//             type="submit" 
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }



// components/withdraw-modal.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface WithdrawalModalProps {
  availableBalance: number
  user: {
    id: string
    walletId: string
    accountNumber: string
  }
  onSubmit?: (data: WithdrawalFormData) => void
  isSubmitting?: boolean
}

export interface WithdrawalFormData {
  amount: string
  bankName: string
  bankAccountName: string
  bankBranch: string
  AccountNo: string
  AccountName?: string
  referenceNo: string
  method: string
  description?: string
  walletId: string
}

export function WithdrawalModal({ availableBalance, user, onSubmit, isSubmitting }: WithdrawalModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: "",
    bankName: "",
    bankAccountName: "",
    bankBranch: "",
    AccountNo: user.accountNumber, // Pre-fill with wallet account number
    AccountName: "",
    description: "",
    method: "Bank Transfer",
    referenceNo: user.accountNumber, // Use wallet account number as reference
    walletId: user.walletId,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.walletId) {
      alert("Wallet ID not found. Please contact support.")
      return
    }

    const amount = parseFloat(formData.amount)
    if (amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    if (amount > availableBalance) {
      alert(`Insufficient balance. Available: $${availableBalance.toLocaleString()}`)
      return
    }

    if (!formData.bankName || !formData.bankAccountName || !formData.bankBranch) {
      alert("Please fill in all required bank details")
      return
    }

    onSubmit?.(formData)
    setFormData({
      amount: "",
      bankName: "",
      bankAccountName: "",
      bankBranch: "",
      AccountNo: user.accountNumber,
      AccountName: "",
      description: "",
      method: "Bank Transfer",
      referenceNo: user.accountNumber,
      walletId: user.walletId,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          disabled={!user.walletId || availableBalance <= 0}
        >
          Create Withdrawal Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Create Withdrawal Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Available Balance Display */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-slate-400 text-sm">Available Balance</Label>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  ${availableBalance.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <Label className="text-slate-400 text-sm">Account Number</Label>
                <p className="text-white font-mono text-sm mt-1">
                  {user.accountNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="text-white">
              Withdrawal Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={availableBalance}
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white mt-2"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Bank Details Section */}
          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-white font-semibold mb-4">Bank Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName" className="text-white">
                  Bank Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankName"
                  placeholder="e.g., STANBIC BANK"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankBranch" className="text-white">
                  Bank Branch <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankBranch"
                  placeholder="e.g., Main Branch"
                  value={formData.bankBranch}
                  onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-2"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="bankAccountName" className="text-white">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bankAccountName"
                placeholder="Account holder name"
                value={formData.bankAccountName}
                onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="AccountNo" className="text-white">
                Bank Account Number
              </Label>
              <Input
                id="AccountNo"
                placeholder="Bank account number"
                value={formData.AccountNo}
                onChange={(e) => setFormData({ ...formData, AccountNo: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                disabled={isSubmitting}
              />
              <p className="text-slate-500 text-xs mt-1">
                Default: {user.accountNumber}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add any additional notes"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white mt-2 min-h-[80px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}