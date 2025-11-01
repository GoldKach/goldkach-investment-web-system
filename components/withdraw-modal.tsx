"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WithdrawalModalProps {
  trigger?: React.ReactNode
  onSubmit?: (data: WithdrawalFormData) => void
  availableBalance?: number
}

interface WithdrawalFormData {
  bankAccount: string
  amount: string
  bankAccountNumber: string
  bankAccountName: string
  bankNameAndBranch: string
}

export function WithdrawalModal({
  trigger = "Create Withdrawal Request",
  onSubmit,
  availableBalance = 35557,
}: WithdrawalModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<WithdrawalFormData>({
    bankAccount: "",
    amount: "",
    bankAccountNumber: "",
    bankAccountName: "",
    bankNameAndBranch: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setFormData({
      bankAccount: "",
      amount: "",
      bankAccountNumber: "",
      bankAccountName: "",
      bankNameAndBranch: "",
    })
    setOpen(false)
  }

  const handleInputChange = (field: keyof WithdrawalFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {typeof trigger === "string" ? (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">{trigger}</Button>
        ) : (
          trigger
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Withdrawal Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Withdrawal Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Withdrawal Method</label>
            <select
              value={formData.bankAccount}
              onChange={(e) => handleInputChange("bankAccount", e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Bank Account</option>
              <option value="bank1">STANBIC BANK UGANDA LIMITED</option>
              <option value="bank2">BANK OF UGANDA</option>
              <option value="bank3">DFCU BANK</option>
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Bank Account Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bank Account Number</label>
            <input
              type="text"
              value={formData.bankAccountNumber}
              onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
              placeholder="Enter account number"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Bank Account Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bank Account Name</label>
            <input
              type="text"
              value={formData.bankAccountName}
              onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
              placeholder="Enter account name"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Bank Name and Branch */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bank Name and Branch</label>
            <input
              type="text"
              value={formData.bankNameAndBranch}
              onChange={(e) => handleInputChange("bankNameAndBranch", e.target.value)}
              placeholder="Enter bank name and branch"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Available Balance */}
          <div className="pt-4 border-t border-slate-700">
            <p className="text-slate-400">
              Available Balance: <span className="text-white font-semibold">${availableBalance.toLocaleString()}</span>
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium rounded-lg">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
